const express       = require("express");
const router        = express.Router();
const orderService  = require("../services/order.service");
const waiterService = require("../services/waiter.service");
const tableService  = require("../services/table.service");
const { successResponse, errorResponse, notFound } = require("../middleware/response");

let io;
function setSocketIo(ioInstance) {
  io = ioInstance;
}

// ─────────────────────────────────────────────
// POST /orders
// PASSO 1 — Inicia atendimento (mesa + garçom)
// Body: { tableId, waiterId }
// ─────────────────────────────────────────────
router.post("/", (req, res) => {
  const { tableId, waiterId } = req.body;

  if (!tableId || !waiterId) {
    return errorResponse(res, "tableId e waiterId são obrigatórios.");
  }

  const result = orderService.startOrder(tableId, waiterId);
  if (!result.success) return errorResponse(res, result.error);

  // Notifica o garçom que foi atribuído a uma mesa
  const waiterSocketId = waiterService.getWaiterSocketId(waiterId);
  if (io && waiterSocketId) {
    const table = tableService.getTableById(tableId);
    io.to(waiterSocketId).emit("waiter:assigned", {
      message:     `Você foi designado para a Mesa ${table.number}.`,
      orderId:     result.order.id,
      tableId,
      tableNumber: table.number,
    });
  }

  return successResponse(res, { order: result.order }, 201);
});

// ─────────────────────────────────────────────
// POST /orders/:id/items
// PASSO 2 — Adiciona itens ao pedido (pode chamar N vezes)
// Body: { items: [{ menuItemId, quantity, notes? }] }
// ──────────────────────────────────────────��──
router.post("/:id/items", (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return errorResponse(res, "O campo 'items' deve ser um array.");
  }

  const result = orderService.addItemsToOrder(req.params.id, items);
  if (!result.success) return errorResponse(res, result.error || result.errors?.join(", "));

  return successResponse(res, { order: result.order, warnings: result.warnings });
});

// ─────────────────────────────────────────────
// POST /orders/:id/close
// PASSO 3 — Cliente encerra e pede a conta
// Garçom recebe notificação via Socket.io
// ─────────────────────────────────────────────
router.post("/:id/close", (req, res) => {
  const result = orderService.closeOrder(req.params.id);
  if (!result.success) return errorResponse(res, result.error);

  const { waiterId, tableId } = result.order;
  const waiterSocketId = waiterService.getWaiterSocketId(waiterId);
  const table = tableService.getTableById(tableId);

  if (io && waiterSocketId) {
    io.to(waiterSocketId).emit("order:payment_requested", {
      message:     `A Mesa ${table.number} está pedindo a conta!`,
      orderId:     result.order.id,
      tableId,
      tableNumber: table.number,
      total:       result.order.total,
    });
  }

  if (io) {
    io.to("managers").emit("order:payment_requested", {
      orderId:     result.order.id,
      tableNumber: table?.number,
      waiterId,
      total:       result.order.total,
    });
  }

  return successResponse(res, { order: result.order });
});

// ─────────────────────────────────────────────
// POST /orders/:id/pay
// PASSO 4 — Garçom confirma o pagamento
// Mesa e garçom são liberados automaticamente
// ─────────────────────────────────────────────
router.post("/:id/pay", (req, res) => {
  const result = orderService.payOrder(req.params.id);
  if (!result.success) return errorResponse(res, result.error);

  const table = tableService.getTableById(result.order.tableId);

  if (io) {
    io.emit("table:available", {
      message:     `Mesa ${table?.number} está disponível novamente.`,
      tableId:     result.order.tableId,
      tableNumber: table?.number,
    });
  }

  return successResponse(res, { order: result.order });
});

// ─────────────────────────────────────────────
// CONSULTAS
// ─────────────────────────────────────────────

// GET /orders — todos os pedidos
router.get("/", (req, res) => {
  successResponse(res, { orders: orderService.getAllOrders() });
});

// GET /orders/active — pedidos em aberto
router.get("/active", (req, res) => {
  successResponse(res, { orders: orderService.getActiveOrders() });
});

// GET /orders/table/:tableId — pedido ativo de uma mesa
router.get("/table/:tableId", (req, res) => {
  const order = orderService.getOrderByTableId(req.params.tableId);
  if (!order) return notFound(res, "Nenhum pedido ativo para esta mesa.");
  successResponse(res, { order });
});

// GET /orders/:id — detalhes de um pedido
router.get("/:id", (req, res) => {
  const order = orderService.getOrderById(req.params.id);
  if (!order) return notFound(res, "Pedido não encontrado.");
  successResponse(res, { order });
});

module.exports = { router, setSocketIo };

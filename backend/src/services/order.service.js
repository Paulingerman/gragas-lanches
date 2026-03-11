const { orders, menuItems } = require("../data/store");
const { ORDER_STATUS, createOrder, createOrderItem, recalculateOrder } = require("../models/order.model");
const tableService  = require("./table.service");
const waiterService = require("./waiter.service");

// ─────────────────────────────────────────────
// CRIAÇÃO DO PEDIDO
// ─────────────────────────────────────────────
function startOrder(tableId, waiterId) {
  const tableResult = tableService.occupyTable(tableId, "__temp__");
  if (!tableResult.success) {
    return { success: false, error: tableResult.error };
  }

  const waiterResult = waiterService.assignWaiter(waiterId, tableId);
  if (!waiterResult.success) {
    tableService.releaseTable(tableId);
    return { success: false, error: waiterResult.error };
  }

  const order = createOrder(tableId, waiterId);

  // Atualiza mesa com o ID real do pedido
  const table = tableService.getTableById(tableId);
  table.currentOrderId = order.id;

  orders.push(order);
  return { success: true, order };
}

// ─────────────────────────────────────────────
// ADICIONAR ITENS
// ─────────────────────────────────────────────
function addItemsToOrder(orderId, newItems) {
  const order = getOrderById(orderId);

  if (!order) {
    return { success: false, error: `Pedido "${orderId}" não encontrado.` };
  }
  if (order.status !== ORDER_STATUS.OPEN) {
    return { success: false, error: "Não é possível adicionar itens a um pedido encerrado." };
  }
  if (!Array.isArray(newItems) || newItems.length === 0) {
    return { success: false, error: "Nenhum item enviado." };
  }

  const errors = [];

  for (const entry of newItems) {
    const { menuItemId, quantity, notes } = entry;

    const menuItem = menuItems.find((m) => m.id === menuItemId);
    if (!menuItem) {
      errors.push(`Item de cardápio "${menuItemId}" não encontrado.`);
      continue;
    }
    if (!menuItem.available) {
      errors.push(`Item "${menuItem.name}" está indisponível no momento.`);
      continue;
    }

    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      errors.push(`Quantidade inválida para "${menuItem.name}".`);
      continue;
    }

    order.items.push(createOrderItem(menuItem, qty, notes || ""));
  }

  if (errors.length > 0 && order.items.length === 0) {
    return { success: false, errors };
  }

  recalculateOrder(order);
  return { success: true, order, warnings: errors.length > 0 ? errors : undefined };
}

// ─────────────────────────────────────────────
// ENCERRAR PEDIDO (cliente pede a conta)
// ─────────────────────────────────────────────
function closeOrder(orderId) {
  const order = getOrderById(orderId);

  if (!order) {
    return { success: false, error: `Pedido "${orderId}" não encontrado.` };
  }
  if (order.status !== ORDER_STATUS.OPEN) {
    return { success: false, error: "O pedido já foi encerrado." };
  }
  if (order.items.length === 0) {
    return { success: false, error: "Não é possível encerrar um pedido sem itens." };
  }

  order.status   = ORDER_STATUS.CLOSED;
  order.closedAt = new Date().toISOString();

  recalculateOrder(order);
  return { success: true, order };
}

// ─────────────────────────────────────────────
// PAGAMENTO (ação do garçom)
// ─────────────────────────────────────────────
function payOrder(orderId) {
  const order = getOrderById(orderId);

  if (!order) {
    return { success: false, error: `Pedido "${orderId}" não encontrado.` };
  }
  if (order.status !== ORDER_STATUS.CLOSED) {
    return { success: false, error: "O pedido precisa estar encerrado antes de ser pago." };
  }

  order.status = ORDER_STATUS.PAID;
  order.paidAt = new Date().toISOString();

  tableService.releaseTable(order.tableId);
  waiterService.releaseWaiter(order.waiterId);

  return { success: true, order };
}

// ─────────────────────────────────────────────
// CONSULTAS
// ─────────────────────────────────────────────
function getOrderById(orderId) {
  return orders.find((o) => o.id === orderId) || null;
}

function getAllOrders() {
  return orders;
}

function getActiveOrders() {
  return orders.filter((o) => o.status === ORDER_STATUS.OPEN || o.status === ORDER_STATUS.CLOSED);
}

function getOrderByTableId(tableId) {
  return orders.find(
    (o) => o.tableId === tableId && (o.status === ORDER_STATUS.OPEN || o.status === ORDER_STATUS.CLOSED)
  ) || null;
}

module.exports = { startOrder, addItemsToOrder, closeOrder, payOrder, getOrderById, getAllOrders, getActiveOrders, getOrderByTableId };

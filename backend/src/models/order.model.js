const { v4: uuidv4 } = require("uuid");

/**
 * Status possíveis de um pedido:
 *  open    → mesa ocupada, cliente ainda pedindo
 *  closed  → cliente encerrou, aguardando pagamento do garçom
 *  paid    → pago, mesa liberada
 */
const ORDER_STATUS = {
  OPEN:   "open",
  CLOSED: "closed",
  PAID:   "paid",
};

function createOrder(tableId, waiterId) {
  return {
    id:            uuidv4(),
    tableId,
    waiterId,
    status:        ORDER_STATUS.OPEN,
    items:         [],
    subtotal:      0,
    serviceCharge: 0,
    total:         0,
    createdAt:     new Date().toISOString(),
    closedAt:      null,
    paidAt:        null,
  };
}

function createOrderItem(menuItem, quantity, notes = "") {
  return {
    id:          uuidv4(),
    menuItemId:  menuItem.id,
    name:        menuItem.name,
    category:    menuItem.category,
    unitPrice:   menuItem.price,
    quantity,
    notes,
    lineTotal:   parseFloat((menuItem.price * quantity).toFixed(2)),
    addedAt:     new Date().toISOString(),
  };
}

function recalculateOrder(order) {
  const subtotal      = order.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const serviceCharge = parseFloat((subtotal * 0.10).toFixed(2));
  const total         = parseFloat((subtotal + serviceCharge).toFixed(2));

  order.subtotal      = parseFloat(subtotal.toFixed(2));
  order.serviceCharge = serviceCharge;
  order.total         = total;
}

module.exports = { ORDER_STATUS, createOrder, createOrderItem, recalculateOrder };

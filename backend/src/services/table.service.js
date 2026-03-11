const { tables } = require("../data/store");

function getAllTables() {
  return tables.map(sanitizeTable);
}

function getAvailableTables() {
  return tables.filter((t) => t.status === "available").map(sanitizeTable);
}

function getTableById(tableId) {
  return tables.find((t) => t.id === tableId) || null;
}

function occupyTable(tableId, orderId) {
  const table = getTableById(tableId);

  if (!table) {
    return { success: false, error: `Mesa com id "${tableId}" não encontrada.` };
  }
  if (table.status !== "available") {
    return { success: false, error: `Mesa ${table.number} já está ocupada.` };
  }

  table.status         = "occupied";
  table.currentOrderId = orderId;

  return { success: true, table: sanitizeTable(table) };
}

function releaseTable(tableId) {
  const table = getTableById(tableId);

  if (!table) {
    return { success: false, error: `Mesa com id "${tableId}" não encontrada.` };
  }

  table.status         = "available";
  table.currentOrderId = null;

  return { success: true, table: sanitizeTable(table) };
}

function sanitizeTable(table) {
  return {
    id:             table.id,
    number:         table.number,
    capacity:       table.capacity,
    status:         table.status,
    currentOrderId: table.currentOrderId,
  };
}

module.exports = { getAllTables, getAvailableTables, getTableById, occupyTable, releaseTable };

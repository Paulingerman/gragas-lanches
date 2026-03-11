const { waiters } = require("../data/store");

function getAllWaiters() {
  return waiters.map(sanitizeWaiter);
}

function getAvailableWaiters() {
  return waiters.filter((w) => w.status === "available").map(sanitizeWaiter);
}

function getWaiterById(waiterId) {
  return waiters.find((w) => w.id === waiterId) || null;
}

function assignWaiter(waiterId, tableId) {
  const waiter = getWaiterById(waiterId);

  if (!waiter) {
    return { success: false, error: `Garçom com id "${waiterId}" não encontrado.` };
  }
  if (waiter.status !== "available") {
    return { success: false, error: `Garçom ${waiter.name} já está atendendo outra mesa.` };
  }

  waiter.status         = "busy";
  waiter.currentTableId = tableId;

  return { success: true, waiter: sanitizeWaiter(waiter) };
}

function releaseWaiter(waiterId) {
  const waiter = getWaiterById(waiterId);

  if (!waiter) {
    return { success: false, error: `Garçom com id "${waiterId}" não encontrado.` };
  }

  waiter.status         = "available";
  waiter.currentTableId = null;

  return { success: true, waiter: sanitizeWaiter(waiter) };
}

function registerWaiterSocket(waiterId, socketId) {
  const waiter = getWaiterById(waiterId);
  if (waiter) {
    waiter.socketId = socketId;
  }
}

function unregisterWaiterSocket(socketId) {
  const waiter = waiters.find((w) => w.socketId === socketId);
  if (waiter) {
    waiter.socketId = null;
  }
}

function getWaiterSocketId(waiterId) {
  const waiter = getWaiterById(waiterId);
  return waiter ? waiter.socketId : null;
}

function sanitizeWaiter(waiter) {
  return {
    id:             waiter.id,
    name:           waiter.name,
    status:         waiter.status,
    currentTableId: waiter.currentTableId,
  };
}

module.exports = {
  getAllWaiters,
  getAvailableWaiters,
  getWaiterById,
  assignWaiter,
  releaseWaiter,
  registerWaiterSocket,
  unregisterWaiterSocket,
  getWaiterSocketId,
};

const waiterService = require("../services/waiter.service");

/**
 * Configura todos os eventos Socket.io
 *
 * EVENTOS QUE O SERVIDOR EMITE:
 *  waiter:assigned          → garçom foi atribuído a uma mesa
 *  order:payment_requested  → cliente pediu a conta
 *  table:available          → mesa liberada após pagamento
 *
 * EVENTOS QUE O CLIENTE ENVIA:
 *  waiter:register  → garçom se identifica ao abrir o app
 *  manager:join     → painel de gestão entra na sala "managers"
 */
function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log(`[Socket] Conectado: ${socket.id}`);

    // Garçom se registra ao abrir o app
    // Payload: { waiterId: string }
    socket.on("waiter:register", ({ waiterId }) => {
      if (!waiterId) return;

      waiterService.registerWaiterSocket(waiterId, socket.id);
      socket.join(`waiter_${waiterId}`);

      console.log(`[Socket] Garçom ${waiterId} registrado → ${socket.id}`);

      socket.emit("waiter:registered", {
        message: "Conectado com sucesso. Aguardando atribuições.",
        waiterId,
      });
    });

    // Painel de gestão / caixa
    socket.on("manager:join", () => {
      socket.join("managers");
      console.log(`[Socket] Manager conectado: ${socket.id}`);
      socket.emit("manager:joined", { message: "Painel de gestão conectado." });
    });

    // Desconexão
    socket.on("disconnect", () => {
      waiterService.unregisterWaiterSocket(socket.id);
      console.log(`[Socket] Desconectado: ${socket.id}`);
    });
  });
}

module.exports = { setupSocket };

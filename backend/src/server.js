const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");

const tablesRouter  = require("./routes/tables.routes");
const waitersRouter = require("./routes/waiters.routes");
const menuRouter    = require("./routes/menu.routes");
const { router: ordersRouter, setSocketIo } = require("./routes/orders.routes");
const { setupSocket } = require("./socket/socket.handler");

// ─────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setSocketIo(io);
setupSocket(io);

// ─────────────────────────────────────────────
// MIDDLEWARES GLOBAIS
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─────────────────────────────────────────────
// ROTAS
// ─────────────────────────────────────────────
app.use("/tables",  tablesRouter);
app.use("/waiters", waitersRouter);
app.use("/menu",    menuRouter);
app.use("/orders",  ordersRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Rota não encontrada." });
});

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("\n=========================================");
  console.log(`  🍽️  Restaurante Backend rodando`);
  console.log(`  📡 http://localhost:${PORT}`);
  console.log(`  🔌 Socket.io ativo`);
  console.log("=========================================\n");
});

module.exports = { app, server, io };

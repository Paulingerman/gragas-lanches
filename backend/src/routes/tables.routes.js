const express      = require("express");
const router       = express.Router();
const tableService = require("../services/table.service");
const { successResponse, notFound } = require("../middleware/response");

// GET /tables — todas as mesas
router.get("/", (req, res) => {
  successResponse(res, { tables: tableService.getAllTables() });
});

// GET /tables/available — apenas mesas livres
router.get("/available", (req, res) => {
  successResponse(res, { tables: tableService.getAvailableTables() });
});

// GET /tables/:id — detalhes de uma mesa
router.get("/:id", (req, res) => {
  const table = tableService.getTableById(req.params.id);
  if (!table) return notFound(res, "Mesa não encontrada.");
  successResponse(res, { table });
});

module.exports = router;

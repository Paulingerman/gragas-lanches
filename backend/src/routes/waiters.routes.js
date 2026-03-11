const express       = require("express");
const router        = express.Router();
const waiterService = require("../services/waiter.service");
const { successResponse, notFound } = require("../middleware/response");

// GET /waiters — todos os garçons
router.get("/", (req, res) => {
  successResponse(res, { waiters: waiterService.getAllWaiters() });
});

// GET /waiters/available — apenas garçons livres
router.get("/available", (req, res) => {
  successResponse(res, { waiters: waiterService.getAvailableWaiters() });
});

// GET /waiters/:id — detalhes de um garçom
router.get("/:id", (req, res) => {
  const waiter = waiterService.getWaiterById(req.params.id);
  if (!waiter) return notFound(res, "Garçom não encontrado.");
  successResponse(res, { waiter });
});

module.exports = router;

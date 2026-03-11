const express     = require("express");
const router      = express.Router();
const menuService = require("../services/menu.service");
const { successResponse, notFound } = require("../middleware/response");

// GET /menu — cardápio completo por categoria
router.get("/", (req, res) => {
  successResponse(res, { menu: menuService.getFullMenu() });
});

// GET /menu/available — apenas itens disponíveis
router.get("/available", (req, res) => {
  successResponse(res, { menu: menuService.getAvailableMenu() });
});

// GET /menu/:id — um item específico
router.get("/:id", (req, res) => {
  const item = menuService.getMenuItemById(req.params.id);
  if (!item) return notFound(res, "Item não encontrado no cardápio.");
  successResponse(res, { item });
});

module.exports = router;

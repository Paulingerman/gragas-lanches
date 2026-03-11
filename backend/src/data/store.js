/**
 * STORE - Banco de dados em memória
 * Futuramente substituível por MongoDB, PostgreSQL, etc.
 */

// ─────────────────────────────────────────────
// MESAS
// ─────────────────────────────────────────────
const tables = [
  { id: "table_01", number: 1, capacity: 2, status: "available", currentOrderId: null },
  { id: "table_02", number: 2, capacity: 4, status: "available", currentOrderId: null },
  { id: "table_03", number: 3, capacity: 4, status: "available", currentOrderId: null },
  { id: "table_04", number: 4, capacity: 6, status: "available", currentOrderId: null },
  { id: "table_05", number: 5, capacity: 6, status: "available", currentOrderId: null },
  { id: "table_06", number: 6, capacity: 8, status: "available", currentOrderId: null },
  { id: "table_07", number: 7, capacity: 2, status: "available", currentOrderId: null },
  { id: "table_08", number: 8, capacity: 4, status: "available", currentOrderId: null },
];

// ─────────────────────────────────────────────
// GARÇONS
// ─────────────────────────────────────────────
const waiters = [
  { id: "waiter_01", name: "Carlos",   status: "available", currentTableId: null, socketId: null },
  { id: "waiter_02", name: "Fernanda", status: "available", currentTableId: null, socketId: null },
  { id: "waiter_03", name: "João",     status: "available", currentTableId: null, socketId: null },
  { id: "waiter_04", name: "Mariana",  status: "available", currentTableId: null, socketId: null },
];

// ─────────────────────────────────────────────
// CARDÁPIO
// ─────────────────────────────────────────────
const menuItems = [
  // Entradas
  { id: "item_001", name: "Bruschetta",           category: "entradas",   price: 18.90, description: "Pão italiano com tomate, manjericão e azeite", available: true },
  { id: "item_002", name: "Tábua de Frios",        category: "entradas",   price: 42.00, description: "Presunto, queijo, salame e azeitonas", available: true },
  { id: "item_003", name: "Caldo de Feijão",       category: "entradas",   price: 14.50, description: "Caldo cremoso com toucinho e linguiça", available: true },

  // Pratos Principais
  { id: "item_010", name: "Picanha Grelhada",      category: "principais", price: 89.90, description: "300g de picanha com arroz, fritas e farofa", available: true },
  { id: "item_011", name: "Filé de Frango",        category: "principais", price: 45.00, description: "Filé grelhado com legumes e arroz", available: true },
  { id: "item_012", name: "Salmão ao Molho Limão", category: "principais", price: 72.00, description: "Filé de salmão com purê de batata", available: true },
  { id: "item_013", name: "Massa ao Bolonhesa",    category: "principais", price: 38.00, description: "Espaguete com molho de carne moída", available: true },
  { id: "item_014", name: "Risoto de Cogumelos",   category: "principais", price: 55.00, description: "Arroz arbóreo com mix de cogumelos e parmesão", available: true },

  // Sobremesas
  { id: "item_020", name: "Petit Gateau",          category: "sobremesas", price: 22.00, description: "Bolo quente com sorvete de creme", available: true },
  { id: "item_021", name: "Pudim de Leite",        category: "sobremesas", price: 14.00, description: "Pudim tradicional com calda de caramelo", available: true },
  { id: "item_022", name: "Tiramisu",              category: "sobremesas", price: 19.00, description: "Sobremesa italiana com mascarpone e café", available: true },

  // Bebidas
  { id: "item_030", name: "Água Mineral",          category: "bebidas",    price: 5.00,  description: "500ml, com ou sem gás", available: true },
  { id: "item_031", name: "Suco Natural",          category: "bebidas",    price: 12.00, description: "Laranja, limão, maracujá ou manga", available: true },
  { id: "item_032", name: "Refrigerante",          category: "bebidas",    price: 8.00,  description: "Lata 350ml", available: true },
  { id: "item_033", name: "Cerveja Artesanal",     category: "bebidas",    price: 18.00, description: "Long neck 355ml", available: true },
  { id: "item_034", name: "Vinho Tinto (taça)",    category: "bebidas",    price: 25.00, description: "Taça 150ml, vinho reserva", available: true },
  { id: "item_035", name: "Café Espresso",         category: "bebidas",    price: 7.00,  description: "Dose dupla", available: true },
];

// ─────────────────────────────────────────────
// PEDIDOS (criados dinamicamente)
// ─────────────────────────────────────────────
const orders = [];

module.exports = { tables, waiters, menuItems, orders };

const { menuItems } = require("../data/store");

function getFullMenu() {
  const grouped = {};
  const categoryOrder = ["entradas", "principais", "sobremesas", "bebidas"];

  for (const item of menuItems) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  const sorted = {};
  for (const cat of categoryOrder) {
    if (grouped[cat]) sorted[cat] = grouped[cat];
  }
  for (const cat of Object.keys(grouped)) {
    if (!sorted[cat]) sorted[cat] = grouped[cat];
  }

  return sorted;
}

function getAvailableMenu() {
  const grouped = {};

  for (const item of menuItems.filter((i) => i.available)) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  return grouped;
}

function getMenuItemById(id) {
  return menuItems.find((i) => i.id === id) || null;
}

module.exports = { getFullMenu, getAvailableMenu, getMenuItemById };

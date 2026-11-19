/*
 * Fonte compartilhada do catálogo de produtos entre Estoque, Inventário,
 * Validades e Relatórios.
 *
 * Os dados permanecem no localStorage deste navegador. Não há sincronização
 * entre computadores, usuários ou unidades, nem gravação no Firestore.
 */
(function () {
  "use strict";

  const PRODUCTS_KEY = "ybyx_products";
  const VALIDITIES_KEY = "ybyx_validities";
  const INITIAL_PRODUCTS = [{
    id: "1",
    code: "000.001",
    barcode: "78910001",
    name: "Dipirona 500mg/ml",
    category: "Medicamento",
    expiry: "05/2027",
    stock: 50,
    cost: "R$ 12,00",
    supplier: "VetMaster",
    batch: "",
    location: ""
  }];

  function readArray(key) {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === "") return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error(`Os dados armazenados em ${key} estão em formato inválido.`);
    return parsed;
  }

  function persistArray(key, items) {
    if (!Array.isArray(items)) throw new TypeError("A lista informada é inválida.");
    const serialized = JSON.stringify(items);
    localStorage.setItem(key, serialized);
    if (localStorage.getItem(key) !== serialized) {
      throw new Error("O navegador não confirmou a gravação dos dados.");
    }
    return JSON.parse(serialized);
  }

  function getProducts() {
    if (localStorage.getItem(PRODUCTS_KEY) === null) {
      persistArray(PRODUCTS_KEY, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS.map((product) => ({ ...product }));
    }
    return readArray(PRODUCTS_KEY);
  }

  function saveProducts(products) {
    const saved = persistArray(PRODUCTS_KEY, products);
    window.dispatchEvent(new CustomEvent("vetinos:products-updated", {
      detail: { products: saved }
    }));
    return saved;
  }

  function nextCode(products) {
    const sequence = products.reduce((highest, product) => {
      const match = String(product.code || "").match(/^(\d+)/);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0) + 1;
    return `${String(sequence).padStart(3, "0")}.${String(Math.floor(100 + Math.random() * 900))}`;
  }

  function createProduct(input) {
    const name = String(input.name || "").trim();
    const expiry = String(input.expiry || "").trim();
    const stock = Number(input.stock);
    if (!name) throw new Error("Informe o nome do produto.");
    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiry)) throw new Error("Informe a validade no formato MM/AAAA.");
    if (!Number.isInteger(stock) || stock < 0) throw new Error("O estoque inicial deve ser um número inteiro igual ou maior que zero.");

    const products = getProducts();
    const product = {
      id: window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      code: nextCode(products),
      barcode: String(input.barcode || "").trim(),
      name,
      category: String(input.category || "Insumo"),
      expiry,
      stock,
      physicalStock: stock,
      cost: String(input.cost || "").trim(),
      supplier: String(input.supplier || "").trim(),
      batch: String(input.batch || "").trim(),
      location: String(input.location || "").trim(),
      createdAt: new Date().toISOString()
    };
    saveProducts([...products, product]);
    return product;
  }

  function updateProduct(id, changes) {
    const products = getProducts();
    let found = false;
    const updated = products.map((product) => {
      if (String(product.id) !== String(id)) return product;
      found = true;
      return { ...product, ...changes };
    });
    if (!found) throw new Error("Produto não encontrado.");
    saveProducts(updated);
    return updated.find((product) => String(product.id) === String(id));
  }

  function deleteProduct(id) {
    const products = getProducts();
    const updated = products.filter((product) => String(product.id) !== String(id));
    if (updated.length === products.length) return false;
    saveProducts(updated);
    return true;
  }

  function getValidities() {
    const legacy = readArray(VALIDITIES_KEY);
    const products = getProducts();
    const legacyKeys = new Set(legacy.map((item) =>
      `${String(item.name || "").toLowerCase()}|${String(item.expiryDisplay || item.expiry || "")}`
    ));
    const fromProducts = products
      .filter((product) => product.expiry)
      .filter((product) => !legacyKeys.has(`${String(product.name || "").toLowerCase()}|${String(product.expiry || "")}`))
      .map((product) => ({
        id: `product-${product.id}`,
        productId: product.id,
        name: product.name,
        batch: product.batch || "Não informado",
        expiry: product.expiry,
        expiryDisplay: product.expiry,
        location: product.location || "Não informado"
      }));
    return [...legacy, ...fromProducts];
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  window.VetinosProducts = {
    getProducts, saveProducts, createProduct, updateProduct,
    deleteProduct, getValidities, escapeHtml
  };
})();

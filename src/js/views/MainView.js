const path = require('path');
const ProductController = require(path.resolve(__dirname, '../js/controllers/ProductController'));
const SaleController = require(path.resolve(__dirname, '../js/controllers/SaleController'));

class MainView {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (!this.user) {
      window.location.href = 'login.html';
      return;
    }

    this.userInfo = document.getElementById('user-info');
    this.logoutBtn = document.getElementById('logout-btn');
    this.adminControls = document.getElementById('admin-controls');
    this.productNameInput = document.getElementById('product-name');
    this.productPriceInput = document.getElementById('product-price');
    this.productStockInput = document.getElementById('product-stock');
    this.addProductBtn = document.getElementById('add-product-btn');
    this.productSearch = document.getElementById('product-search');
    this.productList = document.getElementById('product-list');
    this.cartItems = document.getElementById('cart-items');
    this.cartTotal = document.getElementById('cart-total');
    this.finalizeSaleBtn = document.getElementById('finalize-sale-btn');

    this.cart = [];
    this.products = [];

    console.log('MainView inicializada para usuário:', this.user.username);
    this.init();
  }

  init() {
    this.userInfo.textContent = `Usuário: ${this.user.username} (${this.user.role})`;
    if (this.user.role === 'admin') {
      this.adminControls.style.display = 'block';
    }

    this.bindEvents();
    this.loadProducts();
  }

  bindEvents() {
    this.logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });

    this.addProductBtn.addEventListener('click', () => this.handleAddProduct());
    this.productSearch.addEventListener('input', () => this.filterProducts());
    this.finalizeSaleBtn.addEventListener('click', () => this.handleFinalizeSale());
  }

  async loadProducts() {
    this.products = await ProductController.getAllProducts();
    this.renderProducts();
  }

  renderProducts() {
    this.productList.innerHTML = '';
    this.products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - R$${product.price.toFixed(2)} (Estoque: ${product.stock})`;
      li.addEventListener('click', () => this.addToCart(product));
      this.productList.appendChild(li);
    });
  }

  filterProducts() {
    const search = this.productSearch.value.toLowerCase();
    const filtered = this.products.filter(product => product.name.toLowerCase().includes(search));
    this.productList.innerHTML = '';
    filtered.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - R$${product.price.toFixed(2)} (Estoque: ${product.stock})`;
      li.addEventListener('click', () => this.addToCart(product));
      this.productList.appendChild(li);
    });
  }

  async handleAddProduct() {
    const name = this.productNameInput.value;
    const price = parseFloat(this.productPriceInput.value);
    const stock = parseInt(this.productStockInput.value);
    if (name && price > 0 && stock >= 0) {
      await ProductController.createProduct(name, price, stock);
      this.productNameInput.value = '';
      this.productPriceInput.value = '';
      this.productStockInput.value = '';
      await this.loadProducts();
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }

  addToCart(product) {
    if (product.stock <= 0) {
      alert('Produto sem estoque.');
      return;
    }
    const existingItem = this.cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Estoque insuficiente.');
        return;
      }
      existingItem.quantity++;
    } else {
      this.cart.push({ productId: product.id, name: product.name, quantity: 1, price: product.price });
    }
    this.renderCart();
  }

  renderCart() {
    this.cartItems.innerHTML = '';
    let total = 0;
    this.cart.forEach(item => {
      const tr = document.createElement('tr');
      const itemTotal = item.quantity * item.price;
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>R$${item.price.toFixed(2)}</td>
        <td>R$${itemTotal.toFixed(2)}</td>
        <td><button class="remove-item" data-id="${item.productId}">Remover</button></td>
      `;
      this.cartItems.appendChild(tr);
      total += itemTotal;
    });
    this.cartTotal.textContent = total.toFixed(2);
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.id);
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.renderCart();
      });
    });
  }

  async handleFinalizeSale() {
    if (this.cart.length === 0) {
      alert('Adicione produtos à venda.');
      return;
    }
    try {
      await SaleController.createSale(this.user.id, this.cart);
      alert('Venda finalizada com sucesso!');
      this.cart = [];
      this.renderCart();
      await this.loadProducts();
    } catch (error) {
      console.error('Erro ao finalizar venda:', error.message);
      alert('Erro ao finalizar venda.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, inicializando MainView');
  new MainView();
});
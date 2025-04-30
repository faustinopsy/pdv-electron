const path = require('path');

try {
  console.log('Tentando carregar controladores...');
  const ProductController = require(path.resolve(__dirname, '../controllers/ProductController'));
  const SaleController = require(path.resolve(__dirname, '../controllers/SaleController'));
  console.log('Controladores carregados com sucesso.');

  class MainView {
    constructor() {
      console.log('Inicializando MainView...');
      this.user = JSON.parse(localStorage.getItem('user'));
      console.log('Usuário recuperado:', this.user);
      if (!this.user) {
        console.log('Nenhum usuário encontrado, redirecionando para login...');
        window.location.href = 'login.html';
        return;
      }

      try {
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
      } catch (error) {
        console.error('Erro ao acessar elementos do DOM:', error.message);
        return;
      }

      this.cart = [];
      this.products = [];

      console.log('MainView inicializada para usuário:', this.user.username);
      this.init();
    }

    init() {
      console.log('Executando init...');
      try {
        this.userInfo.textContent = `Usuário: ${this.user.username} (${this.user.role})`;
        if (this.user.role === 'admin') {
          console.log('Mostrando controles de admin...');
          this.adminControls.style.display = 'block';
        }
      } catch (error) {
        console.error('Erro ao configurar interface:', error.message);
        return;
      }

      this.bindEvents();
      this.loadProducts();
    }

    bindEvents() {
      console.log('Vinculando eventos...');
      try {
        this.logoutBtn.addEventListener('click', () => {
          console.log('Logout clicado');
          localStorage.removeItem('user');
          window.location.href = 'login.html';
        });

        this.addProductBtn.addEventListener('click', () => this.handleAddProduct());
        this.productSearch.addEventListener('input', () => this.filterProducts());
        this.finalizeSaleBtn.addEventListener('click', () => this.handleFinalizeSale());
      } catch (error) {
        console.error('Erro ao vincular eventos:', error.message);
      }
    }

    async loadProducts() {
      console.log('Carregando produtos...');
      try {
        this.products = await ProductController.getAllProducts();
        console.log('Produtos carregados:', this.products);
        this.renderProducts();
      } catch (error) {
        console.error('Erro ao carregar produtos:', error.message);
      }
    }

    renderProducts() {
      console.log('Renderizando produtos...');
      try {
        this.productList.innerHTML = '';
        this.products.forEach(product => {
          const li = document.createElement('li');
          li.innerHTML = `${product.name} - R$${product.price.toFixed(2)} (Estoque: ${product.stock})`;
          li.addEventListener('click', () => this.addToCart(product));

          if (this.user.role === 'admin') {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Deletar';
            deleteBtn.className = 'delete-product-btn';
            deleteBtn.dataset.id = product.id;
            deleteBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Evita disparar o clique no li
              this.handleDeleteProduct(product.id);
            });
            li.appendChild(deleteBtn);
          }

          this.productList.appendChild(li);
        });
      } catch (error) {
        console.error('Erro ao renderizar produtos:', error.message);
      }
    }

    filterProducts() {
      console.log('Filtrando produtos...');
      try {
        const search = this.productSearch.value.toLowerCase();
        const filtered = this.products.filter(product => product.name.toLowerCase().includes(search));
        this.productList.innerHTML = '';
        filtered.forEach(product => {
          const li = document.createElement('li');
          li.innerHTML = `${product.name} - R$${product.price.toFixed(2)} (Estoque: ${product.stock})`;
          li.addEventListener('click', () => this.addToCart(product));

          if (this.user.role === 'admin') {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Deletar';
            deleteBtn.className = 'delete-product-btn';
            deleteBtn.dataset.id = product.id;
            deleteBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              this.handleDeleteProduct(product.id);
            });
            li.appendChild(deleteBtn);
          }

          this.productList.appendChild(li);
        });
      } catch (error) {
        console.error('Erro ao filtrar produtos:', error.message);
      }
    }

    async handleAddProduct() {
      console.log('Adicionando produto...');
      try {
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
      } catch (error) {
        console.error('Erro ao adicionar produto:', error.message);
        alert('Erro ao adicionar produto.');
      }
    }

    async handleDeleteProduct(productId) {
      console.log('Deletando produto ID:', productId);
      try {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
          await ProductController.deleteProduct(productId);
          this.cart = this.cart.filter(item => item.productId !== productId); // Remove do carrinho
          await this.loadProducts();
          this.renderCart();
          alert('Produto deletado com sucesso.');
        }
      } catch (error) {
        console.error('Erro ao deletar produto:', error.message);
        alert('Erro ao deletar produto.');
      }
    }

    addToCart(product) {
      console.log('Adicionando ao carrinho:', product.name);
      try {
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
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error.message);
      }
    }

    renderCart() {
      console.log('Renderizando carrinho...');
      try {
        this.cartItems.innerHTML = '';
        let total = 0;
        this.cart.forEach(item => {
          const product = this.products.find(p => p.id === item.productId);
          if (!product) {
            this.cart = this.cart.filter(i => i.productId !== item.productId);
            return;
          }
          const itemTotal = item.quantity * item.price;
          const tr = document.createElement('tr');
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
      } catch (error) {
        console.error('Erro ao renderizar carrinho:', error.message);
      }
    }

    async handleFinalizeSale() {
      console.log('Finalizando venda...');
      try {
        if (this.cart.length === 0) {
          alert('Adicione produtos à venda.');
          return;
        }
        for (const item of this.cart) {
          const product = this.products.find(p => p.id === item.productId);
          if (!product || product.stock < item.quantity) {
            alert(`Estoque insuficiente para ${item.name}.`);
            return;
          }
        }
        await SaleController.createSale(this.user.id, this.cart);
        for (const item of this.cart) {
          const product = this.products.find(p => p.id === item.productId);
          await ProductController.updateProduct(
            item.productId,
            product.name,
            product.price,
            product.stock - item.quantity
          );
        }
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
} catch (error) {
  console.error('Erro ao carregar MainView:', error.message, error.stack);
}
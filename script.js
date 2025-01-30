// Function to show alert
function showAlert(message) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  if (document.body.classList.contains('dark-mode')) {
    alert.classList.add('dark-mode');
  }
  alert.innerHTML = `
    <div class="alert-message">${message}</div>
    <button class="alert-close-btn">OK</button>
  `;
  document.body.appendChild(alert);

  // Close alert on button click
  const closeBtn = alert.querySelector('.alert-close-btn');
  closeBtn.addEventListener('click', () => {
    alert.remove();
  });

  // Show the alert
  alert.style.display = 'block';
}

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
    // Save theme preference to localStorage
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
  }
}

// Footer Navigation
const footerButtons = document.querySelectorAll('.footer button');

footerButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    footerButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to the clicked button
    button.classList.add('active');

    // Navigate to the corresponding page
    if (button.querySelector('.fa-home')) {
      window.location.href = 'index.html';
    } else if (button.querySelector('.fa-shopping-cart')) {
      window.location.href = 'cart.html';
    } else if (button.querySelector('.fa-tags')) {
      showAlert('Tez kunda!');
    }
  });
});

// Quantity Control Functionality
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const quantityDisplay = document.getElementById('quantity');

if (decreaseBtn && increaseBtn && quantityDisplay) {
  let quantity = 1;

  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });

  increaseBtn.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });
}

// Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart Functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

if (addToCartButtons) {
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product-card') || button.closest('.product-details-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('p').textContent;
      const productImage = productCard.querySelector('img').src;
      const quantity = quantityDisplay ? parseInt(quantityDisplay.textContent) : 1;

      // Check if the product is already in the cart
      const existingProduct = cart.find(item => item.name === productName);

      if (existingProduct) {
        // Update quantity if the product already exists
        existingProduct.quantity += quantity;
      } else {
        // Add new product to the cart
        cart.push({
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: quantity,
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Notify user
      alert(`${productName} Savatga qo'shildi!`);
    });
  });
}

// Display Cart Items on Cart Page
const cartItemsContainer = document.querySelector('.cart-items');

if (cartItemsContainer) {
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.price}</p>
        <div class="quantity-control">
          <button class="quantity-btn decrease">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn increase">+</button>
        </div>
      </div>
      <button class="delete-btn"><i class="fas fa-trash"></i></button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  // Update Quantity in Cart
  const quantityControls = document.querySelectorAll('.quantity-control');

  quantityControls.forEach(control => {
    const decreaseBtn = control.querySelector('.decrease');
    const increaseBtn = control.querySelector('.increase');
    const quantitySpan = control.querySelector('span');
    const productName = control.closest('.cart-item').querySelector('h3').textContent;

    decreaseBtn.addEventListener('click', () => {
      const product = cart.find(item => item.name === productName);
      if (product.quantity > 1) {
        product.quantity--;
        quantitySpan.textContent = product.quantity;
      } else {
        // Remove product from cart if quantity is 0
        cart = cart.filter(item => item.name !== productName);
        control.closest('.cart-item').remove();
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateTotalPrice();
    });

    increaseBtn.addEventListener('click', () => {
      const product = cart.find(item => item.name === productName);
      product.quantity++;
      quantitySpan.textContent = product.quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateTotalPrice();
    });
  });

  // Delete Product from Cart
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productName = button.closest('.cart-item').querySelector('h3').textContent;
      cart = cart.filter(item => item.name !== productName);
      localStorage.setItem('cart', JSON.stringify(cart));
      button.closest('.cart-item').remove();
      updateTotalPrice();
    });
  });

  // Update Total Price
  function updateTotalPrice() {
    const totalPrice = cart.reduce((total, item) => {
      return total + parseFloat(item.price.replace(' ', '')) * item.quantity;
    }, 0);
    document.querySelector('.total-price p').textContent = `Umumiy narxi: ${totalPrice.toFixed(2)} so'm`;
  }

  updateTotalPrice();
}

// Checkout Functionality
const checkoutBtn = document.querySelector('.checkout-btn');

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Savatingiz bo\'sh!');
    } else {
      alert('Xaridingiz uchun raxmat!');
      localStorage.removeItem('cart');
      cart = [];
      document.querySelector('.cart-items').innerHTML = '';
      updateTotalPrice();
    }
  });
}
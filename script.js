document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites and cart from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add favorite functionality to products
    document.querySelectorAll('.favorite').forEach(button => {
        const productCard = button.closest('.product-card');
        const name = productCard.querySelector('h3').textContent;
        const price = productCard.querySelector('.new-price').textContent;
        const img = productCard.querySelector('img').getAttribute('src');

        // Set initial active state
        if (favorites.some(fav => fav.name === name)) {
            button.classList.add('active');
        }

        // Add click handler
        button.addEventListener('click', () => {
            button.classList.toggle('active');

            if (favorites.some(fav => fav.name === name)) {
                // Remove from favorites
                favorites = favorites.filter(fav => fav.name !== name);
            } else {
                // Add to favorites
                favorites.push({
                    name: name,
                    price: price,
                    img: img
                });
            }

            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.dataset.name;
            const price = this.dataset.price;
            const img = this.dataset.img;
            
            // Add to cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    img: img,
                    quantity: 1
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Redirect to cart page instead of showing alert
            window.location.href = 'cart.html';
        });
    });

    // Cart page functionality
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    if (cartItems && totalPrice) {
        updateCart();
    }
});

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <li class="list-group-item text-center py-5">
                <h3>Your cart is empty</h3>
                <p class="text-muted">Add some items to your cart!</p>
                <a href="index.html" class="btn btn-primary mt-3">Continue Shopping</a>
            </li>
        `;
        totalPrice.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <li class="list-group-item">
            <div class="d-flex align-items-center">
                <img src="${item.img}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: contain;">
                <div class="ms-3 flex-grow-1">
                    <h5 class="mb-1">${item.name}</h5>
                    <p class="mb-1">Price: ${item.price}</p>
                    <div class="d-flex align-items-center">
                        <button onclick="updateQuantity('${item.name}', -1)" class="btn btn-sm btn-outline-secondary">-</button>
                        <span class="mx-2">Quantity: ${item.quantity}</span>
                        <button onclick="updateQuantity('${item.name}', 1)" class="btn btn-sm btn-outline-secondary">+</button>
                    </div>
                </div>
            </div>
        </li>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);
    
    totalPrice.textContent = total.toFixed(2);
}

function updateQuantity(name, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        if (item.quantity === 0) {
            cart = cart.filter(item => item.name !== name);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCart();
}
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});
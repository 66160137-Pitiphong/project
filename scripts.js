document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites and cart from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Display favorites on the follow page
    const followList = document.getElementById('follow-list');
    if (followList) {
        if (!favorites || favorites.length === 0) {
            followList.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h3 class="mb-3">Your Follow List is Empty</h3>
                    <p class="text-muted mb-4">Start following your favorite items to see them here!</p>
                    <a href="index.html" class="btn btn-primary px-4 py-2">
                        Browse Products
                    </a>
                </div>
            `;
        } else {
            // Filter out any items with undefined values
            const validFavorites = favorites.filter(item => 
                item && 
                item.name && 
                item.price && 
                item.img && 
                item.name !== 'undefined' && 
                item.price !== 'undefined' && 
                item.img !== 'undefined'
            );

            followList.innerHTML = validFavorites.map(item => `
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="product-card follow-card">
                        <div class="product-image-container">
                            <img src="${item.img}" alt="${item.name}" class="product-image" onerror="this.src='placeholder.jpg'">
                        </div>
                        <div class="product-details">
                            <h3 class="product-title">${item.name}</h3>
                            <p class="price">
                                <span class="new-price">${item.price}</span>
                            </p>
                            <button onclick="removeFromFavorites('${item.name}')" class="remove-btn">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Add favorite functionality to products on home page
    document.querySelectorAll('.favorite').forEach(button => {
        const productCard = button.closest('.product-card');
        if (productCard) {
            const name = productCard.querySelector('h3')?.textContent;
            const price = productCard.querySelector('.new-price')?.textContent;
            const img = productCard.querySelector('img')?.getAttribute('src');

            // Only add to favorites if all values are valid
            if (name && price && img) {
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
            }
        }
    });

    // Cart page functionality
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    if (cartItems && totalPrice) {
        updateCart();
    }
});

// Function to remove item from favorites
function removeFromFavorites(name) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.name !== name);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Refresh the follow page
    const followList = document.getElementById('follow-list');
    if (followList) {
        location.reload();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <h3 class="mb-2">Your cart is empty</h3>
                <p class="text-muted mb-4">Add some items to your cart!</p>
                <a href="index.html" class="btn btn-primary px-4 py-2 rounded-pill">Continue Shopping</a>
            </div>
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
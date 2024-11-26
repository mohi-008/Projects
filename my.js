
document.addEventListener("DOMContentLoaded", () => {
    // Variables for DOM elements
    const cartModal = document.getElementById("cart-modal");
    const closeButton = document.querySelector(".close-button");
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    let cart = [];

    // Event listener for 'Add to Cart' buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const productElement = button.parentElement;
            const productId = productElement.getAttribute("data-id");
            const productName = productElement.getAttribute("data-name");
            const productPrice = parseInt(productElement.getAttribute("data-price").replace(/,/g, ''));

            addToCart(productId, productName, productPrice);
        });
    });

    // Function to add items to cart
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCartDisplay();
    }

    // Update cart display and total price
    function updateCartDisplay() {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        cartItems.innerHTML = "";

        let total = 0;
        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <span>${item.name} (x${item.quantity}) - Rs ${item.price}</span>
                <button onclick="removeItem('${item.id}')">Remove</button>
            `;
            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = total;
    }

    // Remove item from cart
    window.removeItem = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartDisplay();
    };

    // Open and close cart modal
    cartModal.style.display = "none";
    document.getElementById("cart").addEventListener("click", () => {
        cartModal.style.display = "block";
    });

    closeButton.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = "none";
        }
    });

    // Filter products by price and category
    document.getElementById("apply-filter").addEventListener("click", () => {
        const maxPrice = parseInt(document.getElementById("price-filter").value) || Infinity;
        const category = document.getElementById("category-filter").value;

        document.querySelectorAll(".product").forEach(product => {
            const price = parseInt(product.getAttribute("data-price").replace(/,/g, ''));
            const productCategory = product.getAttribute("data-category");

            if (price <= maxPrice && (category === "all" || category === productCategory)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    });

    // Reset filters
    document.getElementById("reset-filter").addEventListener("click", () => {
        document.getElementById("price-filter").value = "";
        document.getElementById("category-filter").value = "all";
        document.querySelectorAll(".product").forEach(product => {
            product.style.display = "block";
        });
    });

    // Checkout button event
    document.getElementById("checkout").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            alert("Proceeding to checkout. Total: Rs " + totalPriceElement.textContent);
            cart = [];
            updateCartDisplay();
            cartModal.style.display = "none";
        }
    });
});
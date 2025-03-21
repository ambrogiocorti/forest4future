let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".add-to-cart");
    const cartCount = document.getElementById("cart-count");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));

            cart.push({ name, price });
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();

            alert(`${name} aggiunto al carrello! 🛒`);
        });
    });

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    updateCartCount();
});
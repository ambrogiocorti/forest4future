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

    function aggiungiDonazione() {
        let importo = document.getElementById("donazioneImporto").value;
        if (importo && importo > 0) {
            localStorage.setItem("donazione", importo);
            alert("Donazione aggiunta con successo!");
        } else {
            alert("Inserisci un importo valido!");
        }
    }

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    updateCartCount();
});
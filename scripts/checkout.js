import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js"; // Importiamo la configurazione

document.addEventListener("DOMContentLoaded", function () {
    console.log("Checkout page loaded");

    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const orderForm = document.getElementById("order-form");

    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Evita errori se il valore è null
    console.log("Carrello recuperato:", cart);

    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            let itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>€${item.price.toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">❌</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price;
        });

        totalPriceElement.textContent = total.toFixed(2);
    }

    cartItemsContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        }
    });

    // 🛒 Mantieni il carrello anche dopo il refresh
    window.addEventListener("beforeunload", function () {
        localStorage.setItem("cart", JSON.stringify(cart));
    });

    // 📤 Gestione invio modulo
    orderForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;

        console.log("Carrello al momento dell'ordine:", cart);

        if (cart.length === 0) {
            alert("Il carrello è vuoto! Aggiungi prodotti prima di confermare l'ordine.");
            return;
        }

        // 🏷️ Calcola il totale numerico invece di prendere solo il testo HTML
        const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

        try {
            // 🔎 Debug prima dell'invio
            console.log("Dati inviati a Firebase:", {
                name, email, address, phone, cart, total, timestamp: new Date()
            });

            // Salviamo l'ordine su Firebase
            const orderRef = await addDoc(collection(db, "orders"), {
                name: name,
                email: email,
                address: address,
                phone: phone,
                cart: cart,
                total: total,
                timestamp: new Date()
            });

            alert(`Grazie, ${name}! Il tuo ordine è stato ricevuto con ID: ${orderRef.id}`);

            // 🧹 Svuotiamo il carrello solo dopo aver confermato l'ordine
            localStorage.removeItem("cart");
            cart = [];
            renderCart();
            orderForm.reset();
        } catch (error) {
            console.error("Errore durante il salvataggio dell'ordine:", error);
            alert("Errore nel completare l'ordine. Riprova più tardi.");
        }
    });

    renderCart();
});
import { getFirestore, collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("Checkout page loaded");

    console.log("Elementi trovati:");
console.log("cart-items:", document.getElementById("cart-items"));
console.log("total-price:", document.getElementById("total-price"));
console.log("order-form:", document.getElementById("order-form"));
console.log("track-order:", document.getElementById("track-order"));
console.log("order-code:", document.getElementById("order-code"));
console.log("order-status:", document.getElementById("order-status"));


    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const orderForm = document.getElementById("order-form");
    const trackButton = document.getElementById("track-order");
    const orderCodeInput = document.getElementById("order-code");
    const orderStatus = document.getElementById("order-status");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
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

    window.addEventListener("beforeunload", function () {
        localStorage.setItem("cart", JSON.stringify(cart));
    });

    // 📤 Gestione invio modulo d'ordine
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

        const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

        try {
        const orderRef = await addDoc(collection(db, "orders"), {
            name: name,
            email: email,
            address: address,
            phone: phone,
            cart: cart,
            total: total,
            status: "Ordinato",
            timestamp: new Date()
        });
    
        console.log("orderRef:", orderRef); // 🔍 Controlliamo se viene restituito un riferimento valido
        const orderId = orderRef.id;  // Questo dovrebbe essere l'ID dell'ordine
        console.log("Order ID generato:", orderId);
    
        if (!orderId) {
            throw new Error("ID ordine non generato!");
        }
    
        alert(`Grazie, ${name}! Il tuo ordine è stato ricevuto con ID: ${orderId}`);
    
        // 📋 Copia automatica negli appunti
        navigator.clipboard.writeText(orderId).then(() => {
            alert("Il numero dell'ordine è stato copiato negli appunti!");
        }).catch(err => {
            console.error("Errore nella copia:", err);
        });
    
        localStorage.removeItem("cart");
        cart = [];
        renderCart();
        orderForm.reset();
    } catch (error) {
        console.error("Errore durante il salvataggio dell'ordine:", error);
        alert("Errore nel completare l'ordine. Riprova più tardi.");
    }
    });

    // 🔎 Tracciare un ordine
    trackButton.addEventListener("click", async function () {
        const orderId = orderCodeInput.value.trim();

        if (!orderId) {
            alert("Inserisci un codice d'ordine valido!");
            return;
        }

        try {
            const orderDoc = await getDoc(doc(db, "orders", orderId));

            if (orderDoc.exists()) {
                orderStatus.textContent = `Stato dell'ordine: ${orderDoc.data().status}`;
            } else {
                orderStatus.textContent = "Ordine non trovato!";
            }
        } catch (error) {
            console.error("Errore nel recupero dell'ordine:", error);
            alert("Errore nel tracciare l'ordine. Riprova più tardi.");
        }
    });

    renderCart();
});

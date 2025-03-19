import { getFirestore, collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("Checkout page loaded");

    const totalPriceElement = document.getElementById("total-price");
    const cartCountElement = document.getElementById("cart-count");
    const orderForm = document.getElementById("order-form");
    const trackButton = document.getElementById("track-order");
    const orderCodeInput = document.getElementById("order-code");
    const orderStatus = document.getElementById("order-status");

    console.log("Elementi trovati:");
    console.log("total-price:", totalPriceElement);
    console.log("cart-count:", cartCountElement);
    console.log("order-form:", orderForm);
    console.log("track-order:", trackButton);
    console.log("order-code:", orderCodeInput);
    console.log("order-status:", orderStatus);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Carrello recuperato:", cart);

    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }

    if (totalPriceElement) {
        const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
        totalPriceElement.textContent = total;
    }

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

            console.log("orderRef:", orderRef); 
            const orderId = orderRef.id;  
            console.log("Order ID generato:", orderId);

            if (!orderId) {
                throw new Error("ID ordine non generato!");
            }

            alert(`Grazie, ${name}! Il tuo ordine è stato ricevuto con ID: ${orderId}`);

            navigator.clipboard.writeText(orderId).then(() => {
                alert("Il numero dell'ordine è stato copiato negli appunti!");
            }).catch(err => {
                console.error("Errore nella copia:", err);
            });

            localStorage.removeItem("cart");
            cart = [];

            if (cartCountElement) cartCountElement.textContent = "0";
            if (totalPriceElement) totalPriceElement.textContent = "0.00";

            orderForm.reset();
        } catch (error) {
            console.error("Errore durante il salvataggio dell'ordine:", error);
            alert("Errore nel completare l'ordine. Riprova più tardi.");
        }
    });

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
});

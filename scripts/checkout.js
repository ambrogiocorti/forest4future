import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

function formatNumber(number) {
    return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Checkout page loaded");

    const totalPriceElement = document.getElementById("total-price");
    const cartCountElement = document.getElementById("cart-count");
    const orderForm = document.getElementById("order-form");
    const trackButton = document.getElementById("track-order");
    const orderCodeInput = document.getElementById("order-code");
    const orderStatus = document.getElementById("order-status");
    const clearCartButton = document.getElementById("clear-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("🛒 Carrello recuperato:", cart);

    function updateCartDisplay() {
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.textContent = formatNumber(total);
        cartCountElement.textContent = cart.length;
    }

    updateCartDisplay();

    clearCartButton.addEventListener("click", function () {
        if (confirm("🗑 Sei sicuro di voler svuotare il carrello?")) {
            localStorage.removeItem("cart");
            cart = [];
            alert("✅ Il carrello è stato svuotato!");
            updateCartDisplay();
        }
    });

    orderForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;

        if (cart.length === 0) {
            alert("❌ Il carrello è vuoto! Aggiungi prodotti prima di confermare l'ordine.");
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);

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

            const orderId = orderRef.id;
            alert(`✅ Grazie, ${name}! Il tuo ordine è stato ricevuto con ID: ${orderId}`);

            navigator.clipboard.writeText(orderId)
                .then(() => alert("📋 Il numero dell'ordine è stato copiato negli appunti!"))
                .catch(err => console.error("❌ Errore nella copia:", err));

            await updateDonationStats(total);

            localStorage.removeItem("cart");
            cart = [];
            updateCartDisplay();
            orderForm.reset();
        } catch (error) {
            console.error("❌ Errore durante il salvataggio dell'ordine:", error);
            alert("Errore nel completare l'ordine. Riprova più tardi.");
        }
    });

    trackButton.addEventListener("click", async function () {
        const orderId = orderCodeInput.value.trim();

        if (!orderId) {
            alert("⚠️ Inserisci un codice d'ordine valido!");
            return;
        }

        try {
            const orderDoc = await getDoc(doc(db, "orders", orderId));

            if (orderDoc.exists()) {
                orderStatus.textContent = `📦 Stato dell'ordine: ${orderDoc.data().status}`;
            } else {
                orderStatus.textContent = "❌ Ordine non trovato!";
            }
        } catch (error) {
            console.error("❌ Errore nel recupero dell'ordine:", error);
            alert("Errore nel tracciare l'ordine. Riprova più tardi.");
        }
    });
});

async function updateDonationStats(amount) {
    if (!db) {
        console.error("❌ Firebase non è inizializzato correttamente!");
        return;
    }

    const donationRef = doc(db, "donations", "stats");

    try {
        const docSnap = await getDoc(donationRef);
        let totalDonations = docSnap.exists() ? docSnap.data().total || 0 : 0;
        let donorCount = docSnap.exists() ? docSnap.data().donors || 0 : 0;

        totalDonations += amount;
        donorCount++;

        await setDoc(donationRef, { total: totalDonations, donors: donorCount });

        console.log(`✅ Donazioni aggiornate: ${totalDonations} € | Donatori: ${donorCount}`);
    } catch (error) {
        console.error("❌ Errore nell'aggiornamento delle donazioni:", error);
    }
}
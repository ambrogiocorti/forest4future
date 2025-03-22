import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function formatNumber(number) {
    return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".add-to-cart");
    const cartCount = document.getElementById("cart-count");
    const customDonationBtn = document.getElementById("custom-donation-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));
            addToCart(name, price);
        });
    });

    if (customDonationBtn) {
        customDonationBtn.addEventListener("click", async function () {
            let amount = parseFloat(document.getElementById("custom-donation").value);
            if (!isNaN(amount) && amount > 0) {
                addToCart("Donazione Libera", amount);
                document.getElementById("custom-donation").value = "";
                await updateDonationStats(amount);
            } else {
                alert("Inserisci un importo valido.");
            }
        });
    }

    function addToCart(name, price) {
        cart.push({ name, price });
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(`${name} aggiunto al carrello! 🛒`);
    }

    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    updateCartCount();
    listenToDonations();
});

async function updateDonationStats(amount) {
    const donationRef = doc(db, "donations", "stats");

    try {
        const docSnap = await getDoc(donationRef);
        let totalDonations = 0;
        let donorCount = 0;

        if (docSnap.exists()) {
            totalDonations = docSnap.data().total || 0;
            donorCount = docSnap.data().donors || 0;
        }

        totalDonations += amount;
        donorCount++;

        await setDoc(donationRef, { total: totalDonations, donors: donorCount });

        console.log("Donazioni aggiornate:", totalDonations, "€ | Donatori:", donorCount);
    } catch (error) {
        console.error("Errore nell'aggiornamento delle donazioni:", error);
    }
}

function listenToDonations() {
    const donationRef = doc(db, "donations", "stats");

    onSnapshot(donationRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("current-donations").textContent = `€${formatNumber(data.total)}`;
            document.getElementById("donor-count").textContent = data.donors;
            document.getElementById("progress-fill").style.width = `${(data.total / 1000000) * 100}%`;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let resetButton = document.getElementById("reset-donations");
    if (resetButton) {
        resetButton.addEventListener("click", async function () {
            if (confirm("Sei sicuro di voler azzerare le donazioni?")) {
                await setDoc(doc(db, "donations", "stats"), { total: 0, donors: 0 });
                alert("Le donazioni sono state resettate!");
            }
        });
    }
});
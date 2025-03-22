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
        customDonationBtn.addEventListener("click", function () {
            let amount = parseFloat(document.getElementById("custom-donation").value);
            if (!isNaN(amount) && amount > 0) {
                addToCart("Donazione Libera", amount);
                document.getElementById("custom-donation").value = "";
                updateDonationStats(amount);
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

        if (document.getElementById("donation-progress")) {
            updateDonationProgress();
        }
    }

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    updateCartCount();

    if (document.getElementById("donation-progress")) {
        updateDonationProgress();
    }
});

function updateDonationStats(amount) {
    let totalDonations = parseFloat(localStorage.getItem("totalDonations")) || 0;
    let donorCount = parseInt(localStorage.getItem("donorCount")) || 0;

    totalDonations += amount;
    donorCount++;

    localStorage.setItem("totalDonations", totalDonations.toFixed(2));
    localStorage.setItem("donorCount", donorCount);

    updateDonationProgress();
}

function updateDonationProgress() {
    let totalDonations = parseFloat(localStorage.getItem("totalDonations")) || 0;
    let donorCount = parseInt(localStorage.getItem("donorCount")) || 0;
    let goal = 1000000; //obbiettivo donazioni

    if (document.getElementById("current-donations")) {
        document.getElementById("current-donations").textContent = `€${formatNumber(totalDonations)}`;
    }
    if (document.getElementById("donor-count")) {
        document.getElementById("donor-count").textContent = donorCount;
    }

    let progressPercentage = (totalDonations / goal) * 100;
    if (document.getElementById("progress-fill")) {
        document.getElementById("progress-fill").style.width = `${progressPercentage}%`;
    }

    let resetButton = document.getElementById("reset-donations");
    if (resetButton) {
        resetButton.addEventListener("click", function () {
            if (confirm("Sei sicuro di voler azzerare le donazioni?")) {
                localStorage.setItem("totalDonations", "0");
                localStorage.setItem("donorCount", "0");
                alert("Le donazioni sono state resettate!");
                updateDonationProgress();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", updateDonationProgress);
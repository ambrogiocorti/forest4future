// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configurazione Firebase (SOSTITUISCI CON I TUOI DATI)
const firebaseConfig = {
    apiKey: "AIzaSyBJNbHSA1sgpzSekp8PD3R4tN0VdqQLImg",
    authDomain: "forest4future-ac7b2.firebaseapp.com",
    projectId: "forest4future-ac7b2",
    storageBucket: "forest4future-ac7b2.firebasestorage.app",
    messagingSenderId: "185540640434",
    appId: "1:185540640434:web:5f7aaf8377a475de85d3ab"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Esporta il database
export { db };
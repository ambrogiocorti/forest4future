let prev = document.getElementById("prev");
let next = document.getElementById("next");

let carosello = 0;

let immagini = [
    "./images/carosello/image.jpeg",
    "./images/carosello/image-2.jpeg",
];

document.getElementById("next").addEventListener("click", avanti);
document.getElementById("prev").addEventListener("click", indietro);

function immagine() {
    let divImmagine = document.getElementById("immagini");
    divImmagine.style.backgroundImage = `url('${immagini[carosello]}')`;
    divImmagine.style.backgroundSize = "cover";
    divImmagine.style.backgroundPosition = "center";
}

function avanti() {
    carosello = (carosello + 1) % immagini.length;
    immagine();
}

function indietro() {
    carosello = (carosello - 1 + immagini.length) % immagini.length;
    immagine();
}

immagine();

        // Funzione per caricare la pagina senza cambiare l'URL
        function loadPage(page) {
            const content = document.getElementById("content");

            // Carica il contenuto della nuova pagina
            fetch(page)
                .then(response => response.text())
                .then(data => {
                    content.innerHTML = data;
                    history.pushState({page: page}, "", page); // Modifica l'URL senza ricaricare la pagina
                });
        }

        // Gestisce il ritorno indietro del browser
        window.onpopstate = function(event) {
            if (event.state) {
                loadPage(event.state.page);
            }
        };
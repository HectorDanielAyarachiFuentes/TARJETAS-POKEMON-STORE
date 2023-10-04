document.addEventListener("DOMContentLoaded", function () {
    // URL del JSON (reemplaza con la ubicación real del JSON)
    const jsonURL = "./json/cards-pokemon-1.json";
    // Elemento donde se mostrarán los Pokémon
    const pokemonContainer = document.getElementById("pokemon-container");
    // Realiza una solicitud para cargar el JSON
    fetch(jsonURL)
        .then((response) => response.json())
        .then((data) => {
            // Almacena los datos del JSON en localStorage
            localStorage.setItem("pokemonData", JSON.stringify(data));
            // Itera a través de los datos de los Pokémon en el JSON
            data.data.forEach((pokemonData, index) => {
                // Crea el contenido HTML con el enlace para ver más detalles
                const htmlContent = `
                    <div class="pokemon-card">
                        <h2>${pokemonData.name}</h2>
                        <img src="${pokemonData.images.large}" alt="${pokemonData.name} Image">
                        <div class="ver-button-container">
                            <a href="detalle-pokemon.html?id=${index}" class="ver-button">Ver más</a>
                        </div>
                    </div>
                `;
                // Agrega el contenido HTML al contenedor de Pokémon
                pokemonContainer.innerHTML += htmlContent;
            });
            // Agregar un controlador de eventos para el campo de búsqueda
            const searchInput = document.getElementById("searchbar");
            function search_pokemon() {
                let input = searchInput.value.toLowerCase();
                let x = document.getElementsByClassName("pokemon-card");
                for (let i = 0; i < x.length; i++) {
                    if (!x[i].innerHTML.toLowerCase().includes(input)) {
                        x[i].style.display = "none";
                    } else {
                        x[i].style.display = "block";
                    }
                }
            }
            searchInput.addEventListener("keyup", search_pokemon);
        })
        .catch((error) => {
            console.error("Error al cargar el JSON:", error);
        });
    // Obtener referencias a elementos HTML
    var audioPlayer = document.getElementById("audio-player");
    var ramoncito = document.getElementById("ramoncito");
    // Agregar un controlador de eventos para el clic en el elemento <span>
    ramoncito.addEventListener("click", function () {
        // Si el audio está pausado, reproducirlo; de lo contrario, pausarlo
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });
});

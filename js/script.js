document.addEventListener("DOMContentLoaded", function () {
    const jsonURL = "./json/cards-pokemon-1.json";
    const pokemonContainer = document.getElementById("pokemon-container");
    const searchInput = document.getElementById("searchbar");
    
    let allPokemonData = [];
    let filteredData = [];
    let currentIndex = 0;
    const batchSize = 40;

    function renderCards(count) {
        const batch = filteredData.slice(currentIndex, currentIndex + count);
        if (batch.length === 0) return;

        let htmlContent = '';
        batch.forEach((pokemonData) => {
            htmlContent += `
                <div class="pokemon-card">
                    <h2>${pokemonData.name}</h2>
                    <div class="image-container">
                        <div class="card-loader">
                            <svg viewBox="0 0 100 100" class="pokeball-svg-small">
                                <circle cx="50" cy="50" r="45" fill="white" stroke="#333" stroke-width="4"/>
                                <path d="M5 50 a45 45 0 0 1 90 0" fill="#f00" stroke="#333" stroke-width="4"/>
                                <path d="M5 50 h90" stroke="#333" stroke-width="4"/>
                                <circle cx="50" cy="50" r="12" fill="white" stroke="#333" stroke-width="4"/>
                                <circle cx="50" cy="50" r="6" fill="#f2f2f2" stroke="#333" stroke-width="2"/>
                            </svg>
                        </div>
                        <img src="${pokemonData.images.large}" alt="${pokemonData.name} Image" loading="lazy" onload="this.previousElementSibling.style.display='none'; this.style.opacity=1;">
                    </div>
                    <div class="ver-button-container">
                        <a href="detalle-pokemon.html?id=${pokemonData.id}" class="ver-button">Ver más</a>
                    </div>
                </div>
            `;
        });
        pokemonContainer.innerHTML += htmlContent;
        currentIndex += count;
    }

    fetch(jsonURL)
        .then((response) => response.json())
        .then((data) => {
            const loader = document.getElementById("global-loader");
            if (loader) {
                setTimeout(() => loader.classList.add("hidden"), 500);
            }
            
            allPokemonData = data.data;
            filteredData = allPokemonData;
            
            renderCards(batchSize);

            // Scroll event for infinite scroll
            window.addEventListener('scroll', () => {
                // If we are close to the bottom of the page
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                    renderCards(batchSize);
                }
            });

            // Search functionality: filter array and re-render from start
            searchInput.addEventListener("keyup", function() {
                const query = searchInput.value.toLowerCase();
                filteredData = allPokemonData.filter(p => p.name.toLowerCase().includes(query));
                pokemonContainer.innerHTML = ''; // Clear container
                currentIndex = 0; // Reset index
                renderCards(batchSize); // Render first batch of filtered results
            });
        })
        .catch((error) => {
            console.error("Error al cargar el JSON:", error);
        });

    var audioPlayer = document.getElementById("audio-player");
    var ramoncito = document.getElementById("ramoncito");
    ramoncito.addEventListener("click", function () {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });
});

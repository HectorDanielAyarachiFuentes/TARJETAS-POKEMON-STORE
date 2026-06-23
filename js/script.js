let currentUnitPrice = 0;

document.addEventListener("DOMContentLoaded", function () {
    const jsonURL = "./json/cards-pokemon-1.json";
    const pokemonContainer = document.getElementById("pokemon-container");
    const searchInput = document.getElementById("searchbar");

    window.allPokemonData = [];
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
                        <img src="${pokemonData.images.large}" alt="${pokemonData.name}" loading="lazy" onload="this.previousElementSibling.style.display='none'; this.style.opacity=1;">
                    </div>
                    <div class="ver-button-container">
                        <button class="ver-button" onclick="toggleInlineDetails('${pokemonData.id}', this)">Ver más</button>
                    </div>
                </div>
            `;
        });
        
        // Usar insertAdjacentHTML evita sobreescribir los nodos del DOM existentes
        pokemonContainer.insertAdjacentHTML('beforeend', htmlContent);
        currentIndex += count;
    }

    fetch(jsonURL)
        .then((response) => response.json())
        .then((data) => {
            const loader = document.getElementById("global-loader");
            if (loader) {
                setTimeout(() => loader.classList.add("hidden"), 500);
            }
            
            window.allPokemonData = data.data;
            filteredData = window.allPokemonData;
            
            renderCards(batchSize);

            window.addEventListener('scroll', () => {
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                    renderCards(batchSize);
                }
            });

            // Spotlight Search Functionality
            if(searchInput) {
                searchInput.addEventListener("input", function() {
                    const query = searchInput.value.toLowerCase();
                    filteredData = window.allPokemonData.filter(p => p.name.toLowerCase().includes(query));
                    pokemonContainer.innerHTML = '';
                    currentIndex = 0;
                    renderCards(batchSize);
                });
            }
        })
        .catch((error) => console.error("Error al cargar el JSON:", error));

    var audioPlayer = document.getElementById("audio-player");
    var ramoncito = document.getElementById("ramoncito");
    if (ramoncito && audioPlayer) {
        ramoncito.addEventListener("click", function () {
            if (audioPlayer.paused) audioPlayer.play();
            else audioPlayer.pause();
        });
    }
});

// Spotlight Logic
window.toggleSpotlight = function() {
    const spotlight = document.getElementById("spotlight-search");
    const input = document.getElementById("searchbar");
    if (spotlight.classList.contains("hidden")) {
        spotlight.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        setTimeout(() => input.focus(), 100);
    } else {
        spotlight.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
}

// Inline Accordion Logic (Google Images style)
window.toggleInlineDetails = function(id, buttonElement) {
    const existingPanel = document.getElementById("inline-detail-panel");
    
    // Si ya está abierto el mismo panel, lo cerramos
    if (existingPanel && existingPanel.dataset.id === id) {
        existingPanel.remove();
        return;
    }
    
    // Si hay otro panel abierto, lo eliminamos
    if (existingPanel) {
        existingPanel.remove();
    }
    
    const selectedPokemon = window.allPokemonData.find(p => p.id === id);
    if (!selectedPokemon) return;

    const hp = selectedPokemon.hp || 'N/A';
    const rarity = selectedPokemon.rarity || 'Común';
    const evolvesFrom = selectedPokemon.evolvesFrom || 'No evoluciona';
    const flavorText = selectedPokemon.flavorText || 'No disponible.';
    const cardPrice = selectedPokemon.tcgplayer?.prices?.holofoil?.market || selectedPokemon.tcgplayer?.prices?.normal?.market || 5.00;
    
    currentUnitPrice = cardPrice;

    // Crear el nuevo panel inline
    const panel = document.createElement('div');
    panel.id = "inline-detail-panel";
    panel.className = "expanded-panel";
    panel.dataset.id = id;

    panel.innerHTML = `
        <button class="close-panel" onclick="document.getElementById('inline-detail-panel').remove()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="panel-layout">
            <div class="panel-image">
                <img src="${selectedPokemon.images.large}" alt="${selectedPokemon.name}">
            </div>
            <div class="panel-info">
                <h2>${selectedPokemon.name}</h2>
                <p class="panel-desc">${flavorText}</p>
                <div class="panel-stats">
                    <div class="panel-stat"><strong>HP</strong><span>${hp}</span></div>
                    <div class="panel-stat"><strong>Tipo</strong><span>${selectedPokemon.types ? selectedPokemon.types.join(', ') : 'N/A'}</span></div>
                    <div class="panel-stat"><strong>Rareza</strong><span>${rarity}</span></div>
                    <div class="panel-stat"><strong>Evolución</strong><span>${evolvesFrom}</span></div>
                </div>
                <div class="panel-purchase">
                    <div class="panel-price-row">
                        <span class="panel-price" id="panel-price">$${currentUnitPrice.toFixed(2)}</span>
                        <input type="number" id="panel-qty" min="1" value="1" oninput="updatePanelPrice()">
                    </div>
                    <button class="panel-buy-btn" id="panel-buy-btn" onclick="realizarCompraPanel()">Añadir al Carrito</button>
                </div>
            </div>
        </div>
    `;

    // Buscar la tarjeta clickeada
    const cardElement = buttonElement.closest('.pokemon-card');
    // Insertar el panel inmediatamente después de la tarjeta.
    // CSS Grid (grid-column: 1 / -1) hará que ocupe todo el ancho en la fila de abajo.
    cardElement.insertAdjacentElement('afterend', panel);

    // Scroll suave hacia el panel para que se vea bien
    setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
}

window.updatePanelPrice = function() {
    const quantity = Math.max(1, parseFloat(document.getElementById('panel-qty').value) || 1);
    const priceElement = document.getElementById('panel-price');
    const total = currentUnitPrice * quantity;
    priceElement.textContent = `$${total.toFixed(2)}`;
}

window.realizarCompraPanel = function() {
    const cantidad = Math.max(1, parseFloat(document.getElementById('panel-qty').value) || 1);
    const precioTotal = (cantidad * currentUnitPrice).toFixed(2);

    const confirmacion = window.confirm(`El precio total es: $${precioTotal}. ¿Proceder con la compra?`);

    if (confirmacion) {
        const botonCompra = document.getElementById('panel-buy-btn');
        botonCompra.textContent = 'Procesando...';
        botonCompra.disabled = true;

        setTimeout(() => {
            botonCompra.textContent = '¡Añadido!';
            botonCompra.style.background = '#28a745';
            setTimeout(() => {
                const panel = document.getElementById('inline-detail-panel');
                if(panel) panel.remove();
            }, 1000);
        }, 1000);
    }
}

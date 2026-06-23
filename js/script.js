let currentUnitPrice = 0; // Para el modal

document.addEventListener("DOMContentLoaded", function () {
    const jsonURL = "./json/cards-pokemon-1.json";
    const pokemonContainer = document.getElementById("pokemon-container");
    const searchInput = document.getElementById("searchbar");
    const modal = document.getElementById("pokemon-modal");
    
    // Asignar evento para cerrar modal haciendo clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePokemonModal();
        }
    });

    window.allPokemonData = []; // Lo hacemos global para acceder desde el modal
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
                        <button class="ver-button" onclick="showPokemonModal('${pokemonData.id}')">Ver más</button>
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
            
            window.allPokemonData = data.data;
            filteredData = window.allPokemonData;
            
            renderCards(batchSize);

            // Scroll event for infinite scroll
            window.addEventListener('scroll', () => {
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                    renderCards(batchSize);
                }
            });

            // Search functionality
            searchInput.addEventListener("keyup", function() {
                const query = searchInput.value.toLowerCase();
                filteredData = window.allPokemonData.filter(p => p.name.toLowerCase().includes(query));
                pokemonContainer.innerHTML = '';
                currentIndex = 0;
                renderCards(batchSize);
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

// Modal Logic
window.showPokemonModal = function(id) {
    const modal = document.getElementById("pokemon-modal");
    const modalBody = document.getElementById("modal-body");
    
    const selectedPokemon = window.allPokemonData.find(p => p.id === id);
    if (!selectedPokemon) return;

    const hp = selectedPokemon.hp || 'N/A';
    const rarity = selectedPokemon.rarity || 'Común';
    const evolvesFrom = selectedPokemon.evolvesFrom || 'No evoluciona';
    const flavorText = selectedPokemon.flavorText || 'No disponible.';
    const cardPrice = selectedPokemon.tcgplayer?.prices?.holofoil?.market || selectedPokemon.tcgplayer?.prices?.normal?.market || 5.00;
    
    currentUnitPrice = cardPrice;

    modalBody.innerHTML = `
        <div class="pokemon-card-detail">
            <div class="detail-image-wrapper">
                <img class="detail-image" src="${selectedPokemon.images.large}" alt="${selectedPokemon.name}">
            </div>
            <div class="detail-info-wrapper">
                <h2>${selectedPokemon.name}</h2>
                <p class="description">${flavorText}</p>
                <div class="stats-grid">
                    <div class="stat-item">
                        <strong>HP</strong>
                        <span>${hp}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Tipo</strong>
                        <span>${selectedPokemon.types ? selectedPokemon.types.join(', ') : 'N/A'}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Rareza</strong>
                        <span>${rarity}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Evoluciona de</strong>
                        <span>${evolvesFrom}</span>
                    </div>
                </div>
                <div class="purchase-section">
                    <div class="price-display">
                        Precio Unitario: <span id="card-price">$${currentUnitPrice.toFixed(2)}</span>
                    </div>
                    <div class="quantity-control">
                        <label for="quantity">Cantidad:</label>
                        <input type="number" id="quantity" min="1" value="1" oninput="updateTotalPrice()">
                    </div>
                    <div class="total-price-display">
                        <strong>Total: <span id="total-price">$${currentUnitPrice.toFixed(2)}</span></strong>
                    </div>
                    <button class="buy-button" id="buy-button" onclick="realizarCompra()">Comprar</button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
}

window.closePokemonModal = function() {
    const modal = document.getElementById("pokemon-modal");
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
}

window.updateTotalPrice = function() {
    const quantity = Math.max(1, parseFloat(document.getElementById('quantity').value) || 1);
    const totalPriceElement = document.getElementById('total-price');
    const total = currentUnitPrice * quantity;
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

window.realizarCompra = function() {
    const cantidad = Math.max(1, parseFloat(document.getElementById('quantity').value) || 1);
    const precioTotal = (cantidad * currentUnitPrice).toFixed(2);

    const confirmacion = window.confirm(`El precio total es: $${precioTotal}. ¿Deseas realizar la compra?`);

    if (confirmacion) {
        const botonCompra = document.getElementById('buy-button');
        botonCompra.textContent = 'Procesando...';
        botonCompra.disabled = true;

        setTimeout(() => {
            botonCompra.textContent = '¡Comprado!';
            botonCompra.style.background = '#28a745';
            window.alert('Producto enviado. ¡Gracias por tu compra, maestro Pokémon!');
            setTimeout(closePokemonModal, 1500);
        }, 1000);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Obtén el ID del Pokémon desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get("id");
    const pokemonDetailsContainer = document.getElementById("pokemon-details-container");

    if (!pokemonId) {
        pokemonDetails.innerHTML = `<p>No se ha especificado un Pokémon.</p><a href="index.html" class="back-button">Volver</a>`;
        return;
    }

    const jsonURL = "./json/cards-pokemon-1.json";

    fetch(jsonURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const selectedPokemon = data.data.find(p => p.id === pokemonId);

            if (selectedPokemon) {
                // --- Extracción de datos con valores por defecto ---
                const hp = selectedPokemon.hp || 'N/A';
                const rarity = selectedPokemon.rarity || 'Común';
                const evolvesFrom = selectedPokemon.evolvesFrom || 'No evoluciona';
                const flavorText = selectedPokemon.flavorText || 'No disponible.';
                const cardPrice = selectedPokemon.tcgplayer?.prices?.holofoil?.market || selectedPokemon.tcgplayer?.prices?.normal?.market || 5.00;

                const detalleHtml = `
                <div class="pokemon-card-detail">
                    <div class="detail-image-wrapper">
                        <img class="detail-image" src="${selectedPokemon.images.large}" alt="${selectedPokemon.name} Image">
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
                                <span>${selectedPokemon.types.join(', ')}</span>
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
                                Precio: <span id="card-price">$${cardPrice.toFixed(2)}</span>
                            </div>
                            <div class="quantity-control">
                                <label for="quantity">Cantidad:</label>
                                <input type="number" id="quantity" min="1" value="1">
                            </div>
                            <button class="buy-button" id="buy-button">Comprar</button>
                        </div>
                    </div>
                </div>
                `;
                pokemonDetailsContainer.innerHTML = detalleHtml;

                // --- Añadir Event Listeners ---
                document.getElementById('buy-button').addEventListener('click', realizarCompra);

            } else {
                pokemonDetailsContainer.innerHTML = `<p class="error-message">Pokémon con ID '${pokemonId}' no encontrado.</p>`;
            }
        })
        .catch(error => {
            console.error("Error al cargar los detalles del Pokémon:", error);
            pokemonDetailsContainer.innerHTML = `<p class="error-message">Error al cargar los detalles del Pokémon. Por favor, inténtalo de nuevo más tarde.</p>`;
        });
});

function realizarCompra() {
    // Obtener la cantidad y el precio
    const cantidad = parseFloat(document.getElementById('quantity').value);
    const precioUnitario = parseFloat(document.getElementById('card-price').textContent.replace('$', ''));

    // Calcular el precio total
    const precioTotal = cantidad * precioUnitario;

    // Dar formato al precio total con dos decimales
    const precioTotalFormateado = precioTotal.toFixed(2);

    // Mostrar una alerta de confirmación
    const confirmacion = window.confirm(`El precio total es: $${precioTotalFormateado}. ¿Deseas realizar la compra?`);

    if (confirmacion) {
        // Cambiar el texto del botón
        const botonCompra = document.getElementById('buy-button');
        botonCompra.textContent = 'Producto Enviado';

        // Simular el envío del producto (aquí puedes agregar lógica adicional si es necesario)
        setTimeout(() => {
            window.alert('Producto enviado. ¡Gracias por tu compra!');
        }, 2000); // Simulamos el envío después de 2 segundos

        // Deshabilitar el botón después de la compra
        botonCompra.disabled = true;
    }
}
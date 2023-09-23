document.addEventListener("DOMContentLoaded", function () {
    // URL del JSON (reemplaza con la ubicación real del JSON)
    const jsonURL = "cards-pokemon-1.json";

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
        })
        .catch((error) => {
            console.error("Error al cargar el JSON:", error);
        });
});
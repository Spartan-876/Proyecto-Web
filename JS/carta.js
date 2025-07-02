fetch("/Material/ArchivosJson/productos.json")
    .then(response => response.json())
    .then(productos => {
    const contenedorGrid = document.querySelector(".grid-productos");
    const verMasBtn = document.getElementById("verMasBtn");

    let mostrados = 0;
    const cantidadPorCarga = 8;

    function cargarProductos() {
      // Determinar hasta dónde llegar
        const hasta = Math.min(mostrados + cantidadPorCarga, productos.length);

      // Generar tarjetas desde 'mostrados' hasta 'hasta'
        for (let i = mostrados; i < hasta; i++) {
        const producto = productos[i];
        const card = document.createElement("div");
        card.className = "contenedor-producto";
        card.innerHTML = `
            <div class="contenedor-imagen">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="info">
            <p class="nombre-producto">${producto.nombre}</p>
            <p class="precio-producto">S/ ${producto.precio.toFixed(2)}</p>
            </div>
        `;
        contenedorGrid.appendChild(card);
        }

        mostrados = hasta;

      // Si ya no hay más productos, ocultar el botón
        if (mostrados >= productos.length) {
        verMasBtn.style.display = "none";
        }
    }

    // Cargar los primeros productos
    cargarProductos();

    // Evento del botón
    verMasBtn.addEventListener("click", cargarProductos);
    })
    .catch(error => console.error("Error al cargar productos:", error));

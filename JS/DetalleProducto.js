document.addEventListener("DOMContentLoaded", () => {
    const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
    if (!producto) return;

    const imagenDiv = document.querySelector(".producto-imagen .imagen-placeholder");
    imagenDiv.innerHTML = `  
        <img src="${producto.imagen}" alt="${producto.nombre}">
    `;

    document.querySelector(".producto-info h2").textContent = producto.nombre;
    document.querySelector(".producto-info .precio").textContent = `S/ ${producto.precio.toFixed(2)}`;
    document.querySelector(".producto-info .descripcion").textContent = producto.descripcion || "Sin descripción.";
    document.querySelector(".producto-info .valor").textContent = producto.categoria || "Sin categoría.";

    // Productos relacionados
    fetch("/Material/ArchivosJson/productos.json")
        .then(response => response.json())
        .then(productos => {
        const relacionados = productos.filter(p =>
            p.categoria === producto.categoria && p.nombre !== producto.nombre
            ).slice(0,4);

        const relacionadosGrid = document.querySelector(".relacionados-grid");
        relacionadosGrid.innerHTML = "";

        relacionados.forEach(rel => {
            const div = document.createElement("div");
            div.className = "relacionado-item";
            div.innerHTML = `
                    <div class="img-mini">
                    <img src="${rel.imagen}" alt="${rel.nombre}" ">
                    </div>
                    <div class="linea-roja"></div>
                    <p>${rel.nombre}</p>
                    <p>S/ ${rel.precio.toFixed(2)}</p>
                `;
            div.addEventListener("click", () => {
                    localStorage.setItem("productoSeleccionado", JSON.stringify(rel));
                    window.location.reload();
                });
            relacionadosGrid.appendChild(div);
            });
        });

    // Modal y carrito
    const btnComprar = document.getElementById("btnComprar");
    const modal = document.getElementById("modalCarrito");
    const modalContenido = document.getElementById("modalContenido");
    const btnSeguirComprando = document.getElementById("btnSeguirComprando");
    const btnIrCarrito = document.getElementById("btnIrCarrito");

    if (btnComprar) {
        btnComprar.addEventListener("click", () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const index = carrito.findIndex(item => item.id === producto.id);

        if (index !== -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen,
            precio: producto.precio,
            cantidad: 1
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarModalConfirmacion();
        });
    }

    function mostrarModalConfirmacion() {
        modalContenido.innerHTML = `
        <p><strong>${producto.nombre}</strong> se agregó al carrito.</p>
        `;
        modal.style.display = "block";
    }

    btnSeguirComprando.addEventListener("click", () => {
        modal.style.display = "none";
    });

    btnIrCarrito.addEventListener("click", () => {
        window.location.href = "CarroCompras.html";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
        modal.style.display = "none";
        }
    });
});

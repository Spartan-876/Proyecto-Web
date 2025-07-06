document.addEventListener("DOMContentLoaded", () => {
    const carritoItems = document.getElementById("carrito-items");
    const totalElem = document.getElementById("total");
    const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
    const modalMensaje = document.getElementById("modalMensaje");
    const modalMensajeTexto = document.getElementById("modalMensajeTexto");
    const modalMensajeCerrar = document.getElementById("modalMensajeCerrar");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function actualizarCarrito() {
        carritoItems.innerHTML = "";

        let total = 0;

        carrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.className = "carrito-item";
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="carrito-item-info">
            <p><strong>${producto.nombre}</strong></p>
            <p>Precio: S/ ${producto.precio.toFixed(2)}</p>
            <div class="carrito-item-cantidad">
                <button class="disminuir">-</button>
                <span>${producto.cantidad}</span>
                <button class="aumentar">+</button>
            </div>
            </div>
            <button class="carrito-item-eliminar">X</button>
        `;

        // Botón eliminar
        item.querySelector(".carrito-item-eliminar").addEventListener("click", () => {
            carrito.splice(index, 1);
            guardarYActualizar();
        });

        // Botón aumentar cantidad
        item.querySelector(".aumentar").addEventListener("click", () => {
            carrito[index].cantidad++;
            guardarYActualizar();
        });

        // Botón disminuir cantidad
        item.querySelector(".disminuir").addEventListener("click", () => {
            if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
            } else {
            carrito.splice(index, 1);
            }
            guardarYActualizar();
        });

        carritoItems.appendChild(item);

        total += producto.precio * producto.cantidad;
        });

        totalElem.textContent = `Total: S/ ${total.toFixed(2)}`;
    }

    function mostrarMensaje(mensaje) {
        modalMensajeTexto.textContent = mensaje;
        modalMensaje.style.display = "block";
    }

    function guardarYActualizar() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    btnFinalizarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
            mostrarMensaje("El carrito está vacío.");
            return;
        }
        mostrarMensaje("Compra finalizada con éxito. Gracias por su compra.");
        carrito = [];
        guardarYActualizar();
    });

    modalMensajeCerrar.addEventListener("click", () => {
        modalMensaje.style.display = "none";
    });

    window.addEventListener("click", (event) => {
    if (event.target === modalMensaje) {
            modalMensaje.style.display = "none";
        }
    });

    actualizarCarrito();
});

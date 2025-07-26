document.addEventListener("DOMContentLoaded", () => {
    const carritoItems = document.getElementById("carrito-items");
    const totalElem = document.getElementById("total");
    const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
    const modalMensaje = document.getElementById("modalMensaje");
    const modalMensajeTexto = document.getElementById("modalMensajeTexto");
    const modalMensajeCerrar = document.getElementById("modalMensajeCerrar");
    const { jsPDF } = window.jspdf;

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

        item.querySelector(".carrito-item-eliminar").addEventListener("click", () => {
            carrito.splice(index, 1);
            guardarYActualizar();
        });

        item.querySelector(".aumentar").addEventListener("click", () => {
            carrito[index].cantidad++;
            guardarYActualizar();
        });

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

    function generarBoletaPDF() {
        const doc = new jsPDF({ unit: "mm", format: "a4" });

        const logo = document.getElementById("logo-Empresa");

        const canvas = document.createElement("canvas");
        canvas.width = logo.naturalWidth;
        canvas.height = logo.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(logo, 0, 0);
        const logoBase64 = canvas.toDataURL("image/png");

        doc.addImage(logoBase64, "PNG", 20, 10, 30, 30);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("BOLETA DE VENTA", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Cliente: Cliente9999", 20, 50);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 58);

        let startY = 70;
        doc.setFont("helvetica", "bold");
        doc.text("Producto", 20, startY);
        doc.text("Cant.", 100, startY);
        doc.text("Precio", 130, startY);
        doc.text("Subtotal", 160, startY);

        doc.setFont("helvetica", "normal");
        startY += 8;
        let total = 0;

        carrito.forEach(p => {
            const subtotal = p.cantidad * p.precio;
            total += subtotal;

            doc.text(p.nombre, 20, startY);
            doc.text(String(p.cantidad), 100, startY);
            doc.text(`S/${p.precio.toFixed(2)}`, 130, startY);
            doc.text(`S/${subtotal.toFixed(2)}`, 160, startY);
            startY += 8;
        });

        doc.line(20, startY, 190, startY);

        startY += 8;
        doc.setFont("helvetica", "bold");
        doc.text(`Total: S/${total.toFixed(2)}`, 160, startY);

        startY += 20;
        doc.setFontSize(11);
        doc.setFont("times", "italic");
        doc.text("¡Gracias por su compra!", 105, startY, { align: "center" });

        doc.save("boleta_pedido.pdf");
    }

    btnFinalizarCompra.addEventListener("click", () => {
        if (carrito.length === 0) {
            mostrarMensaje("El carrito está vacío.");
            return;
        }

        generarBoletaPDF();

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

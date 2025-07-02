// Variables globales
let productosCargados = [];               // Todos los productos del JSON
let productosFiltradosActuales = [];      // Productos filtrados activos
let mostrados = 0;                         // Cuántos se están mostrando
const cantidadPorCarga = 8;               // Número de productos por lote
const buscadorInput = document.getElementById("buscadorInput");
const btnBuscar = document.getElementById("btnBuscar");


// Elementos del DOM
const contenedorGrid = document.querySelector(".grid-productos");
const verMasBtn = document.getElementById("verMasBtn");
const selectCategoriaMovil = document.querySelector(".Lista1");
const selectOrdenMovil = document.querySelector(".Lista2");

// Cargar productos una sola vez
fetch("/Material/ArchivosJson/productos.json")
  .then(response => response.json())
  .then(productos => {
    productosCargados = productos;
    mostrados = 0;
    productosFiltradosActuales = []; // No hay filtro al inicio
    cargarProductos();
  })
  .catch(error => console.error("Error al cargar productos:", error));

// Función para crear una tarjeta


// Botón Ver Más
if (verMasBtn) {
  verMasBtn.addEventListener("click", () => {
    if (productosFiltradosActuales.length > 0) {
      cargarProductosFiltrados();
    } else {
      cargarProductos();
    }
  });
}

// Evento clic en categorías laterales
document.querySelectorAll(".Categoria p").forEach(p => {
  p.addEventListener("click", e => {
    const categoria = e.target.textContent.trim();
    filtrarYOrdenar(categoria);
  });
});

// Eventos en selects móviles
if (selectCategoriaMovil) {
  selectCategoriaMovil.addEventListener("change", () => {
    filtrarYOrdenar(selectCategoriaMovil.value);
  });
}
if (selectOrdenMovil) {
  selectOrdenMovil.addEventListener("change", () => {
    filtrarYOrdenar(selectCategoriaMovil.value);
  });
}

if (btnBuscar) {
  btnBuscar.addEventListener("click", () => {
    const texto = buscadorInput.value;
    filtrarPorTexto(texto);
  });
}

if (buscadorInput) {
  buscadorInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const texto = buscadorInput.value;
      filtrarPorTexto(texto);
    }
  });
}


// Función de filtrar y ordenar
function filtrarYOrdenar(categoria) {
  let productosFiltrados = productosCargados.slice();

  // Filtrar categoría
  if (categoria && categoria.toLowerCase() !== "todos") {
    productosFiltrados = productosFiltrados.filter(p =>
      p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  // Ordenar
  let criterioOrden = (selectOrdenMovil && selectOrdenMovil.value) || "0";
  if (criterioOrden === "Nombre") {
    productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (criterioOrden === "Precio") {
    productosFiltrados.sort((a, b) => a.precio - b.precio); 
  }

  // Guardar filtrados y reiniciar contador
  productosFiltradosActuales = productosFiltrados;
  mostrados = 0;

  // Limpiar contenedor
  contenedorGrid.innerHTML = "";

  // Mostrar los primeros 8 filtrados
  cargarProductosFiltrados();
}

function filtrarPorTexto(texto) {
  const textoMin = texto.trim().toLowerCase();

  let productosFiltrados = [];

  if (textoMin === "") {
    productosFiltrados = productosCargados.slice();
  } else {
    productosFiltrados = productosCargados.filter(p =>
      p.nombre.toLowerCase().includes(textoMin)
    );
  }

  productosFiltradosActuales = productosFiltrados;
  mostrados = 0;

  contenedorGrid.innerHTML = "";

  cargarProductosFiltrados();
}


function crearCard(producto) {
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
  card.addEventListener("click", () => {
    // Guardar producto seleccionado
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    // Redirigir
    window.location.href = "Producto.html";
  });

  return card;
}

// Mostrar productos del listado general
function cargarProductos() {
  const hasta = Math.min(mostrados + cantidadPorCarga, productosCargados.length);

  for (let i = mostrados; i < hasta; i++) {
    const card = crearCard(productosCargados[i]);
    contenedorGrid.appendChild(card);
  }

  mostrados = hasta;

  // Ocultar o mostrar el botón
  if (mostrados >= productosCargados.length) {
    if (verMasBtn) verMasBtn.style.display = "none";
  } else {
    if (verMasBtn) verMasBtn.style.display = "";
  }
}

// Mostrar productos filtrados
function cargarProductosFiltrados() {
  const hasta = Math.min(mostrados + cantidadPorCarga, productosFiltradosActuales.length);

  for (let i = mostrados; i < hasta; i++) {
    const card = crearCard(productosFiltradosActuales[i]);
    contenedorGrid.appendChild(card);
  }

  mostrados = hasta;

  if (mostrados >= productosFiltradosActuales.length) {
    if (verMasBtn) verMasBtn.style.display = "none";
  } else {
    if (verMasBtn) verMasBtn.style.display = "";
  }
}
// Variables globales
let productosCargados = [];              
let productosFiltradosActuales = [];      
let mostrados = 0;                         
const cantidadPorCarga = 8;               
const buscadorInput = document.getElementById("buscadorInput");
const btnBuscar = document.getElementById("btnBuscar");

// Elementos del DOM
const contenedorGrid = document.querySelector(".grid-productos");
const verMasBtn = document.getElementById("verMasBtn");

// Fetch JSON
fetch("/Material/ArchivosJson/productos.json")
  .then(response => response.json())
  .then(productos => {
    productosCargados = productos;
    mostrados = 0;
    productosFiltradosActuales = []; 
    cargarProductos();
  })
  .catch(error => console.error("Error al cargar productos:", error));

// Botón Ver más
if (verMasBtn) {
  verMasBtn.addEventListener("click", () => {
    if (productosFiltradosActuales.length > 0) {
      cargarProductosFiltrados();
    } else {
      cargarProductos();
    }
  });
}

// Categorías PC
document.querySelectorAll(".Categoria p").forEach(p => {
  p.addEventListener("click", e => {
    const categoria = e.target.textContent.trim();
    filtrarYOrdenar(categoria);
  });
});

// Categoría móvil
const selectCategoriaMovil = document.querySelector(".Lista1");
if (selectCategoriaMovil) {
  selectCategoriaMovil.addEventListener("change", () => {
    filtrarYOrdenar(selectCategoriaMovil.value);
  });
}

// Orden móvil
const selectOrdenMovil = document.querySelector(".barra-filtro-movil .Lista2");
const selectOrdenPC = document.querySelector(".barra-filtro-pc .Lista2");

// Ordenador Móvil
if (selectOrdenMovil) {
  selectOrdenMovil.addEventListener("change", () => {
    filtrarYOrdenar(selectCategoriaMovil.value);
  });
}

// Ordenador PC
if (selectOrdenPC) {
  selectOrdenPC.addEventListener("change", () => {
    filtrarYOrdenar("");
  });
}

// Buscador
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

// Función principal
function filtrarYOrdenar(categoria) {
  let productosFiltrados = productosCargados.slice();

  // Filtrar categoría
  if (categoria && categoria.toLowerCase() !== "todos") {
    productosFiltrados = productosFiltrados.filter(p =>
      p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  // Detectar qué select usar según pantalla
  let criterioOrden = "0";
  if (window.innerWidth <= 900) {
    criterioOrden = selectOrdenMovil ? selectOrdenMovil.value : "0";
  } else {
    criterioOrden = selectOrdenPC ? selectOrdenPC.value : "0";
  }

  // Ordenar
  switch (criterioOrden) {
    case "nombre-asc":
      productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case "nombre-desc":
      productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    case "precio-asc":
      productosFiltrados.sort((a, b) => a.precio - b.precio);
      break;
    case "precio-desc":
      productosFiltrados.sort((a, b) => b.precio - a.precio);
      break;
  }

  productosFiltradosActuales = productosFiltrados;
  mostrados = 0;

  contenedorGrid.innerHTML = "";
  cargarProductosFiltrados();
}

// Buscar por texto
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

// Crear tarjeta
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
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "Producto.html";
  });
  return card;
}

// Cargar productos generales
function cargarProductos() {
  const hasta = Math.min(mostrados + cantidadPorCarga, productosCargados.length);

  for (let i = mostrados; i < hasta; i++) {
    const card = crearCard(productosCargados[i]);
    contenedorGrid.appendChild(card);
  }

  mostrados = hasta;

  if (mostrados >= productosCargados.length) {
    if (verMasBtn) verMasBtn.style.display = "none";
  } else {
    if (verMasBtn) verMasBtn.style.display = "";
  }
}

// Cargar productos filtrados
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

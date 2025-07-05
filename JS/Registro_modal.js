document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalConfirmacion");
    const spanCerrar = document.querySelector(".modal-cerrar");
    const formulario = document.getElementById("formulario-pedidos");


    function mostrarModal() {
        modal.style.display = "block";
    }

    spanCerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });


    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    formulario.addEventListener("submit", (e) => {
        e.preventDefault(); 
        mostrarModal();
        formulario.reset();
    });
});

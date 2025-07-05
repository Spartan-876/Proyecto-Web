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

        const formData = new FormData(formulario);

        fetch(formulario.action, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                mostrarModal();
                formulario.reset();
            } else {
                alert("Ocurrió un error al enviar el formulario.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("No se pudo enviar el formulario.");
        });
    });
});

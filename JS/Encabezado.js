function ajustarMarginTopBody() {
    const header = document.querySelector('header');
    if (header) {
        document.body.style.marginTop = header.offsetHeight + 'px';
    }
}
window.addEventListener('DOMContentLoaded', ajustarMarginTopBody);
window.addEventListener('resize', ajustarMarginTopBody);

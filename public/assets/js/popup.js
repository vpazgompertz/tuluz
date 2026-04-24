(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const modal = document.getElementById("modalProducto");
    if (!modal) return;

    // Click en cualquier card → abrir el modal
    document.addEventListener("click", function (e) {
      // Ignorar clicks dentro del modal
      if (e.target.closest(".mp")) return;

      const card = e.target.closest("[data-product-id]");
      if (card) abrir(modal);
    });

    // Click dentro del modal: cerrar / cantidad / acciones
    modal.addEventListener("click", function (e) {
      // Click en el overlay (fuera de la caja) → cerrar
      if (e.target === modal) {
        cerrar(modal);
        return;
      }

      // Botón X
      if (e.target.closest("[data-mp-cerrar]")) {
        cerrar(modal);
        return;
      }

      // Botones + / -
      const btnCant = e.target.closest("[data-mp-cant]");
      if (btnCant) {
        ajustarCantidad(modal, parseInt(btnCant.dataset.mpCant, 10));
        return;
      }

      // Acciones
      const btnAccion = e.target.closest("[data-mp-accion]");
      if (btnAccion) {
        ejecutarAccion(modal, btnAccion.dataset.mpAccion);
      }
    });

    // Escape para cerrar
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        cerrar(modal);
      }
    });
  }

  function abrir(modal) {
    resetCantidad(modal);
    modal.classList.add("is-open");
    document.body.classList.add("mp-open");
  }

  function cerrar(modal) {
    modal.classList.remove("is-open");
    document.body.classList.remove("mp-open");
  }

  function resetCantidad(modal) {
    const input = modal.querySelector('input[name="cantidad"]');
    if (input) input.value = 1;
  }

  function ajustarCantidad(modal, delta) {
    const input = modal.querySelector('input[name="cantidad"]');
    if (!input) return;
    const actual = parseInt(input.value, 10) || 1;
    input.value = Math.max(1, Math.min(99, actual + delta));
  }

  function getCantidad(modal) {
    const input = modal.querySelector('input[name="cantidad"]');
    return Math.max(1, parseInt(input.value, 10) || 1);
  }

  function ejecutarAccion(modal, accion) {
    const cantidad = getCantidad(modal);

    if (accion === "carro") {
      toast(cantidad + " × Anillo Celeste añadido");
    } else if (accion === "comprar") {
      const total = 89990 * cantidad;
      toast("Ir a pagar · $" + total.toLocaleString("es-CL"));
    }

    cerrar(modal);
  }

  function toast(mensaje) {
    const t = document.getElementById("mpToast");
    if (!t) return;
    t.textContent = mensaje;
    t.classList.add("is-show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.classList.remove("is-show");
    }, 2500);
  }
})();

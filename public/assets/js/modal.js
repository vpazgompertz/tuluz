(function () {
  "use strict";

  const PRODUCTO_DEMO = {
    id: "p1",
    nombre: "Anillo Celeste",
    categoria: "Anillos",
    precio: 89990,
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80",
  };

  // Estado del carrito (en memoria, no persiste)
  let carrito = [];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    inicializarModal();
    inicializarDrawer();
    renderCarrito();
  }

  /* ================================
     MODAL
     ============================ */
  function inicializarModal() {
    const modal = document.getElementById("modalProducto");
    if (!modal) return;

    // Click en card → abrir modal
    document.addEventListener("click", function (e) {
      if (e.target.closest(".mp") || e.target.closest(".cd")) return;
      const card = e.target.closest("[data-product-id]");
      if (card) abrirModal(modal);
    });

    // Click dentro del modal
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        cerrarModal(modal);
        return;
      }
      if (e.target.closest("[data-mp-cerrar]")) {
        cerrarModal(modal);
        return;
      }

      const btnCant = e.target.closest("[data-mp-cant]");
      if (btnCant) {
        ajustarCantidad(modal, parseInt(btnCant.dataset.mpCant, 10));
        return;
      }

      const btnAccion = e.target.closest("[data-mp-accion]");
      if (btnAccion) ejecutarAccion(modal, btnAccion.dataset.mpAccion);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (modal.classList.contains("is-open")) cerrarModal(modal);
    });
  }

  function abrirModal(modal) {
    resetCantidad(modal);
    modal.classList.add("is-open");
    document.body.classList.add("mp-open");
  }

  function cerrarModal(modal) {
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

  function getCantidadModal(modal) {
    const input = modal.querySelector('input[name="cantidad"]');
    return Math.max(1, parseInt(input.value, 10) || 1);
  }

  function ejecutarAccion(modal, accion) {
    const cantidad = getCantidadModal(modal);

    if (accion === "carro") {
      agregarAlCarrito(PRODUCTO_DEMO, cantidad);
      cerrarModal(modal);
      // Pequeño delay para que se sienta natural la transición
      setTimeout(abrirDrawer, 250);
    } else if (accion === "comprar") {
      agregarAlCarrito(PRODUCTO_DEMO, cantidad);
      cerrarModal(modal);
      const total = totalCarrito();
      toast("Ir a pagar · $" + total.toLocaleString("es-CL"));
    }
  }

  /* ============================================
     CARRITO
     ============================================ */
  function agregarAlCarrito(producto, cantidad) {
    const existente = carrito.find(function (i) {
      return i.id === producto.id;
    });
    if (existente) {
      existente.cantidad = Math.min(99, existente.cantidad + cantidad);
    } else {
      carrito.push(Object.assign({}, producto, { cantidad: cantidad }));
    }
    renderCarrito();
  }

  function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (i) {
      return i.id !== id;
    });
    renderCarrito();
  }

  function cambiarCantidadCarrito(id, delta) {
    const item = carrito.find(function (i) {
      return i.id === id;
    });
    if (!item) return;
    item.cantidad = Math.max(1, Math.min(99, item.cantidad + delta));
    renderCarrito();
  }

  function totalCarrito() {
    return carrito.reduce(function (sum, i) {
      return sum + i.precio * i.cantidad;
    }, 0);
  }

  function totalItems() {
    return carrito.reduce(function (sum, i) {
      return sum + i.cantidad;
    }, 0);
  }

  function renderCarrito() {
    const items = totalItems();
    const total = totalCarrito();

    // Actualizar contador del botón trigger
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = items;
      el.dataset.count = items;
    });

    // Actualizar total y subtotal
    const elTotal = document.getElementById("cdTotal");
    const elSubtotal = document.getElementById("cdSubtotal");
    if (elTotal) elTotal.textContent = "$" + total.toLocaleString("es-CL");
    if (elSubtotal)
      elSubtotal.textContent = "$" + total.toLocaleString("es-CL");

    // Habilitar/deshabilitar botones
    document.querySelectorAll("[data-cd-checkout]").forEach(function (btn) {
      btn.disabled = carrito.length === 0;
    });

    // Renderizar items
    const cont = document.getElementById("cdItems");
    if (!cont) return;

    if (carrito.length === 0) {
      cont.innerHTML =
        '<div class="cd__vacio">' +
        '<div class="cd__vacio-icon">🛍️</div>' +
        '<div class="cd__vacio-texto">Tu carrito está vacío</div>' +
        "</div>";
      return;
    }

    cont.innerHTML = carrito
      .map(function (item) {
        const subtotal = item.precio * item.cantidad;
        return (
          '<div class="cd__item" data-item-id="' +
          item.id +
          '">' +
          '<div class="cd__item-img">' +
          (item.img
            ? '<img src="' + item.img + '" alt="' + escape(item.nombre) + '">'
            : "💍") +
          "</div>" +
          '<div class="cd__item-info">' +
          '<h4 class="cd__item-nombre">' +
          escape(item.nombre) +
          "</h4>" +
          '<div class="cd__item-cat">' +
          escape(item.categoria || "") +
          "</div>" +
          '<div class="cd__item-precio">$' +
          subtotal.toLocaleString("es-CL") +
          "</div>" +
          '<div class="cd__item-cant">' +
          '<button type="button" data-cd-item-cant="-1">−</button>' +
          "<span>" +
          item.cantidad +
          "</span>" +
          '<button type="button" data-cd-item-cant="1">+</button>' +
          "</div>" +
          "</div>" +
          '<button type="button" class="cd__item-eliminar" data-cd-item-eliminar aria-label="Eliminar">✕</button>' +
          "</div>"
        );
      })
      .join("");
  }

  /* ============================================
     DRAWER
     ============================================ */
  function inicializarDrawer() {
    const drawer = document.getElementById("carritoDrawer");
    const overlay = document.getElementById("carritoOverlay");
    if (!drawer || !overlay) return;

    // Abrir drawer (botón del header)
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-cd-abrir]")) abrirDrawer();
    });

    // Cerrar (X o overlay)
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-cd-cerrar]")) cerrarDrawer();
    });
    overlay.addEventListener("click", cerrarDrawer);

    // Acciones en items
    drawer.addEventListener("click", function (e) {
      const itemEl = e.target.closest("[data-item-id]");
      if (!itemEl) return;
      const id = itemEl.dataset.itemId;

      if (e.target.closest("[data-cd-item-eliminar]")) {
        eliminarDelCarrito(id);
        return;
      }

      const btnCant = e.target.closest("[data-cd-item-cant]");
      if (btnCant) {
        cambiarCantidadCarrito(id, parseInt(btnCant.dataset.cdItemCant, 10));
      }
    });

    // Botones de checkout
    drawer.addEventListener("click", function (e) {
      if (e.target.closest('[data-cd-accion="comprar"]')) {
        if (carrito.length === 0) return;
        toast("Ir a pagar · $" + totalCarrito().toLocaleString("es-CL"));
      }
      if (e.target.closest('[data-cd-accion="seguir"]')) {
        cerrarDrawer();
      }
    });

    // Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        cerrarDrawer();
      }
    });
  }

  function abrirDrawer() {
    document.getElementById("carritoDrawer").classList.add("is-open");
    document.getElementById("carritoOverlay").classList.add("is-open");
    document.body.classList.add("cd-open");
  }

  function cerrarDrawer() {
    document.getElementById("carritoDrawer").classList.remove("is-open");
    document.getElementById("carritoOverlay").classList.remove("is-open");
    document.body.classList.remove("cd-open");
  }

  /* ============================================
     UTILS
     ============================================ */
  function escape(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

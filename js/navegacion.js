function verProducto(nombre) {
  localStorage.setItem("productoSeleccionado", nombre);
  window.location.href = "producto.html";
}

function verCientifico(nombre) {
  localStorage.setItem("cientificoSeleccionado", nombre);
  window.location.href = "cientifico.html";
}

function verEntidad(nombre) {
  localStorage.setItem("entidadSeleccionada", nombre);
  window.location.href = "entidad.html";
}

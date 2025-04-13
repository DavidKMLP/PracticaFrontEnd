function verProducto(nombre) {
  const producto = ServicioDatos.obtenerProductoPorNombre(nombre);
  if (producto) {
    ServicioDatos.guardarProductoSeleccionado(producto);
    window.location.href = "producto.html";
  }
}

function verCientifico(nombre) {
  const cientifico = ServicioDatos.obtenerCientificoPorNombre(nombre);
  if (cientifico) {
    ServicioDatos.guardarCientificoSeleccionado(cientifico);
    window.location.href = "cientifico.html";
  }
}

function verEntidad(nombre) {
  const entidad = ServicioDatos.obtenerEntidadPorNombre(nombre);
  if (entidad) {
    ServicioDatos.guardarEntidadSeleccionada(entidad);
    window.location.href = "entidad.html";
  }
}

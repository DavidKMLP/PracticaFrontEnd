const ServicioDatos = {
    // Productos
    obtenerProductos: function () {
      const datos = localStorage.getItem("productos");
      return datos ? JSON.parse(datos) : [];
    },
  
    obtenerProductoPorNombre: function (nombre) {
      return this.obtenerProductos().find(p => p.nombre === nombre);
    },
  
    guardarProductos: function (productos) {
      localStorage.setItem("productos", JSON.stringify(productos));
    },
  
    guardarProductoSeleccionado: function (producto) {
      localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    },
  
    obtenerProductoSeleccionado: function () {
      return JSON.parse(localStorage.getItem("productoSeleccionado"));
    },
  
    // Científicos
    obtenerCientificos: function () {
      const datos = localStorage.getItem("cientificos");
      return datos ? JSON.parse(datos) : [];
    },
  
    obtenerCientificoPorNombre: function (nombre) {
      return this.obtenerCientificos().find(c => c.nombre === nombre);
    },
  
    guardarCientificos: function (cientificos) {
      localStorage.setItem("cientificos", JSON.stringify(cientificos));
    },
  
    guardarCientificoSeleccionado: function (cientifico) {
      localStorage.setItem("cientificoSeleccionado", JSON.stringify(cientifico));
    },
  
    obtenerCientificoSeleccionado: function () {
      return JSON.parse(localStorage.getItem("cientificoSeleccionado"));
    }
  };
  
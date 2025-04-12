const ServicioDatos = {
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
    }
  };
  
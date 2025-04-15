const DatosApp = {
    clave: "datosGuardados", 
    cargarDatos: async function () {
        const guardados = localStorage.getItem(this.clave);
        if (guardados) {
            return JSON.parse(guardados);
        } else {
            const respuesta = await fetch("datos.json");
            const datos = await respuesta.json();
            localStorage.setItem(this.clave, JSON.stringify(datos));
            return datos;
        }
    },
    guardarDatos: function (datos) {
        localStorage.setItem(this.clave, JSON.stringify(datos));
    },
  
    obtenerProductos: async function () {
        const datos = await this.cargarDatos();
        return datos.productos || [];
    },

    guardarProducto: async function (nuevoProducto) {
        const datos = await this.cargarDatos();
        datos.productos.push(nuevoProducto);
        this.guardarDatos(datos);
    },

    eliminarProducto: async function (nombre) {
        const datos = await this.cargarDatos();
        datos.productos = datos.productos.filter(p => p.nombre !== nombre);
        this.guardarDatos(datos);
    },

    obtenerCientificos: async function () {
        const datos = await this.cargarDatos();
        return datos.cientificos || [];
    },

    guardarCientifico: async function (nuevo) {
        const datos = await this.cargarDatos();
        datos.cientificos.push(nuevo);
        this.guardarDatos(datos);
    },

    obtenerEntidades: async function () {
        const datos = await this.cargarDatos();
        return datos.entidades || [];
    },

    guardarEntidad: async function (nueva) {
        const datos = await this.cargarDatos();
        datos.entidades.push(nueva);
        this.guardarDatos(datos);
    },
    obtenerProductoSeleccionado: async function () {
        const nombre = localStorage.getItem("productoSeleccionado");
        const productos = await this.obtenerProductos();
        return productos.find(p => p.nombre === nombre);
    },

    obtenerCientificoSeleccionado: async function () {
        const nombre = localStorage.getItem("cientificoSeleccionado");
        const cientificos = await this.obtenerCientificos();
        return cientificos.find(c => c.nombre === nombre);
    },

    obtenerEntidadSeleccionada: async function () {
        const nombre = localStorage.getItem("entidadSeleccionada");
        const entidades = await this.obtenerEntidades();
        return entidades.find(e => e.nombre === nombre);
    }

};

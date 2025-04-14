const usuarios = [
    { usuario: 'x', contrasena: 'x', rol: 'lector' },
    { usuario: 'y', contrasena: 'y', rol: 'lector' },
    { usuario: 'z', contrasena: 'z', rol: 'escritor' }
];

//Guarda sesion
const sesionActiva = JSON.parse(localStorage.getItem("usuarioLogueado"));
if (sesionActiva) {
    mostrarVistaPorRol(sesionActiva);
}

// Inicio de sesión
document.getElementById('formulario-inicio-sesion').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuarioInput = document.getElementById('usuario').value.trim();
    const contrasenaInput = document.getElementById('contrasena').value.trim();

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuarioInput && u.contrasena === contrasenaInput);

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
        mostrarVistaPorRol(usuarioEncontrado);
    } else {
        alert('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
});

//Vista segun el rol
function mostrarVistaPorRol(usuario) {
    document.getElementById('vista-usuario-normal').style.display = 'none';
    document.getElementById('formulario-inicio-sesion').style.display = 'none';
    document.getElementById('boton-cerrar-sesion').style.display = 'inline-block';
    document.getElementById('contenedor-logout').style.display = 'flex';

    if (usuario.rol === 'lector') {
        document.getElementById('vista-lector').style.display = 'block';
        DatosApp.obtenerProductos().then(productos => {
            renderizarListaProductos(productos, 'contenedor-productos-lector');
          });
        
          DatosApp.obtenerCientificos().then(cientificos => {
            renderizarListaCientificos(cientificos, 'contenedor-cientificos-lector');
          });
        
          DatosApp.obtenerEntidades().then(entidades => {
            renderizarListaEntidades(entidades, 'contenedor-entidades-lector');
          });
    } else if (usuario.rol === 'escritor') {
        document.getElementById('vista-escritor').style.display = 'block';
        DatosApp.obtenerProductos().then(productos => {
            renderizarListaProductos(productos, 'contenedor-productos-escritor', true);
        });
        DatosApp.obtenerCientificos().then(c => {
            renderizarListaCientificos(c, 'contenedor-cientificos-escritor', true);
        });

        DatosApp.obtenerEntidades().then(e => {
            renderizarListaEntidades(e, 'contenedor-entidades-escritor', true);
        });

    }
}

// Cierre de sesión
document.getElementById('boton-cerrar-sesion').addEventListener('click', function () {
    localStorage.removeItem("usuarioLogueado");

    document.getElementById('vista-usuario-normal').style.display = 'block';
    document.getElementById('vista-lector').style.display = 'none';
    document.getElementById('vista-escritor').style.display = 'none';
    document.getElementById('formulario-inicio-sesion').style.display = 'flex';
    document.getElementById('boton-cerrar-sesion').style.display = 'none';
    document.getElementById('contenedor-logout').style.display = 'none';

    document.getElementById('usuario').value = '';
    document.getElementById('contrasena').value = '';
});

// Renderizar productos dinámicamente
function renderizarListaProductos(productos, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const div = document.createElement("div");
        div.className = "elemento-datos";
        div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" />
        <a href="producto.html" onclick="verProducto('${producto.nombre}')">${producto.nombre}</a>
        ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarProducto('${producto.nombre}')">delete</button>` : ""}
      `;
        contenedor.appendChild(div);
    });
}
// Renderizar cientificos dinámicamente
function renderizarListaCientificos(cientificos, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    cientificos.forEach(c => {
        const div = document.createElement("div");
        div.className = "elemento-datos";
        div.innerHTML = `
        <img src="${c.imagen}" alt="${c.nombre}" />
        <a href="cientifico.html" onclick="verCientifico('${c.nombre}')">${c.nombre}</a>
        ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarCientifico('${c.nombre}')">delete</button>` : ""}
      `;
        contenedor.appendChild(div);
    });
}
// Renderizar entidades dinámicamente
function renderizarListaEntidades(entidades, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    entidades.forEach(e => {
        const div = document.createElement("div");
        div.className = "elemento-datos";
        div.innerHTML = `
        <img src="${e.imagen}" alt="${e.nombre}" />
        <a href="entidad.html" onclick="verEntidad('${e.nombre}')">${e.nombre}</a>
        ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarEntidad('${e.nombre}')">delete</button>` : ""}
      `;
        contenedor.appendChild(div);
    });
}


// Eliminar producto
async function eliminarProducto(nombre) {
    if (confirm(`¿Eliminar el producto "${nombre}"?`)) {
        await DatosApp.eliminarProducto(nombre);
        const productosActualizados = await DatosApp.obtenerProductos();
        renderizarListaProductos(productosActualizados, 'contenedor-productos-escritor', true);
    }
}

async function eliminarCientifico(nombre) {
    if (confirm(`¿Eliminar al científico "${nombre}"?`)) {
      const datos = await DatosApp.cargarDatos();
      datos.cientificos = datos.cientificos.filter(c => c.nombre !== nombre);
      DatosApp.guardarDatos(datos);
      renderizarListaCientificos(datos.cientificos, 'contenedor-cientificos-escritor', true);
    }
  }
  
  async function eliminarEntidad(nombre) {
    if (confirm(`¿Eliminar la entidad "${nombre}"?`)) {
      const datos = await DatosApp.cargarDatos();
      datos.entidades = datos.entidades.filter(e => e.nombre !== nombre);
      DatosApp.guardarDatos(datos);
      renderizarListaEntidades(datos.entidades, 'contenedor-entidades-escritor', true);
    }
  }
  

// Navegación entre vistas
function verProducto(nombre) {
    localStorage.setItem("productoSeleccionado", nombre);
}
function verCientifico(nombre) {
    localStorage.setItem("cientificoSeleccionado", nombre);
}
function verEntidad(nombre) {
    localStorage.setItem("entidadSeleccionada", nombre);
}

if (performance.getEntriesByType("navigation")[0].type === "back_forward") {
    window.location.reload();
}

// Render productos, cientificos y entidades
DatosApp.obtenerProductos().then(productos => {
    renderizarListaProductos(productos, 'contenedor-productos-normal');
});

DatosApp.obtenerCientificos().then(cientificos => {
    renderizarListaCientificos(cientificos, 'contenedor-cientificos-normal');
});

DatosApp.obtenerEntidades().then(entidades => {
    renderizarListaEntidades(entidades, 'contenedor-entidades-normal');
});


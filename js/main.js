
//Guarda sesion
let accessToken = localStorage.getItem("accessToken");
if (accessToken) {
    try {
        const decoded = JSON.parse(atob(accessToken.split('.')[1]));
        const scopes = decoded.scopes || [];
        const usernameFromToken = decoded.sub;

        if (scopes.includes("writer")) {
            mostrarVistaPorRol({ rol: "writer", username: usernameFromToken });
        } else if (scopes.includes("reader")) {
            mostrarVistaPorRol({ rol: "reader", username: usernameFromToken });
        }

        const registroLink = document.getElementById("registro-link");
        if (registroLink) registroLink.style.display = "none";
    } catch (e) {
        console.error("Token acceso inválido");
        localStorage.removeItem("accessToken");
    }
}


// Inicio de sesión
document.getElementById('formulario-inicio-sesion').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuarioInput = document.getElementById('usuario').value.trim();
    const contrasenaInput = document.getElementById('contrasena').value.trim();

    try {
        //Obtenemos el Jwt token
        const response = await fetch('http://127.0.0.1:8000/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usuarioInput,
                password: contrasenaInput
            })
        });

        //Mensaje de error
        if (!response.ok) {
            throw new Error("Credenciales incorrectas o cuenta pendiente de validación por un administrador. Gracias por su paciencia");
        }

        const data = await response.json();

        //console.log("Token recibido:", data);//debug
        accessToken = data.access_token;

        localStorage.setItem("accessToken", accessToken);


        //Decodifico el jwt para extraer el scope y el nombre del user(verificado usando jwt.io)

        const decoded = JSON.parse(atob(accessToken.split('.')[1]));
        const scopes = decoded.scopes || [];
        const usernameFromToken = decoded.sub;

        const role = scopes.includes("writer") ? "writer"
            : scopes.includes("reader") ? "reader"
                : "unknown";
        localStorage.setItem("userRol", role);

        // 3. Validar el rol y mostrar vista
        if (scopes.includes("writer")) {
            mostrarVistaPorRol({ rol: "writer", username: usernameFromToken });
        } else if (scopes.includes("reader")) {
            mostrarVistaPorRol({ rol: "reader", username: usernameFromToken });
        } else {
            throw new Error("El token no contiene un rol válido.");
        }

    } catch (error) {
        alert("Inicio de sesión fallido: " + error.message);
        console.error("Error en login:", error);
    }
});

//Vista segun el rol
function mostrarVistaPorRol(usuario) {
    document.getElementById('vista-usuario-normal').style.display = 'none';
    document.getElementById('formulario-inicio-sesion').style.display = 'none';
    document.getElementById('registro-link').style.display = 'none';
    document.getElementById('boton-cerrar-sesion').style.display = 'inline-block';
    document.getElementById('contenedor-logout').style.display = 'flex';

    //Mostrar informacion usuario conectado
    const userInfo = document.getElementById('usuario-conectado');
    if (userInfo) {
        userInfo.textContent = `Conectado como: ${usuario.username}`;
        userInfo.style.display = 'block';
    }

    if (usuario.rol === 'reader') {
        document.getElementById('vista-lector').style.display = 'block';
        cargarProductos();
        cargarCientificos();
        cargarEntidades();
    } else if (usuario.rol === 'writer') {
        document.getElementById('vista-escritor').style.display = 'block';
        cargarProductos();
        cargarCientificos();
        cargarEntidades();
    } else if (usuario.rol === 'inactive') {
        alert('El usuario está inactivo hasta la validación de un administrador. Gracias por su paciencia.');
        document.getElementById('formulario-inicio-sesion').style.display = 'block';
        document.getElementById('boton-cerrar-sesion').style.display = 'none';
        document.getElementById('contenedor-logout').style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'none';
        }
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

    document.getElementById('usuario-conectado').style.display = 'none';

    //borrar localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRol");

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

// Renderizar cientificos dinámicamente con API
function renderizarListaCientificos(cientificos, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    cientificos.forEach(c => {
        const div = document.createElement("div");
        div.className = "elemento-datos";
        div.innerHTML = `
        <img src="${c.imagen}" alt="${c.name}" />
        <a href="cientifico.html" onclick="verCientifico('${c.id}')">${c.name}</a>
        ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarCientifico('${c.id}')">delete</button>` : ""}
      `;
        contenedor.appendChild(div);
    });
}

// Renderizar productos dinámicamente con API
function renderizarListaProductos(productos, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    productos.forEach(p => {
        const div = document.createElement("div");
        div.className = "elemento-datos";
        div.innerHTML = `
      <img src="${p.imageUrl || 'img/default.jpg'}" alt="${p.name}" />
      <a href="producto.html" onclick="verProducto(${p.id})">${p.name}</a>
      ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarProducto(${p.id})">delete</button>` : ""}
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
      <img src="${e.imageUrl || 'img/default.jpg'}" alt="${e.name}" />
      <a href="entidad.html" onclick="verEntidad(${e.id})">${e.name}</a>
      ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarEntidad(${e.id})">delete</button>` : ""}
    `;
        contenedor.appendChild(div);
    });
}

//Modificado para la implementacion 
async function cargarCientificos() {
    console.log("▶️ Ejecutando cargarCientificos()");

    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/persons');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("Respuesta cruda de la API:", result);//debug

        // Extraer el array de personas desde result.persons
        const cientificos = result.persons.map(p => p.person);

        const contenedores = [
            document.getElementById("contenedor-cientificos-normal"),
            document.getElementById("contenedor-cientificos-lector"),
            document.getElementById("contenedor-cientificos-escritor")
        ];

        contenedores.forEach(contenedor => {
            if (!contenedor) return;
            contenedor.innerHTML = "";

            cientificos.forEach(c => {
                const div = document.createElement("div");
                div.className = "elemento-datos";
                div.innerHTML = `
          <img src="${c.imageUrl || 'img/default.jpg'}" alt="${c.id}" />
          <a href="cientifico.html" onclick="verCientifico(${c.id})">${c.name}</a>
          ${contenedor.id.includes("escritor") ? `<button class="boton-eliminar" onclick="eliminarCientifico(${c.id})">delete</button>` : ""}
        `;
                contenedor.appendChild(div);
            });
        });

    } catch (error) {
        console.error("Error al cargar científicos:", error);
        alert("No se pudieron cargar los científicos. Revisa la consola.");
    }
}

// Modificado para la implementacion de la api
async function cargarEntidades() {
    console.log("▶️ Ejecutando cargarEntidades()");
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/entities');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();
        const entidades = result.entities.map(e => e.entity);

        const contenedores = [
            document.getElementById("contenedor-entidades-normal"),
            document.getElementById("contenedor-entidades-lector"),
            document.getElementById("contenedor-entidades-escritor")
        ];

        contenedores.forEach(contenedor => {
            if (!contenedor) return;
            contenedor.innerHTML = "";

            entidades.forEach(e => {
                const div = document.createElement("div");
                div.className = "elemento-datos";
                div.innerHTML = `
          <img src="${e.imageUrl || 'img/default.jpg'}" alt="${e.id}" />
          <a href="entidad.html" onclick="verEntidad(${e.id})">${e.name}</a>
          ${contenedor.id.includes("escritor") ? `<button class="boton-eliminar" onclick="eliminarEntidad(${e.id})">delete</button>` : ""}
        `;
                contenedor.appendChild(div);
            });
        });

    } catch (error) {
        console.error("❌ Error al cargar entidades:", error);
        alert("No se pudieron cargar las entidades. Revisa la consola.");
    }
}

// Modificado para la implementacion de la api
async function cargarProductos() {
    console.log("▶️ Ejecutando cargarProductos()");
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/products?order=id&ordering=ASC');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();
        const productos = result.products.map(p => p.product);

        const contenedores = [
            document.getElementById("contenedor-productos-normal"),
            document.getElementById("contenedor-productos-lector"),
            document.getElementById("contenedor-productos-escritor")
        ];

        contenedores.forEach(contenedor => {
            if (!contenedor) return;
            contenedor.innerHTML = "";

            productos.forEach(p => {
                const div = document.createElement("div");
                div.className = "elemento-datos";
                div.innerHTML = `
          <img src="${p.imageUrl || 'img/default.jpg'}" alt="${p.name}" />
          <a href="producto.html" onclick="verProducto(${p.id})">${p.name}</a>
          ${contenedor.id.includes("escritor") ? `<button class="boton-eliminar" onclick="eliminarProducto(${p.id})">delete</button>` : ""}
        `;
                contenedor.appendChild(div);
            });
        });

    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        alert("No se pudieron cargar los productos. Revisa la consola.");
    }
}

// Eliminar
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
function verProducto(id) {
    localStorage.setItem("productoSeleccionado", id);
}

function verEntidad(id) {
    localStorage.setItem("entidadSeleccionada", id);
}

function verCientifico(id) {
    localStorage.setItem("cientificoSeleccionadoId", id);
}

if (performance.getEntriesByType("navigation")[0].type === "back_forward") {
    window.location.reload();
}


//cientificos con API
cargarCientificos();

//entidades con API
cargarEntidades();

//productos con API
cargarProductos();



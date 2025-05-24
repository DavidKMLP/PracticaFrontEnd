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
    const nombreUsuario = document.getElementById('nombre-usuario');

    if (userInfo && nombreUsuario) {
        nombreUsuario.textContent = usuario.username;
        userInfo.style.display = 'block';

        localStorage.setItem("usuarioUsername", usuario.username);

        nombreUsuario.addEventListener("click", () => {
            window.location.href = "usuario_informacion.html";
        });
    }

    //Gestion de usuarios
    const botonUsuarios = document.getElementById("boton-gestion-usuarios");
    if (usuario.rol === "writer") {
        botonUsuarios.style.display = "inline-block";
        botonUsuarios.onclick = () => {
            window.location.href = "gestion-usuarios.html";
        };
    } else {
        botonUsuarios.style.display = "none";
    }

    if (usuario.rol === 'reader') {
        document.getElementById('vista-lector').style.display = 'block';
        cargarProductos();
        cargarCientificos();
        cargarEntidades();
        cargarAsociaciones();
    } else if (usuario.rol === 'writer') {
        document.getElementById('vista-escritor').style.display = 'block';
        cargarProductos();
        cargarCientificos();
        cargarEntidades();
        cargarAsociaciones();
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

function restablecerVistaPorDefecto() {
    const ids = [
        "contenedor-productos-normal",
        "contenedor-productos-lector",
        "contenedor-productos-escritor",
        "contenedor-cientificos-normal",
        "contenedor-cientificos-lector",
        "contenedor-cientificos-escritor",
        "contenedor-entidades-normal",
        "contenedor-entidades-lector",
        "contenedor-entidades-escritor",
        "contenedor-entidades-lector",
        "contenedor-entidades-escritor",
    ];

    ids.forEach(id => {
        const contenedor = document.getElementById(id);
        if (contenedor) contenedor.innerHTML = "";
    });
}

// Cierre de sesión
document.getElementById('boton-cerrar-sesion').addEventListener('click', function () {
    //Restablecer vista a la de un usuario sin Registrar
    restablecerVistaPorDefecto();

    document.getElementById('vista-usuario-normal').style.display = 'block';
    document.getElementById('vista-lector').style.display = 'none';
    document.getElementById('vista-escritor').style.display = 'none';
    document.getElementById('formulario-inicio-sesion').style.display = 'flex';
    document.getElementById('boton-cerrar-sesion').style.display = 'none';
    document.getElementById('contenedor-logout').style.display = 'none';

    document.getElementById('usuario').value = '';
    document.getElementById('contrasena').value = '';

    document.getElementById('usuario-conectado').style.display = 'none';
    document.getElementById("boton-gestion-usuarios").style.display = "none";

    //borrar localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRol");

    document.getElementById("registro-link").style.display = "block";

    //Volver a cargar los elementos de la página
    cargarProductos();
    cargarCientificos();
    cargarEntidades();
    cargarAsociaciones();

});

// Renderizar cientificos dinámicamente con API
function renderizarListaCientificos(cientificos, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const token = localStorage.getItem("accessToken");
    const isAutenticado = !!token;

    cientificos.forEach(c => {
        const div = document.createElement("div");
        div.className = "elemento-datos";

        const nombre = isAutenticado
            ? `<a href="cientifico.html" onclick="verCientifico(${c.id})">${c.name}</a>`
            : `<span class="acceso-bloqueado" title="Inicia sesión para ver">${c.name}</span>`;

        div.innerHTML = `
            <img src="${c.imageUrl || 'img/default.jpg'}" alt="${c.name}" />
            ${nombre}
            ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarCientifico(${c.id})">delete</button>` : ""}
        `;
        contenedor.appendChild(div);
    });
}

// Renderizar productos dinámicamente con API
function renderizarListaProductos(productos, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const token = localStorage.getItem("accessToken");
    const isAutenticado = !!token;

    productos.forEach(p => {
        const div = document.createElement("div");
        div.className = "elemento-datos";

        const nombre = isAutenticado
            ? `<a href="producto.html" onclick="verProducto(${p.id})">${p.name}</a>`
            : `<span class="acceso-bloqueado" title="Inicia sesión para ver">${p.name}</span>`;

        div.innerHTML = `
            <img src="${p.imageUrl || 'img/default.jpg'}" alt="${p.name}" />
            ${nombre}
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

    const token = localStorage.getItem("accessToken");
    const isAutenticado = !!token;

    entidades.forEach(e => {
        const div = document.createElement("div");
        div.className = "elemento-datos";

        const nombre = isAutenticado
            ? `<a href="entidad.html" onclick="verEntidad(${e.id})">${e.name}</a>`
            : `<span class="acceso-bloqueado" title="Inicia sesión para ver">${e.name}</span>`;

        div.innerHTML = `
            <img src="${e.imageUrl || 'img/default.jpg'}" alt="${e.name}" />
            ${nombre}
            ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarEntidad(${e.id})">delete</button>` : ""}
        `;
        contenedor.appendChild(div);
    });
}

function renderizarListaAsociaciones(asociaciones, contenedorID, mostrarBotones = false) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const token = localStorage.getItem("accessToken");
    const isAutenticado = !!token;

    asociaciones.forEach(a => {
        const div = document.createElement("div");
        div.className = "elemento-datos";

        const nombre = isAutenticado
            ? `<a href="asociacion.html" onclick="verAsociacion(${a.id})">${a.name}</a>`
            : `<span class="acceso-bloqueado" title="Inicia sesión para ver">${a.name}</span>`;

        div.innerHTML = `
      <img src="${a.imageUrl || 'img/default.jpg'}" alt="${a.name}" />
      ${nombre}
      ${mostrarBotones ? `<button class="boton-eliminar" onclick="eliminarAsociacion(${a.id})">delete</button>` : ""}
    `;
        contenedor.appendChild(div);
    });
}


//Modificado para la implementacion de la API
async function cargarCientificos() {
    console.log("▶️ Ejecutando cargarCientificos()");

    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/persons');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        const cientificos = result.persons.map(p => p.person);

        renderizarListaCientificos(cientificos, "contenedor-cientificos-normal", false);
        renderizarListaCientificos(cientificos, "contenedor-cientificos-lector", false);
        renderizarListaCientificos(cientificos, "contenedor-cientificos-escritor", true);

    } catch (error) {
        console.error(" Error al cargar científicos:", error);
        alert("No se pudieron cargar los científicos. Revisa la consola.");
    }
}


// Modificado para la implementacion de la api
async function cargarEntidades() {
    console.log("▶️ Ejecutando cargarEntidades()");
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/entities?order=id&ordering=ASC');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        const entidades = result.entities.map(e => e.entity);

        renderizarListaEntidades(entidades, "contenedor-entidades-normal", false);
        renderizarListaEntidades(entidades, "contenedor-entidades-lector", false);
        renderizarListaEntidades(entidades, "contenedor-entidades-escritor", true);

    } catch (error) {
        console.error(" Error al cargar entidades:", error);
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

        renderizarListaProductos(productos, "contenedor-productos-normal", false);
        renderizarListaProductos(productos, "contenedor-productos-lector", false);
        renderizarListaProductos(productos, "contenedor-productos-escritor", true);

    } catch (error) {
        console.error(" Error al cargar productos:", error);
        alert("No se pudieron cargar los productos. Revisa la consola.");
    }
}

//Con implementacion API
async function cargarAsociaciones() {
    console.log("▶️ Ejecutando cargarAsociaciones()");
    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/asociaciones");
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const result = await response.json();
        const asociaciones = result.asociaciones.map(a => a.asociacion);

        renderizarListaAsociaciones(asociaciones, "contenedor-asociaciones-normal", false);
        renderizarListaAsociaciones(asociaciones, "contenedor-asociaciones-lector", false);
        renderizarListaAsociaciones(asociaciones, "contenedor-asociaciones-escritor", true);

    } catch (error) {
        console.error("❌ Error al cargar asociaciones:", error);
        alert("No se pudieron cargar las asociaciones. Revisa la consola.");
    }
}


// Eliminar
async function eliminarProducto(id) {
    const token = localStorage.getItem("accessToken");

    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Producto eliminado correctamente.");
            cargarProductos(); // volver a cargar la lista actualizada
        } catch (error) {
            alert("Error al eliminar el producto.");
            console.error(" Error en eliminarProducto:", error);
        }
    }
}

async function eliminarCientifico(id) {
    const token = localStorage.getItem("accessToken");

    if (confirm("¿Estás seguro de que quieres eliminar este científico?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/persons/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Científico eliminado correctamente.");
            cargarCientificos();
        } catch (error) {
            alert("Error al eliminar el científico.");
            console.error(" Error en eliminarCientifico:", error);
        }
    }
}

async function eliminarEntidad(id) {
    const token = localStorage.getItem("accessToken");

    if (confirm("¿Estás seguro de que quieres eliminar esta entidad?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/entities/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Entidad eliminada correctamente.");
            cargarEntidades();
        } catch (error) {
            alert("Error al eliminar la entidad.");
            console.error(" Error en eliminarEntidad:", error);
        }
    }
}

async function eliminarAsociacion(id) {
    const token = localStorage.getItem("accessToken");

    if (confirm("¿Estás seguro de que quieres eliminar esta asociación?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/asociaciones/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Asociación eliminada correctamente.");
            cargarAsociaciones();  // Recargar la lista tras la eliminación
        } catch (error) {
            alert("Error al eliminar la asociación.");
            console.error("❌ Error en eliminarAsociacion:", error);
        }
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

function verAsociacion(id) {
    localStorage.setItem("asociacionSeleccionada", id);
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

//asociaciones con API
cargarAsociaciones();



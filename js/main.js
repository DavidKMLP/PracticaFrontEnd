// Función para manejar el inicio de sesión
document.getElementById('formulario-inicio-sesion').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y recargue la página

    // Obtener los valores del usuario y contraseña
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    // Obtener las vistas
    const vistaUsuarioNormal = document.getElementById('vista-usuario-normal');
    const vistaLector = document.getElementById('vista-lector');
    const vistaEscritor = document.getElementById('vista-escritor');
    const formularioInicioSesion = document.getElementById('formulario-inicio-sesion');
    const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');

    // Verificar las credenciales
    if (usuario === '123' && contrasena === '123') {
        // Cambiar a la vista de lector
        vistaUsuarioNormal.style.display = 'none';
        vistaLector.style.display = 'block';
        vistaEscritor.style.display = 'none';
        formularioInicioSesion.style.display = 'none';
        botonCerrarSesion.style.display = 'inline-block';
    } else if (usuario === '456' && contrasena === '456') {
        // Cambiar a la vista de escritor
        vistaUsuarioNormal.style.display = 'none';
        vistaLector.style.display = 'none';
        vistaEscritor.style.display = 'block';a
        formularioInicioSesion.style.display = 'none';
        botonCerrarSesion.style.display = 'inline-block';
    } else {
        // Mostrar mensaje de error
        alert('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
});

// Función para manejar el cierre de sesión
document.getElementById('boton-cerrar-sesion').addEventListener('click', function() {
    // Obtener las vistas y elementos
    const vistaUsuarioNormal = document.getElementById('vista-usuario-normal');
    const vistaLector = document.getElementById('vista-lector');
    const vistaEscritor = document.getElementById('vista-escritor');
    const formularioInicioSesion = document.getElementById('formulario-inicio-sesion');
    const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');

    // Volver a la vista de usuario normal
    vistaUsuarioNormal.style.display = 'block';
    vistaLector.style.display = 'none';
    vistaEscritor.style.display = 'none';
    formularioInicioSesion.style.display = 'flex';
    botonCerrarSesion.style.display = 'none';

    // Limpiar los campos del formulario
    document.getElementById('usuario').value = '';
    document.getElementById('contrasena').value = '';
});
const usuarios = [
    { usuario: 'x', contrasena: 'x', rol: 'lector' },
    { usuario: 'y', contrasena: 'y', rol: 'lector' },
    { usuario: 'z', contrasena: 'z', rol: 'escritor' }
];

function mostrarVista(rol) {
    document.getElementById('vista-usuario-normal').style.display = 'none';
    document.getElementById('formulario-inicio-sesion').style.display = 'none';
    document.getElementById('contenedor-logout').style.display = 'flex';

    if (rol === 'lector') {
        document.getElementById('vista-lector').style.display = 'block';
        document.getElementById('vista-escritor').style.display = 'none';
    } else if (rol === 'escritor') {
        document.getElementById('vista-lector').style.display = 'none';
        document.getElementById('vista-escritor').style.display = 'block';
    }
}

function cerrarSesion() {
    document.getElementById('vista-usuario-normal').style.display = 'block';
    document.getElementById('vista-lector').style.display = 'none';
    document.getElementById('vista-escritor').style.display = 'none';
    document.getElementById('formulario-inicio-sesion').style.display = 'flex';
    document.getElementById('contenedor-logout').style.display = 'none';

    document.getElementById('usuario').value = '';
    document.getElementById('contrasena').value = '';
    localStorage.removeItem('usuarioActivo');
}

document.getElementById('formulario-inicio-sesion').addEventListener('submit', function(event) {
    event.preventDefault();

    const usuarioInput = document.getElementById('usuario').value.trim();
    const contrasenaInput = document.getElementById('contrasena').value.trim();

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuarioInput && u.contrasena === contrasenaInput);

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));
        mostrarVista(usuarioEncontrado.rol);
    } else {
        alert('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
});

document.getElementById('boton-cerrar-sesion').addEventListener('click', cerrarSesion);

window.addEventListener('DOMContentLoaded', () => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioGuardado) {
        mostrarVista(usuarioGuardado.rol);
    }
});

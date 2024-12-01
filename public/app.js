// Capturar el formulario y la tabla
const form = document.getElementById("song-form");
const songList = document.getElementById("song-list");

// Función para cargar canciones desde el backend
async function loadSongs() {
    const response = await fetch("/canciones");
    const songs = await response.json();

    // Limpiar la tabla
    songList.innerHTML = "";

    // Rellenar la tabla con las canciones
    songs.forEach((song, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${song.nombre}</td>
            <td>${song.artista}</td>
            <td>${song.tono}</td>
            <td>
                <button class="edit-btn" onclick="editSong(${song.id})">Editar</button>
                <button class="delete-btn" onclick="deleteSong(${song.id})">Eliminar</button>
            </td>
        `;
        songList.appendChild(row);
    });
}

// Función para agregar una canción
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newSong = {
        nombre: document.getElementById("song-name").value,
        artista: document.getElementById("artist-name").value,
        tono: document.getElementById("tone").value,
    };

    const response = await fetch("/canciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSong),
    });

    if (response.ok) {
        alert("Canción agregada exitosamente");
        form.reset();
        loadSongs();
    }
});

// Función para eliminar una canción
async function deleteSong(id) {
    const response = await fetch(`/canciones/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        alert("Canción eliminada");
        loadSongs();
    }
}

// Función para editar una canción (por simplicidad solo muestra un alert)
function editSong(id) {
    alert("Función de edición aún no implementada para el ID: " + id);
}

// Cargar las canciones al cargar la página
loadSongs();

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// Ruta GET para obtener las canciones
app.get("/canciones", (req, res) => {
    try {
        const data = fs.readFileSync("repertorio.json", "utf-8");
        const canciones = JSON.parse(data);
        res.json(canciones);
    } catch (error) {
        res.status(500).json({ error: "Error al leer el archivo de repertorio." });
    }
});

// Ruta POST para agregar una nueva canción
app.post("/canciones", (req, res) => {
    try {
        const { song, artist, tone } = req.body;

        if (!song || !artist || !tone) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        const data = fs.readFileSync("repertorio.json", "utf-8");
        const canciones = JSON.parse(data);

        const nuevaCancion = {
            id: canciones.length + 1,
            song,
            artist,
            tone
        };
        
        canciones.push(nuevaCancion);
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));

        res.json({ message: "Canción agregada correctamente", nuevaCancion });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la nueva canción." });
    }
});

// Ruta DELETE para eliminar una canción por su ID
app.delete("/canciones/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un número válido." });
        }

        const data = fs.readFileSync("repertorio.json", "utf-8");
        const canciones = JSON.parse(data);

        const cancionesFiltradas = canciones.filter(cancion => cancion.id !== id);

        if (cancionesFiltradas.length === canciones.length) {
            return res.status(404).json({ error: "La canción con el ID especificado no existe." });
        }

        fs.writeFileSync("repertorio.json", JSON.stringify(cancionesFiltradas, null, 2));
        res.json({ message: "Canción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la canción." });
    }
});

// Ruta PUT para editar una canción por su ID
app.put("/canciones/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { song, artist, tone } = req.body;

        if (isNaN(id) || !song || !artist || !tone) {
            return res.status(400).json({ error: "Datos inválidos o incompletos." });
        }

        const data = fs.readFileSync("repertorio.json", "utf-8");
        const canciones = JSON.parse(data);

        const index = canciones.findIndex(cancion => cancion.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "La canción con el ID especificado no existe." });
        }

        canciones[index] = { id, song, artist, tone };
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));

        res.json({ message: "Canción actualizada correctamente", cancion: canciones[index] });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la canción." });
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

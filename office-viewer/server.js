import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para actualizar el archivo offices.json
app.post('/update-office', (req, res) => {
    const { officeCode, isDone } = req.body;

    const filePath = path.resolve('src/data/offices.json');

    // Leer el archivo offices.json
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo el archivo:', err);
            return res.status(500).json({ error: 'Error leyendo el archivo' });
        }

        try {
            const offices = JSON.parse(data);

            // Actualizar el estado de la oficina
            const updatedOffices = offices.map((office) =>
                office["cod. oficina"] === officeCode ? { ...office, is_done: isDone } : office
            );

            // Guardar el archivo actualizado
            fs.writeFile(filePath, JSON.stringify(updatedOffices, null, 2), (err) => {
                if (err) {
                    console.error('Error escribiendo el archivo:', err);
                    return res.status(500).json({ error: 'Error escribiendo el archivo' });
                }
                res.json({ success: true, updatedOffices });
            });
        } catch (parseError) {
            console.error('Error parseando el archivo:', parseError);
            res.status(500).json({ error: 'Error parseando el archivo' });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

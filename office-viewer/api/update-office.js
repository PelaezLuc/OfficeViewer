let officesData = []; // Datos en memoria

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { officeCode, isDone } = req.body;

    try {
        // Cargar los datos desde el archivo offices.json solo una vez
        if (officesData.length === 0) {
            const filePath = path.join(process.cwd(), 'data', 'offices.json');
            const data = fs.readFileSync(filePath, 'utf8');
            officesData = JSON.parse(data);
        }

        // Actualizar el estado de la oficina
        officesData = officesData.map((office) =>
            office["cod. oficina"] === officeCode ? { ...office, is_done: isDone } : office
        );

        console.log('Datos actualizados:', officesData);

        res.status(200).json({ success: true, updatedOffices: officesData });
    } catch (error) {
        console.error('Error actualizando el archivo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

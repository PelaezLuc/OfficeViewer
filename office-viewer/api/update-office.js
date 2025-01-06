import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { officeCode, isDone } = req.body;
    const filePath = path.join(process.cwd(), './data/offices.json'); // Ruta relativa al archivo

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo el archivo:', err);
            res.status(500).json({ error: 'Error leyendo el archivo' });
            return;
        }

        try {
            const offices = JSON.parse(data);

            const updatedOffices = offices.map((office) =>
                office["cod. oficina"] === officeCode ? { ...office, is_done: isDone } : office
            );

            fs.writeFile(filePath, JSON.stringify(updatedOffices, null, 2), (err) => {
                if (err) {
                    console.error('Error escribiendo el archivo:', err);
                    res.status(500).json({ error: 'Error escribiendo el archivo' });
                } else {
                    res.status(200).json({ success: true, updatedOffices });
                }
            });
        } catch (parseError) {
            console.error('Error parseando el archivo:', parseError);
            res.status(500).json({ error: 'Error parseando el archivo' });
        }
    });
}

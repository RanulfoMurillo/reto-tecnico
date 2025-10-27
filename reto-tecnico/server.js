import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3000;

// servir front-end 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Exttraemos campos solicittados
const mapUser = (u) => ({
    nombre: `${u.name.first} ${u.name.last}`,
    genero: u.gender,
    ubicacion: `${u.location.city}, ${u.location.country}`,
    correo: u.email,
    fecha_nacimiento: new Date(u.dob.date).toISOString().slice(0, 10),
    fotografia: u.picture.large
});

// API: GET /api/people?results=N
app.get("/api/people", async (req, res) => {
    let n = Number(req.query.results) || 10;
    n = Math.max(n, 1);
    n = Math.min(n, 10);
    try {
        const r = await fetch(`https://randomuser.me/api/?results=${n}`);
        if (!r.ok) throw new Error(`RandomUser status ${r.status}`);
        const data = await r.json();
        res.json({
            total: data.results.length,
            people: data.results.map(mapUser)
        });
    } catch (e) {
        res.status(502).json({ error: "No se pudo obtener datos", detalle: String(e) });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor listo: http://localhost:${PORT}`);
    console.log(`Endpoint API:  http://localhost:${PORT}/api/people?results=10`);
});

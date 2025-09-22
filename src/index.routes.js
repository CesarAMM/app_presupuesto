import { Router } from 'express';
const router = Router();
router.get('/ingreso_operaciones', (req, res) => {
    res.render("operaciones.html", {
        title: "Ingreso de Operaciones",
        user: "cemamo"
    });
});
router.get('/reporte', (req, res) => {
    res.render("reporte.html", { title: "Reporte de Operaciones" });
});
router.get('/presupuesto', async (req, res) => {
    res.render("presupuesto.html", { title: "Ingreso de Presupuesto" });
});
router.get('/', (req, res) => {
    res.render("index.html", { title: "App Presupuesto" });
});
export default router;

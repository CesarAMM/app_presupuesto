import express from "express";
import ejs from 'ejs';
import bodyParser from "body-parser";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
//! RUTAS
import router_index from './routes/index.routes.js';
import router_operacion from './routes/operacion.routes.js';
import router_reporte from './routes/reporte.routes.js';
import router_presupuesto from './routes/presupuesto.routes.js';
import router_general from './routes/general.routes.js';
//! CONFIGURACIONES CONSTANTES
dotenv.config();
const app = express();
const __dirname = path.dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = process.env.PORT || 8030;
//! MIDELWERS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 100000000000 }));
//! RUTAS DE LA APLICACION
app.use(router_index);
app.use(router_operacion);
app.use(router_reporte);
app.use(router_presupuesto);
app.use(router_general);
//! CONSTANTES
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')));
app.use(express.static(path.join(__dirname, '../node_modules/@popperjs/core/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/popper.js/dist')));
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

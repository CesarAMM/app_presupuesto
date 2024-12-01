import express from "express";
import ejs from 'ejs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url'

//! RUTAS
import router_index from './routes/index.routes.js'
import router_operacion from './routes/operacion.routes.js'

//! CONFIGURACIONES CONSTANTES
import {PORT} from './config.js';


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))

//! MIDELWERS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(express.json());

//! RUTAS DE LA APLICACION
app.use(router_index)
app.use(router_operacion)

//! CONSTANTES
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')))
app.use(express.static(path.join(__dirname, '../node_modules/@popperjs/core/dist')))
app.use(express.static(path.join(__dirname, '../node_modules/popper.js/dist')))


app.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`)
})
const express = require('express');
const app = express();
const crypto = require('node:crypto')
//const cors = require('cors')
const PORT = process.env.PORT ?? 8080
const router_presupuesto = require('./routes/presupuesto.routes')

app.disable('x-powered-by')
app.use(express.json())

/*
app.use(cors({
  origin: (origin, callback)=>{
    const LIST_ORIGINS = []

    if (LIST_ORIGINS.includes(origin)){}
  }

}))
  */
 
app.get('/', (req, res) => {
  res.json({messanje: 'App Presupuesto'})
});

app.use(router_presupuesto)

app.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`)
})
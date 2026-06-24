import React, {useState, useEffect, use} from 'react';
import { Card, Form, Button, Table, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import {api} from '../services/api';

interface Item{
  id: string;
  descripcion: string;
}

interface ItemPresupuesto {
  idLocal: number;
  tipoOperacion: Item;
  frecuencia: Item;
  categoria: Item;
  subCategoria: Item;
  monto: number;
}


export default function Presupuesto() {
  //  --- CONSULTA GENERAL 
  const [lstDivisionOperaciones, setLstDivisionOperaciones] = useState<any[]>([]); 
  const [mensaje, setMensaje] = useState<{tipo: string; texto: string} | null>(null);
  const [cargandoCatalogos, setCargaCatalogos] = useState(false);
  
  // -- ESTADOS DE LOS ELEMENTOS INDIVIDUALES
  const [monto, setMonto] = useState(''); 
  const [tipoOperacion, setTipoOperacion] = useState<Item | null >(null);
  const [frecuencia, setFrecuencia] = useState<Item | null >(null);
  const [categoria, setCategoria] = useState<Item | null >(null);
  const [subCategoria, setSubCategoria] = useState<Item | null >(null);
  
  // -- ESTADOS DE LOS ARREGLOS
  const [matrizPresupuesto, setMatrizPresupuesto] = useState<ItemPresupuesto[]>([]);
  
  // --- CONSULTAR EN LA BASE DE DATOS
  const [dbCategorias, setDBCategorias] = useState<any[]>([]);
  const [dbTipoOeracion, setDBTipoOperacion] = useState<any[]>([]);
  const [dbSubCategoria, setDBSubCategoria] = useState<any[]>([]);

  // --- BOTON 1: "GUARDAR" (Traslado de informacion a la matriz local) ---
  const handleAgregar = (e: React.FormEvent)=> {
    e.preventDefault();

    if(!tipoOperacion || !frecuencia || !categoria || !subCategoria || !monto){
      alert("Por fabor completa todos los campos obligatorios.")
      return;
    }

    const nuevoItem: ItemPresupuesto = {
      idLocal: Date.now(),
      tipoOperacion,
      frecuencia,
      categoria,
      subCategoria,
      monto: parseFloat(monto)
    }

    // Agregamos a la matriz global en memoria
    setMatrizPresupuesto([...matrizPresupuesto, nuevoItem]);

    // Limpiar el formulario
    setTipoOperacion(null);
    setFrecuencia(null);
    setCategoria(null);
    setSubCategoria(null);
    setMonto('');

    setMensaje({ tipo: 'success', texto: 'Registro trasladado a la matriz.'})
    setTimeout(() => setMensaje(null), 3000)
  }

  //    --- BOTON 2: "TRANSMITIR" (Enviar matriz completa obigatorios + opcionales)
  const handleTransmitir = async () => {
    if(matrizPresupuesto.length === 0){
      alert('La matriz está vacía.')
      return
    }

    try{
      const respuesta = await api.post('/presupuesto/guardar-matriz', {registros: matrizPresupuesto})
      setMensaje({ tipo: 'primary', texto: 'Datos se han guardado' })
      setMatrizPresupuesto([]);
    } catch(error){
      console.log(error);
      setMensaje({ tipo: 'danger', texto: 'Error al conectar a la api' })
    }
  }

  const isNull = (valor: string | null | undefined): boolean =>{
    if (!valor) return true;
    if (valor === "null" || valor === "undefined") return true;
    if (valor.trim() === "") return true;
    return false
  }

  useEffect(()  => {
    const obtenerCatalogo = async () => {
      setCargaCatalogos(true);
      try {
        const respuesta = await api.get('/metadata/clasificacion_gasto');
        if(respuesta.data.ok){

          const lstTipoOperaciones = respuesta.data.data.filter((dato: any) => isNull(dato.padre))
          const lstCategoria = respuesta.data.data.filter((dato: any) => dato.clasificacion.length === 3)

          setDBTipoOperacion(lstTipoOperaciones)
          setDBCategorias(lstCategoria)

          setLstDivisionOperaciones(respuesta.data.data);
          
        }
      } catch (error) {
        console.log(error)
      } finally{
        setCargaCatalogos(false);
      }
    }
    obtenerCatalogo();
  }, []);

  const fnTipoOperacion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idTipoOperacion = e.target.value;
    const strTipoOperacion = lstDivisionOperaciones.find((dato:any) => dato.clasificacion === idTipoOperacion)
    
    const tmpCategoria = lstDivisionOperaciones.filter((dato: any) => dato.padre === idTipoOperacion)
    setDBCategorias(tmpCategoria)
    setTipoOperacion({id: strTipoOperacion.clasificacion, descripcion: strTipoOperacion.valor})
  }

  const fnClasificacion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idCategoria = e.target.value;
    const strCategoria = lstDivisionOperaciones.find((dato: any) => dato.clasificacion === idCategoria);
    const tmpSubCategoria = lstDivisionOperaciones.filter((data: any)=> data.padre === idCategoria);

    setDBSubCategoria(tmpSubCategoria);
    setCategoria(strCategoria.valor)
  }

  return (
    <div className="container mt-2 mb-5">
      {mensaje && (
        <Alert variant={mensaje.tipo} onClose={() => setMensaje(null)} dismissible>
          {mensaje.texto}
        </Alert>
      )}

      <Row>
        {/* ================= FORMULARIO DE INGRESO ================= */}
        <Col md={5}>
          <Card className="shadow-sm border-0 bg-white p-4">
            <h4 className="text-primary mb-4">Ingreso de Presupuesto</h4>
            <Form onSubmit={handleAgregar}>
              
              <Form.Group className="mb-3">
                <Form.Label>Tipo Operación <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  onChange={fnTipoOperacion} 
                  disabled={cargandoCatalogos}
                  required>
                  <option value="">-- Selecciona --</option>
                  {/* Aquí React "dibuja" las opciones desde la Base de Datos */}
                  {dbTipoOeracion.map((item) => (
                    <option key={item.clasificacion} value={item.clasificacion}>
                      {item.clasificacion} {item.valor}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Frecuencia <span className="text-danger">*</span></Form.Label>
                <Form.Select value={frecuencia?.id} onChange={(e) => setFrecuencia({id: e.target.value, descripcion: ""})} required>
                  <option value="">-- Selecciona --</option>
                  <option value="1">FIJO</option>
                  <option value="2">VARIABLE</option>
                  <option value="3">OCACIONAL</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Clasificación <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  onChange={fnClasificacion}
                  disabled={cargandoCatalogos}
                  required 
                >
                <option value="">--SELECCIONE UNA OPCION--</option>
                {/* Aquí React "dibuja" las opciones desde la Base de Datos */}
                  {dbCategorias.map((item) => (
                    <option key={item.clasificacion} value={item.clasificacion}>
                      {item.clasificacion} {item.valor}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sub-Clasificación <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  onChange = {(e) => setSubCategoria({id: e.target.value, descripcion: ""})}
                  disabled = {cargandoCatalogos}
                  required 
                >

                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Monto <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <InputGroup.Text>Q</InputGroup.Text>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={monto} 
                    onChange={(e) => setMonto(e.target.value)}
                    required 
                  />
                </InputGroup>
              </Form.Group>

              {/* BOTÓN 1 */}
              <Button variant="success" type="submit" className="w-100 fw-bold">
                Guardar
              </Button>
            </Form>
          </Card>
        </Col>

        {/* ================= MATRIZ VISUAL (VISTA OBLIGATORIA) ================= */}
        <Col md={7}>
          <Card className="shadow-sm border-0 bg-white p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-secondary m-0">Matriz de Planificación Mensual</h4>
                <span className="badge bg-primary fs-6">{matrizPresupuesto.length} Filas</span>
              </div>

              <div className="table-responsive" style={{ maxHeight: '400px' }}>
                <Table striped bordered hover className="align-middle text-center small">
                  <thead className="table-dark">
                    <tr>
                      <th>Tipo</th>
                      <th>Frecuencia</th>
                      <th>Clasificación</th>
                      <th>SubClasificación</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrizPresupuesto.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-muted py-4">
                          No hay registros en la matriz. Llena el formulario de la izquierda y haz clic en Guardar.
                        </td>
                      </tr>
                    ) : (
                      matrizPresupuesto.map((item) => (
                        <tr key={item.idLocal}>
                          <td className={item.tipoOperacion.id === '1' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                            {item.tipoOperacion.descripcion}
                          </td>
                          <td>{item.frecuencia.descripcion}</td>
                          <td>{item.categoria.descripcion}</td>
                          <td>
                            {item.subCategoria.descripcion}
                          </td>
                          <td className="fw-bold">Q {item.monto.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* BOTÓN 2 */}
            {matrizPresupuesto.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <Button variant="primary" className="w-100 py-2 fw-bold fs-5 shadow-sm" onClick={handleTransmitir}>
                  💾 GUARDAR TODO EN BASE DE DATOS
                </Button>
                <p className="text-center text-muted small mt-2 mb-0">
                  * Esto guardará los campos obligatorios junto con todas las subdivisiones extras de la matriz.
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
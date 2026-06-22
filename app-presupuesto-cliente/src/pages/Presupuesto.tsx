import React, {useState, useEffect} from 'react';
import { Card, Form, Button, Table, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import {api} from '../services/api';

interface ItemPresupuesto {
  idLocal: number;
  tipoOperacion: string;
  frecuencia: string;
  clasificacion: string;
  subClasificacion: string;
  divisionClasificacion: string[];
  monto: number;
}

interface ItemClasificacion {
  clasificacion: string;
  estado: number;
  padre: string | null;
  valor: string;
}

export default function Presupuesto() {
  // -- ESTADOS --
  const [tipoOperacion, setTipoOperacion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [clasificacion, setClasificacion] = useState('');
  const [subClasificacion, setSubClasificacion] = useState('');
  const [monto, setMonto] = useState('');
  const [divisionClasificacion, setDivisionClasificacion] = useState<string[]>(['']);
  const [matrizPresupuesto, setMatrizPresupuesto] = useState<ItemPresupuesto[]>([]);
  const [mensaje, setMensaje] = useState<{tipo: string; texto: string} | null>(null);
  const [catalogoClasificacion, setCatalogoClasificacion] = useState<any[]>([]);
  const [cargandoCatalogos, setCargaCatalogos] = useState(false);
  
  // --- CONSULTAR
  const [dbCategorias, setDBCategorias] = useState<any[]>([]);

  //  --- MANEJO DE CAMPOS DINAMICOS AUTIMATICOS --
  const handleDivisionClasificacion = (index: number, valor: string) => {
    const nuevasDivisiones = [...divisionClasificacion];
    nuevasDivisiones[index] = valor;
    
    if(index === nuevasDivisiones.length -1 && valor.trim() !== ''){
      nuevasDivisiones.push('');
    }

    if(valor.trim() === '' && index < nuevasDivisiones.length - 1 && nuevasDivisiones.length > 1){
      nuevasDivisiones.splice(index, 1);
    }

    setDivisionClasificacion(nuevasDivisiones);
  }

  // --- BOTON 1: "GUARDAR" (Traslado de informacion a la matriz local) ---
  const handleAgregar = (e: React.FormEvent)=> {
    e.preventDefault();

    if(!tipoOperacion || !frecuencia || !clasificacion || !subClasificacion || !monto){
      alert("Por fabor completa todos los campos obligatorios.")
      return;
    }

    const extrasLimpias = divisionClasificacion.filter(div => div.trim() !== '');

    const nuevoItem: ItemPresupuesto = {
      idLocal: Date.now(),
      tipoOperacion,
      frecuencia,
      clasificacion,
      subClasificacion,
      divisionClasificacion: extrasLimpias,
      monto: parseFloat(monto)
    }

    // Agregamos a la matriz global en memoria
    setMatrizPresupuesto([...matrizPresupuesto, nuevoItem]);

    // Limpiar el formulario
    setTipoOperacion('');
    setFrecuencia('');
    setClasificacion('');
    setSubClasificacion('');
    setMonto('');
    setDivisionClasificacion(['']);

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

  
  
  useEffect(()  => {
    const obtenerCatalogo = async () => {
      setCargaCatalogos(true);
      try {
        const respuesta = await api.get('/metadata/clasificacion_gasto');
        if(respuesta.data.ok){
          setDBCategorias(respuesta.data.data)
        }
      } catch (error) {
        console.log(error)
      } finally{
        setCargaCatalogos(false);
      }
    }
    obtenerCatalogo();
  }, []);


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
                <Form.Select value={tipoOperacion} onChange={(e) => setTipoOperacion(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Frecuencia <span className="text-danger">*</span></Form.Label>
                <Form.Select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  <option value="Fijo">Fijo</option>
                  <option value="Variable">Variable</option>
                  <option value="Ocasional">Ocasional</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Clasificación <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  onChange={(e) => {setClasificacion(e.target.value)}}
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
                <Form.Control 
                  type="text" 
                  placeholder="Ej: Combustible, Supermercado" 
                  value={subClasificacion} 
                  onChange={(e) => setSubClasificacion(e.target.value)}
                  required 
                />
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

              {/* === SECCIÓN DINÁMICA AUTOMÁTICA === */}
              <div className="bg-light p-3 rounded mb-4">
                <Form.Label className="text-muted fw-bold small">
                  ⚙️ Subdivisiones / Categorías Adicionales (Opcional)
                </Form.Label>
                <p className="text-muted text-xs style={{fontSize: '11px'}} mb-2">
                  * Al escribir en el último campo, aparecerá otro espacio automáticamente.
                </p>
                {divisionClasificacion.map((division, index) => (
                  <Form.Group key={index} className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder={`Otra división (Nivel ${index + 3})`}
                      value={division}
                      onChange={(e) => handleDivisionClasificacion(index, e.target.value)}
                    />
                  </Form.Group>
                ))}
              </div>

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
                          <td className={item.tipoOperacion === 'Ingreso' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                            {item.tipoOperacion}
                          </td>
                          <td>{item.frecuencia}</td>
                          <td>{item.clasificacion}</td>
                          <td>
                            {item.subClasificacion}
                            {/* Breve indicador visual por si tiene campos ocultos almacenados */}
                            {item.divisionClasificacion.length > 0 && (
                              <div className="text-muted" style={{ fontSize: '10px' }}>
                                (+{item.divisionClasificacion.length} subniveles en matriz)
                              </div>
                            )}
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
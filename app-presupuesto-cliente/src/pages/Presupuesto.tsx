import React, {useState, useEffect, useMemo, act} from 'react';
import { Card, Form, Button, Table, Row, Col, InputGroup, Alert, Modal} from 'react-bootstrap';
import {api} from '../services/api';
import type {Item, ItemPresupuesto, FormularioPresupuesto} from '../interface/presupuesto'


export default function Presupuesto() {
  const estadoInicialFormulario: FormularioPresupuesto = {
      monto: '',
      tipoOperacion: null,
      frecuencia: null,
      categoria: null,
      subCategoria: null,
    };
  const [formulario, setFormulario] = useState(estadoInicialFormulario)

  //  --- CONSULTA GENERAL 
  const [lstDivisionOperaciones, setLstDivisionOperaciones] = useState<any[]>([]); 
  const [mensaje, setMensaje] = useState<{tipo: string; texto: string} | null>(null);
  const [cargandoCatalogos, setCargaCatalogos] = useState(false);
  const [isShowModalTree, setIsShowModalTree] = useState(false);
  
  // -- ESTADOS DE LOS ELEMENTOS INDIVIDUALES
  const [fechaIni, setFechaIni] = useState('');
  const [fechaFin, setFechaFin] = useState(''); 
  // -- ESTADOS DE LOS ARREGLOS
  const [matrizPresupuesto, setMatrizPresupuesto] = useState<ItemPresupuesto[]>([]);
  
  // --- CONSULTAR EN LA BASE DE DATOS
  const [dbCategorias, setDBCategorias] = useState<any[]>([]);
  const [dbTipoOeracion, setDBTipoOperacion] = useState<any[]>([]);
  
  const {TotalIngresos, TotalEgresos, TotalNeto } = useMemo(()=>{
    const ingreso = matrizPresupuesto
      .filter( item => item.tipoOperacion.id === '1')
      .reduce((acc, item) => acc + item.monto, 0)
    
    const egreso = matrizPresupuesto
      .filter( item => item.tipoOperacion.id === '2')
      .reduce((acc, item) => acc + item.monto, 0)
    
    return {
      TotalIngresos: ingreso,
      TotalEgresos: egreso,
      TotalNeto: ingreso- egreso
    }
  }, [matrizPresupuesto])
  
  
  // --- BOTON 1: "GUARDAR" (Traslado de informacion a la matriz local) ---
  const handleAgregar = (e: React.FormEvent)=> {
    e.preventDefault();

    if(!formulario.tipoOperacion || !formulario.categoria || !formulario.frecuencia || !formulario.subCategoria || !formulario.monto){
      alert("Por fabor completa todos los campos obligatorios.")
      return;
    }

    const nuevoItem: ItemPresupuesto = {
      idLocal: Date.now(),
      tipoOperacion: formulario.tipoOperacion,
      frecuencia: formulario.frecuencia,
      categoria: formulario.categoria,
      subCategoria: formulario.subCategoria,
      monto: parseFloat(formulario.monto)
    }

    // Agregamos a la matriz global en memoria
    setMatrizPresupuesto([...matrizPresupuesto, nuevoItem]);

    // Limpiar el formulario
    setFormulario(estadoInicialFormulario);
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

      const respuesta = await api.post('/presupuesto/ingresar_presupuesto', {
        presupuesto: {
          fechaInicio: fechaIni,
          fechaFin: fechaFin,
          totalIngreso: TotalEgresos,
          totalEgreso: TotalIngresos,
          total: TotalNeto
        },
        detalle: matrizPresupuesto
      })
      if(!respuesta.data.ok){
        setMensaje({ tipo: 'danger', texto: respuesta.data.mensaje })
        return;
      }
      setMensaje({ tipo: 'primary', texto: 'Datos se han guardado' })
      setMatrizPresupuesto([]);

    } catch(error){
      console.log(error);
      setMensaje({ tipo: 'danger', texto: 'Error al conectar a la api' })
    }
  }
  
  // Funcion para actualizar el formulario sin perder datos 
  const actualizarCampo = (campo: string, valor: Item | number | null) =>{
    setFormulario((estadoPrevio) => ({...estadoPrevio, [campo]: valor}))
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

  const createTree = (nodoPadre: string): any[] =>{
    return lstDivisionOperaciones
      .filter(item => item.padre === nodoPadre)
      .map(item => ({
        ...item,
        hijos: createTree(item.clasificacion)
      }));
  }

  const branchTree = formulario.categoria ? createTree(formulario.categoria.id) : [];

  const NodoArbolVisual = ({ nodo, nivel = 0 }: { nodo: any; nivel: number }) => {
    const esHoja = !nodo.hijos || nodo.hijos.length === 0;
    return (
      <div style={{ marginLeft: `${nivel * 25}px` }} className="mb-2">
        <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light hover-shadow-sm border-start border-primary border-3">
          <div>
            <span className="me-2">{nivel === 0 ? '📁' : '📄'}</span>
            <strong>{nodo.valor}</strong> 
            <span className="text-muted small ms-2">({nodo.clasificacion})</span>
          </div>
          {esHoja ? (
            <Button 
              variant="outline-success" 
              size="sm" 
              className="py-0 px-2 text-xs"
              onClick={() => {
                actualizarCampo("subCategoria", {id: nodo.clasificacion, descripcion: nodo.valor})
                setIsShowModalTree(false);
              }}
            >
              Seleccionar
            </Button>
          ) : (
            // Si es un nodo padre (rama), mostramos un indicador en lugar del botón
            <span className="badge bg-secondary bg-opacity-50 text-dark border small">
              Contiene divisiones ↓
            </span>
          )}
        </div>
        
        {/* Si este nodo tiene sub-subcategorías (hijos), las dibuja llamándose a sí mismo */}
        {nodo.hijos && nodo.hijos.length > 0 && (
          <div className="mt-2 border-start border-light-subtle ps-2">
            {nodo.hijos.map((hijo: any) => (
              <NodoArbolVisual key={hijo.clasificacion} nodo={hijo} nivel={nivel + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-2 mb-5">
      {mensaje && (
        <Alert variant={mensaje.tipo} onClose={() => setMensaje(null)} dismissible>
          {mensaje.texto}
        </Alert>
      )}
      {/* ================= FORMULARIO DE DATOS GENERALES ================= */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0 bg-white p-4">
            <h4 className="text-primary mb-4 border-b pb-2">Encabezado y Balance del Presupuesto</h4>
            
            <Row className="align-items-center">
              {/* --- Campo: Fecha Inicio --- */}
              <Col md={3} sm={6} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Fecha Inicio <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="date" 
                    value={fechaIni} 
                    onChange={(e) => setFechaIni(e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>

              {/* --- Campo: Fecha Fin --- */}
              <Col md={3} sm={6} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Fecha Fin <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="date" 
                    value={fechaFin} 
                    onChange={(e) => setFechaFin(e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>

              {/* --- Campo: Total de Ingresos --- */}
              <Col md={2} xs={4} className="text-center border-start border-light">
                <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: '11px' }}>Total Ingresos</div>
                <div className="fs-4 fw-bold text-success mt-1">
                  Q {TotalIngresos.toFixed(2)}
                </div>
              </Col>

              {/* --- Campo: Total de Egresos --- */}
              <Col md={2} xs={4} className="text-center border-start border-light">
                <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: '11px' }}>Total Egresos</div>
                <div className="fs-4 fw-bold text-danger mt-1">
                  Q {TotalEgresos.toFixed(2)}
                </div>
              </Col>

              {/* --- Campo: Total Neto (Balance) --- */}
              <Col md={2} xs={4} className="text-center border-start border-light">
                <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: '11px' }}>Total Neto</div>
                {/* 🎨 Condición de color: Si el total es negativo se pinta rojo, si es positivo azul */}
                <div className={`fs-4 fw-bold mt-1 ${TotalNeto >= 0 ? 'text-primary' : 'text-danger'}`}>
                  Q {TotalNeto.toFixed(2)}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* ================= FORMULARIO DE INGRESO ================= */}
      <Row>
        <Col md={5}>
          <Card className="shadow-sm border-0 bg-white p-4">
            <h4 className="text-primary mb-4">Ingreso de Presupuesto</h4>
            <Form onSubmit={handleAgregar}>
              
              <Form.Group className="mb-3">
                <Form.Label>Tipo Operación <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formulario.tipoOperacion?.id ? formulario.tipoOperacion?.id : ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    const texto = e.target.options[e.target.selectedIndex].text;
                    
                    const tmpCategoria = lstDivisionOperaciones.filter((dato: any) => dato.padre === id)
                    setDBCategorias(tmpCategoria)
    
                    actualizarCampo('tipoOperacion', id ? {id, descripcion: texto} : null);
                    actualizarCampo('categoria', null);
                    actualizarCampo('subCategoria', null);
                  }} 
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
                <Form.Select 
                  value={formulario.frecuencia?.id  || ""} 
                  onChange={(e) =>{
                    const id = e.target.value;
                    const descripcion = e.target.options[e.target.selectedIndex].text;

                    actualizarCampo('frecuencia', id ? { id, descripcion } : null);
                  }} 
                  required>
                  <option value="">-- Selecciona --</option>
                  <option value="1">FIJO</option>
                  <option value="2">VARIABLE</option>
                  <option value="3">OCACIONAL</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Categoria <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  value={formulario.categoria?.id || ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    const descripcion = e.target.options[e.target.selectedIndex].text;

                    actualizarCampo('categoria', id ? { id, descripcion } : null);
                    actualizarCampo('subCategoria', null);
                  }}
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

              <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Sub-Categoría / Detalles</Form.Label>
            <div className="p-3 border rounded bg-light d-flex justify-content-between align-items-center">
              <div>
                {formulario.subCategoria ? (
                  <span className="text-success fw-bold">✅{formulario.subCategoria.id} - {formulario.subCategoria.descripcion}</span>
                ) : (
                  <span className="text-muted small">Ninguna seleccionada</span>
                )}
              </div>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsShowModalTree(true)}
                disabled={!formulario.categoria} // Bloqueado hasta que elija la categoría principal
              >
              Explorar Árbol
              </Button>
            </div>
            {!formulario.categoria && formulario.tipoOperacion && (
              <Form.Text className="text-warning text-xs">
                * Elige una Categoría Principal para activar el explorador.
              </Form.Text>
            )}
          </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Monto <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <InputGroup.Text>Q</InputGroup.Text>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={formulario.monto} 
                    onChange={(e) => actualizarCampo("monto", Number(e.target.value))}
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
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal 
        show={isShowModalTree} 
        onHide={() => setIsShowModalTree(false)} 
        centered 
        scrollable
        size="lg"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            🌿 Explorador de Subcategorías ({formulario.tipoOperacion?.descripcion} ➡️ {formulario.categoria?.descripcion})
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="bg-white py-4">
          <Alert variant="info" className="py-2 small">
            Navega en la estructura jerárquica y presiona <strong>Seleccionar</strong> en el nivel detallado que corresponda a tu registro.
          </Alert>

          <div className="pe-2" style={{ minHeight: '200px' }}>
            {branchTree.length === 0 ? (
              <div className="text-center text-muted my-5">
                🚫 Esta categoría principal no cuenta con subcategorías registradas en la base de datos.
              </div>
            ) : (
              // Iteramos las subcategorías del primer nivel, el componente se encargará de buscar el resto
              branchTree.map((nodoHijo) => (
                <NodoArbolVisual key={nodoHijo.clasificacion} nodo={nodoHijo} nivel={0} />
              ))
            )}
          </div>
        </Modal.Body>
        
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setIsShowModalTree(false)}>
            Cerrar Explorador
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
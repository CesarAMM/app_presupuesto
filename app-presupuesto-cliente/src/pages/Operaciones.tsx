import React, { useState, useMemo, useEffect} from 'react';
import { Card, Form, Button, Table, Row, Col, InputGroup, Alert, Modal } from 'react-bootstrap';
import type { Operacion, DetalleCompra } from '../interface/operacion';
import { api } from '../services/api';

export default function Operaciones() {
  // --- Estados Principales ---
  const estadoInicialForm = {
    fechaOperacion: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    tipoOperacion: null,
    frecuencia: null,
    categoria: null,
    subCategoria: null,
    cuenta: null,
    monto: '',
    descripcion: '',
  };

  const [formulario, setFormulario] = useState<Operacion>(estadoInicialForm);
  const [matrizDetalleCompra, setMatrizDetalleCompra] = useState<DetalleCompra[]>([]);
  const [status, setStatus] = useState<{ tipo: string; texto: string } | null>(null);

  // --- Estados del Formulario del Ítem de Factura (Detalle) ---
  const [itemProducto, setItemProducto] = useState('');
  const [itemCosto, setItemCosto] = useState('');
  const [itemUnidad, setItemUnidad] = useState('');
  const [itemCantidad, setItemCantidad] = useState('');
  const [stateCatalogo, setStateCatalogo] = useState(true);
  const [isShowModalTree, setIsShowModalTree] = useState(false);

  const [mtrClasificacion, setMtrClasificacion] = useState<any[]>([])
  
  const [dbCuentas, setDbCuentas] = useState<any[]>([])
  const [dbFrecuencia, setDbFrecuencia] = useState<any[]>([])
  const [dbCategoria, setDbCategoria] = useState<any[]>([])
  const [dbTipoOperacion, setDbTipoOperacion] = useState<any[]>([])

  // --- EVALUACIÓN DE REGLA DE NEGOCIO ---
  // Detecta si la subcategoría requiere desglose de factura (Ej: 'SUPER' o código '26001')
  const requiereDetalleCompra = useMemo(() => {
    const idSubCategoriaSel = formulario.subCategoria?.id
    const detalle_gasto = mtrClasificacion.find(p => p.clasificacion === idSubCategoriaSel)
    if (!detalle_gasto){
      return false
    }
    return  detalle_gasto.detalle_gasto === 'S';
  }, [formulario.subCategoria]);

  // --- CÁLCULO AUTOMÁTICO DE TOTAL FACTURA (`useMemo`) ---
  const totalFacturaCalculado = useMemo(() => {
    return matrizDetalleCompra.reduce((acc, row) => acc + row.totalRow, 0);
  }, [matrizDetalleCompra]);

  
  const isNull = (valor: string | null | undefined): boolean =>{
    if (!valor) return true;
    if (valor === "null" || valor === "undefined") return true;
    if (valor.trim() === "") return true;
    return false
  }

  // Traer datos a la base de datos
  useEffect(()=> {
    const obtenerCatalogo = async () =>{
      setStateCatalogo(true);
      try {
        const respuesta = await api.get('/metadata/metadatos_operaciones');
        const datos = respuesta.data;
        if(!datos.ok){
          alert('No hay Datos')
          return;
        }
        const metadatoClasificacion = datos.data[0];
        const metadatoCuentas = datos.data[1];
        const metadatoFrecuencia = datos.data[2];

        const lstTipoOperacion = metadatoClasificacion.filter( (p: any) => isNull(p.padre))
        const lstCatetgoria = metadatoClasificacion.filter((p: any) => p.clasificacion.length === 3)
        
        setDbTipoOperacion(lstTipoOperacion)
        setDbCategoria(lstCatetgoria)
        setMtrClasificacion(metadatoClasificacion)
        setDbCuentas(metadatoCuentas)
        setDbFrecuencia(metadatoFrecuencia)

      } catch (error) {
        console.log(error)
      } finally {
        setStateCatalogo(false)
      }
    }
    obtenerCatalogo();
  },[])
  // El monto definitivo que se va a guardar
  const montoDefinitivo = requiereDetalleCompra ? totalFacturaCalculado : parseFloat(formulario.monto) || 0;

  // --- Manejador genérico de campos ---
  const actualizarCampo = (campo: keyof Operacion, valor: any) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
  };

  // --- ACCIÓN: AGREGAR ÍTEM A LA FACTURA ---
  const handleAgregarItemFactura = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemProducto || !itemCosto || !itemUnidad || !itemCantidad) {
      alert('Completa los datos del producto de la factura.');
      return;
    }

    const costo = parseFloat(itemCosto);
    const cant = parseFloat(itemCantidad);

    const nuevaFila: DetalleCompra = {
      idLocal: Date.now(),
      detalle: itemProducto,
      costoUnitario: costo,
      unidad: itemUnidad,
      cantidad: cant,
      totalRow: costo * cant
    };

    setMatrizDetalleCompra([...matrizDetalleCompra, nuevaFila]);

    // Limpiar formulario del ítem
    setItemProducto('');
    setItemCosto('');
    setItemUnidad('');
    setItemCantidad('');
  };

  const handleEliminarItemFactura = (id: number) => {
    setMatrizDetalleCompra(matrizDetalleCompra.filter(r => r.idLocal !== id));
  };

  // --- ACCIÓN FINALES: GUARDAR TODA LA OPERACIÓN EN LA BASE DE DATOS ---
  const handleGuardarOperacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.tipoOperacion || !formulario.categoria || !formulario.subCategoria || montoDefinitivo <= 0) {
      alert('Por favor, complete los campos obligatorios y asegúrese de que el monto sea mayor a 0.');
      return;
    }

    // Armamos el Payload estructurado final para enviarlo a Node.js / SQL Server
    const payloadTransaccion = {
      fecha: formulario.fechaOperacion,
      tipoOperacionId: formulario.tipoOperacion.id,
      frecuenciaId: formulario.frecuencia?.id || null,
      clasificacionId: formulario.subCategoria.id, // Se guarda el nivel hoja final
      montoTotal: montoDefinitivo,
      descripcion: formulario.descripcion,
      // Si requería detalle, adjuntamos la matriz completa de la factura, si no, va vacía
      detalleFactura: requiereDetalleCompra ? matrizDetalleCompra : []
    };

    console.log(payloadTransaccion)

    try {
      console.log('🚀 Payload masivo listo para SQL Server:', payloadTransaccion);
      
      // Aquí harás tu llamada real:
      // await api.post('/operaciones', payloadTransaccion);

      setStatus({ tipo: 'success', texto: '🎉 Operación diaria y detalles almacenados con éxito en la Base de Datos.' });
      
      // Resetear estados completos
      setFormulario(estadoInicialForm);
      setMatrizDetalleCompra([]);
      setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      console.error(error);
      setStatus({ tipo: 'danger', texto: 'Error al comunicar con la API.' });
    }
  };

  const createTree = (nodoPadre: string): any[] =>{
    return mtrClasificacion
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
                  setMatrizDetalleCompra([]); // Reseteamos desglose si cambia de subcategoría
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
    <div className={`mt-2 mb-5 ${requiereDetalleCompra ? '': 'container mt-2 mb-5'}`}>
      {status && (
        <Alert variant={status.tipo} onClose={() => setStatus(null)} dismissible>
          {status.texto}
        </Alert>
      )}

      <Form onSubmit={handleGuardarOperacion}>
        <Row>
          {/* ================= PANEL IZQUIERDO: MAESTRO OPERACIÓN ================= */}
          <Col md={requiereDetalleCompra ? 5 : 12} className="mx-auto">
            <Card className="shadow-sm border-0 bg-white p-4">
              <h4 className="text-primary mb-4">📝 Registrar Operación Diaria</h4>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold small">Fecha Operación *</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={formulario.fechaOperacion}
                      onChange={(e) => actualizarCampo('fechaOperacion', e.target.value)}
                      required
                      disabled={stateCatalogo}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold small">Tipo Operación *</Form.Label>
                    <Form.Select 
                      disabled={stateCatalogo}
                      value={formulario.tipoOperacion?.id || ''}
                      onChange={(e) => {
                        const id = e.target.value;
                        const txt = e.target.options[e.target.selectedIndex].text;

                        const tmpCategoria = mtrClasificacion.filter((dato: any) => dato.padre === id)
                        setDbCategoria(tmpCategoria)
                        actualizarCampo('tipoOperacion', id ? { id, descripcion: txt } : null);
                        actualizarCampo('categoria', null);
                        actualizarCampo('subCategoria', null);
                      }}
                      required
                    >
                      <option value="">-- Selecciona --</option>
                      {dbTipoOperacion.map((item) => (
                        <option key={item.clasificacion} value={item.clasificacion}>
                          {item.valor}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  {/* Frecuencia */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Frecuencia</Form.Label>
                    <Form.Select
                      value={formulario.frecuencia?.id || ''}
                      onChange={(e) => {
                        const id = e.target.value;
                        const txt = e.target.options[e.target.selectedIndex].text;
                        actualizarCampo('frecuencia', id ? { id, descripcion: txt } : null);
                      }}
                    >
                      <option value="">-- Selecciona --</option>
                      {dbFrecuencia.map((item) => (
                            <option key={item.codigo} value={item.valor}>
                              {item.valor}
                            </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold small">Categoría Principal *</Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        const id = e.target.value;
                        const txt = e.target.options[e.target.selectedIndex].text;
                        actualizarCampo('categoria', id ? { id, descripcion: txt } : null);
                      }}
                      required
                    >
                      <option value="">-- Selecciona --</option>
                      {dbCategoria.map((item) => (
                        <option key={item.clasificacion} value={item.clasificacion}>
                          {item.valor}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Categorías de Simulación (Aquí usarás tu lógica de Árbol/Modal que ya perfeccionamos) */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sub-Categoría / Detalles</Form.Label>
                      <div className="p-2 border rounded bg-light d-flex justify-content-between align-items-center">
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
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold small">Cuenta *</Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        const id = e.target.value;
                        const txt = e.target.options[e.target.selectedIndex].text;
                        actualizarCampo('cuenta', id ? { id, descripcion: txt } : null);
                      }}
                      required
                    >
                      <option value="">-- Selecciona --</option>
                      {dbCuentas.map((item) => (
                        <option key={item.codigo} value={item.codigo}>
                          {item.dedscripcion}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Campo de Monto Dinámico */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Monto Total de la Operación</Form.Label>
                <InputGroup>
                  <InputGroup.Text>Q</InputGroup.Text>
                  <Form.Control 
                    type="number"
                    step="0.01"
                    value={montoDefinitivo.toFixed(2)}
                    disabled={requiereDetalleCompra} // 🔒 ¡BLOQUEADO si es súper! Se calcula solo abajo
                    onChange={(e) => actualizarCampo('monto', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </InputGroup>
                {requiereDetalleCompra && (
                  <Form.Text className="text-primary fw-bold">
                    * El monto se calcula de forma automática sumando el detalle de la factura.
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small">Descripción / Comentarios (Opcional)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={2} 
                  
                  onChange={(e) => actualizarCampo('descripcion', e.target.value)}
                  placeholder="Ej: Gasolina Puma, compra de despensa mensual..."
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 fw-bold py-2 fs-5 shadow-sm">
                💾 GUARDAR OPERACIÓN COMPLETA
              </Button>
            </Card>
          </Col>

          {/* ================= PANEL DERECHO: DETALLE DE COMPRA (FACTURA) ================= */}
          {requiereDetalleCompra && (
            <Col md={7}>
              <Card className="shadow-sm border-0 bg-white p-4 h-100">
                <h4 className="text-secondary mb-3">🧾 Desglose del Detalle de Compra (Factura)</h4>
                
                {/* Mini Formulario Interno para agregar ítems a la factura */}
                <div className="p-3 bg-light rounded border mb-3">
                  <Row className="align-items-end">
                    <Col md={5} className="mb-2 mb-md-0">
                      <Form.Label className="small fw-bold">Producto *</Form.Label>
                      {/* Datalist para permitir seleccionar de BD o escribir uno nuevo libremente */}
                      <Form.Control
                        type="text"
                        list="productos-datalist"
                        value={itemProducto}
                        placeholder="Escribe o selecciona producto"
                        onChange={(e) => setItemProducto(e.target.value)}
                      />
                      <datalist id="productos-datalist">
                      </datalist>
                    </Col>

                    <Col md={3} className="mb-2 mb-md-0">
                      <Form.Label className="small fw-bold">Unidad *</Form.Label>
                      <Form.Select value={itemUnidad} onChange={(e) => setItemUnidad(e.target.value)}>
                        <option value="">-- Medida --</option>
                      </Form.Select>
                    </Col>

                    <Col md={2} className="mb-2 mb-md-0">
                      <Form.Label className="small fw-bold">Cant *</Form.Label>
                      <Form.Control type="number" min="0.01" step="any" value={itemCantidad} onChange={(e) => setItemCantidad(e.target.value)} />
                    </Col>

                    <Col md={2} className="mb-2 mb-md-0">
                      <Form.Label className="small fw-bold">Costo *</Form.Label>
                      <Form.Control type="number" min="0.01" step="0.01" value={itemCosto} onChange={(e) => setItemCosto(e.target.value)} />
                    </Col>
                  </Row>
                  <Button variant="success" size="sm" className="mt-3 w-100 fw-bold" onClick={handleAgregarItemFactura}>
                    ➕ Agregar Producto a Factura
                  </Button>
                </div>

                {/* Tabla Desglose */}
                <div className="table-responsive" style={{ maxHeight: '280px' }}>
                  <Table striped bordered hover className="align-middle text-center small m-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Producto</th>
                        <th>Medida</th>
                        <th>Cant.</th>
                        <th>Costo U.</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrizDetalleCompra.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-muted py-4">La factura no tiene productos agregados todavía.</td>
                        </tr>
                      ) : (
                        matrizDetalleCompra.map((row) => (
                          <tr key={row.idLocal}>
                            <td className="fw-bold">{row.detalle}</td>
                            <td><span className="badge bg-secondary">{row.unidad}</span></td>
                            <td>{row.cantidad}</td>
                            <td>Q {row.costoUnitario.toFixed(2)}</td>
                            <td className="fw-bold text-primary">Q {row.totalRow.toFixed(2)}</td>
                            <td>
                              <Button variant="link" className="text-danger p-0 font-bold" onClick={() => handleEliminarItemFactura(row.idLocal)}>
                                🗑️
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </Form>

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
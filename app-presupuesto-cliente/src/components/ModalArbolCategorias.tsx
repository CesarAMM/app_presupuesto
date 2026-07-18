import { Modal, Button, Alert } from 'react-bootstrap';
import type { Item } from '../interface/presupuesto'; // Ajusta la ruta a tus interfaces si es necesario

// 1. Definimos las propiedades estrictas que requerirá nuestro componente independiente
interface ModalArbolCategoriasProps {
  show: boolean;
  onHide: () => void;
  tipoOperacion: Item | null;
  categoria: Item | null;
  lstDivisionOperaciones: any[]; // La lista plana que viene de la base de datos
  onSeleccionarNodo: (id: string, descripcion: string) => void; // Evento para devolver la selección al padre
}

export default function ModalArbolCategorias({
  show,
  onHide,
  tipoOperacion,
  categoria,
  lstDivisionOperaciones,
  onSeleccionarNodo,
}: ModalArbolCategoriasProps) {

  // =========================================================================
  // LOGICA: Construir la estructura del árbol recursivamente
  // =========================================================================
  const createTree = (nodoPadre: string): any[] => {
    return lstDivisionOperaciones
      .filter((item) => item.padre === nodoPadre)
      .map((item) => ({
        ...item,
        hijos: createTree(item.clasificacion),
      }));
  };

  // Generamos las ramas de la categoría principal seleccionada
  const branchTree = categoria ? createTree(categoria.id) : [];

  // =========================================================================
  // SUB-COMPONENTE: Nodo recursivo visual (Ahora fuera del flujo principal)
  // =========================================================================
  const NodoArbolVisual = ({ nodo, nivel = 0 }: { nodo: any; nivel: number }) => {
    const esHoja = !nodo.hijos || nodo.hijos.length === 0;

    return (
      <div style={{ marginLeft: `${nivel * 25}px` }} className="mb-2">
        <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light hover-shadow-sm border-start border-primary border-3">
          <div>
            <span className="me-2">{esHoja ? '📄' : '📁'}</span>
            <strong className={esHoja ? 'text-dark' : 'text-primary'}>{nodo.valor}</strong>
            <span className="text-muted small ms-2">({nodo.clasificacion})</span>
          </div>

          {esHoja ? (
            <Button
              variant="outline-success"
              size="sm"
              className="py-0 px-2 text-xs"
              onClick={() => {
                // Al hacer clic, disparamos el evento pasando los datos requeridos
                onSeleccionarNodo(nodo.clasificacion, nodo.valor);
              }}
            >
              Seleccionar
            </Button>
          ) : (
            <span className="badge bg-secondary bg-opacity-50 text-dark border small">
              Contiene divisiones ↓
            </span>
          )}
        </div>

        {!esHoja && (
          <div className="mt-2 border-start border-light-subtle ps-2">
            {nodo.hijos.map((hijo: any) => (
              <NodoArbolVisual key={hijo.clasificacion} nodo={hijo} nivel={nivel + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // =========================================================================
  // RENDERIZADO DE LA MODAL
  // =========================================================================
  return (
    <Modal show={show} onHide={onHide} centered scrollable size="lg">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          🌿 Explorador de Subcategorías ({tipoOperacion?.descripcion} ➡️ {categoria?.descripcion})
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
            branchTree.map((nodoHijo) => (
              <NodoArbolVisual key={nodoHijo.clasificacion} nodo={nodoHijo} nivel={0} />
            ))
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Cerrar Explorador
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
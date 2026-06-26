// 1. Interfaz base para elementos de catálogos (ID y Texto)
export interface Item {
  id: string;
  descripcion: string;
}

// 2. Interfaz para cada registro que vive en la gran matriz (lista temporal)
export interface ItemPresupuesto {
  idLocal: number;       // ID temporal (Date.now()) para manejar las filas en React
  tipoOperacion: Item;   // Objeto completo { id, descripcion }
  frecuencia: Item;      // Objeto completo { id, descripcion }
  categoria: Item;       // Objeto completo { id, descripcion }
  subCategoria: Item;    // Objeto completo del nodo hoja final seleccionado en la modal
  monto: number;         // Guardado estrictamente como número para operaciones matemáticas
}

// 3. Interfaz exclusiva para el Estado Unificado del Formulario
// 💡 Nota: El monto aquí es 'string' porque los inputs HTML manejan texto en tiempo real
export interface FormularioPresupuesto {
  monto: string;
  tipoOperacion: Item | null;
  frecuencia: Item | null;
  categoria: Item | null;
  subCategoria: Item | null;
}
import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard() {
  const [clasificaciones, setClasificaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const obtenerDatos = async () => {
    setCargando(true);
    try {
      const respuesta = await api.get('/metadata/clasificaciones');
      setClasificaciones(respuesta.data.data);
    } catch (error) {
      alert("Error al conectar. Verifica que tu sesión sea válida.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Control Base</h2>
        <Button variant="outline-danger" onClick={handleLogout}>Cerrar Sesión</Button>
      </div>
      
      <Button variant="success" onClick={obtenerDatos} disabled={cargando}>
        {cargando ? <Spinner animation="border" size="sm" /> : 'Cargar Categorías de Gastos'}
      </Button>

      <hr className="my-4" />

      {clasificaciones.length > 0 && (
        <ul className="list-group mt-3">
          {clasificaciones.map((item) => (
            <li key={item.clasificacion} className="list-group-item d-flex justify-content-between">
              <span><strong>{item.clasificacion}</strong> - {item.valor}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
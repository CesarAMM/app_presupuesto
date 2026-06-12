import { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // Importamos tu API configurada

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Ahora guardamos el mensaje de error del backend
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(''); // Limpiamos errores previos

    try {
      // 1. Hacemos la petición POST a tu backend
      const respuesta = await api.post('/core/login_auth', {
        username: usuario,
        password: password
      });

      // 2. Si es exitoso, guardamos los datos del usuario (César o Daniela) en localStorage
      if (respuesta.data.ok) {
        localStorage.setItem('usuarioActivo', JSON.stringify(respuesta.data.usuario));
        navigate('/dashboard'); // ¡Entramos a la app!
      }
    } catch (err: any) {
      // 3. Si falla, mostramos el error
      if (err.response && err.response.status === 401) {
        setError(err.response.data.mensaje || 'Usuario o contraseña incorrectos');
      } else {
        setError('Error al conectar con el servidor de la base de datos.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '25rem' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">Iniciar Sesión</Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ej: cesar" 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Tu contraseña secreta" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={cargando}>
              {cargando ? <Spinner animation="border" size="sm" /> : 'Entrar al Presupuesto'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
import { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí validamos. En un entorno real, haríamos una petición al backend.
    // Como usamos Basic Auth, por ahora validaremos y guardaremos las credenciales.
    if (usuario === 'familia' && password === 'presupuesto2024') {
      // Guardamos la credencial en Base64 en el navegador
      const token = btoa(`${usuario}:${password}`);
      localStorage.setItem('authToken', token);
      
      setError(false);
      navigate('/dashboard'); // Redirigimos al panel principal
    } else {
      setError(true);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '25rem' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">Iniciar Sesión</Card.Title>
          
          {error && <Alert variant="danger">Usuario o contraseña incorrectos</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingresa tu usuario" 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Ingresa tu contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Entrar al Presupuesto
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
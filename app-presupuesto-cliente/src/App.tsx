import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Navbar, Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      {/* Nuestro Navbar global */}
      <Navbar bg="dark" variant="dark" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand>Planificacion Presupuesto</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        {/* Aquí definimos qué pantalla se muestra según la URL */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
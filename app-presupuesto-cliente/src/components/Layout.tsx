import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuarioActivo');
    navigate('/login');
  };

  return (
    <>
      {/* Menú de Navegación Superior */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">💰 Presupuestos</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/presupuesto">Presupuesto</Nav.Link>
              <Nav.Link as={Link} to="/operaciones">Operaciones</Nav.Link>
              <Nav.Link as={Link} to="/parametrizacion">Parametrización</Nav.Link>
            </Nav>
            
            <Button variant="outline-danger" onClick={handleLogout} size="sm">
              Cerrar Sesión
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Aquí es donde "aterrizan" las diferentes páginas */}
      <Container>
        <Outlet /> 
      </Container>
    </>
  );
}
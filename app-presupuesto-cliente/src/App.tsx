import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import ProtectedRouter from './components/ProtectedRouter'
import Layout from './components/Layout'
import Presupuesto from './pages/Presupuesto';
import Operaciones from './pages/Operaciones';
import Parametrizacion from './pages/Parametrizacion';

function App() {
 return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas (Todas envueltas por el Guardián y el Layout con el Menú) */}
        <Route element={<ProtectedRouter><Layout /></ProtectedRouter>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/presupuesto" element={<Presupuesto />} />
          <Route path="/operaciones" element={<Operaciones />} />
          <Route path="/parametrizacion" element={<Parametrizacion />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
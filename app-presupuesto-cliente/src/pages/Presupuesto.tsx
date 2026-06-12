import { Card } from 'react-bootstrap';

export default function Presupuesto() {
  return (
    <Card className="p-4 shadow-sm mt-4">
      <h2>Ingreso de Presupuesto</h2>
      <p className="text-muted">Aquí planificaremos los ingresos y gastos del mes.</p>
    </Card>
  );
}
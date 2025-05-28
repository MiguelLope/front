import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../componentes/Navbar';

interface DetalleVenta {
  id_detalle: number;
  id_medicamento: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  medicamento: {
    nombre_generico: string;
    nombre_medico: string;
  };
}

interface Venta {
  id_venta: number;
  fecha_venta: string;
  total: number;
  metodo_pago: string;
  detalle_ventas: DetalleVenta[];
}

const VentasDetalles = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    axios
      .get('https://back-production-8a10.up.railway.app/api/detalleventas')
      .then((response) => setVentas(response.data))
      .catch((error) => console.error('Error al obtener ventas:', error));
  }, []);

  const filteredVentas = ventas.filter((venta) =>
    venta.detalle_ventas.some((detalle) =>
      detalle.medicamento.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detalle.medicamento.nombre_medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.fecha_venta.includes(searchTerm) ||
      venta.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="text-center text-primary mb-4">Historial de Ventas</h3>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por medicamento, fecha o método de pago"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="row">
          {filteredVentas.map((venta) => (
            <div className="col-md-6 mb-4" key={venta.id_venta}>
              <VentaCard venta={venta} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const VentaCard = ({ venta }: { venta: Venta }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body bg-light">
        <h5 className="card-title text-dark">Venta #{venta.id_venta}</h5>
        <p className="card-text mb-1"><strong>Fecha:</strong> {venta.fecha_venta}</p>
        <p className="card-text mb-1"><strong>Método:</strong> {venta.metodo_pago}</p>
        <p className="card-text mb-2"><strong>Total:</strong> ${venta.total}</p>

        <button
          className={`btn btn-sm ${showDetails ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Cerrar detalles' : 'Ver detalles'}
        </button>

        {showDetails && <DetalleTabla detalles={venta.detalle_ventas} />}
      </div>
    </div>
  );
};

const DetalleTabla = ({ detalles }: { detalles: DetalleVenta[] }) => {
  return (
    <div className="mt-3">
      <table className="table table-bordered table-sm table-hover">
        <thead className="table-secondary">
          <tr>
            <th>Medicamento</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((item) => (
            <tr key={item.id_detalle}>
              <td>{item.medicamento.nombre_generico} <br /><small className="text-muted">({item.medicamento.nombre_medico})</small></td>
              <td>{item.cantidad}</td>
              <td>${item.precio_unitario}</td>
              <td>${item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasDetalles;

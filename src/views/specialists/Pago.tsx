import { useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Pago = () => {
  const navigate = useNavigate();
  const { id_cita } = useParams();
  const [formData, setFormData] = useState({
    id_cita: id_cita,
    monto: "",
    metodo_pago: "efectivo",
    estado: "pendiente", // Agregar el estado
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://back-production-47e5.up.railway.app/api/pagos", formData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      console.log("Respuesta del servidor:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error al enviar el pago:", error);
    }
  };

  return (
    <div className="container p-5 mt-4">
      <h2>Realizar Pago</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Monto</label>
          <input
            type="number"
            className="form-control"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Método de Pago</label>
          <select
            className="form-select"
            name="metodo_pago"
            value={formData.metodo_pago}
            onChange={handleChange}
            required
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="fallido">Fallido</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Confirmar Pago
        </button>
      </form>
    </div>
  );
};

export default Pago;

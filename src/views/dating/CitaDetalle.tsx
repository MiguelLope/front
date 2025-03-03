import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CitaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cita, setCita] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCita = async () => {
      try {
        const response = await axios.get(`https://back-production-47e5.up.railway.app/api/citas/${id}`);
        setCita(response.data.cita);

        
      } catch (error:any){      
        setError("Error al cargar los detalles de la cita.");
      }
    };
    fetchCita();
  }, [id]);

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-lg p-4 border-0 rounded" style={{ maxWidth: "500px", width: "100%" }}>
        <h4 className="text-center mb-3 text-success">Detalles de la Cita</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        {cita ? (
          <>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Paciente:</strong> {cita.paciente}</li>
              <li className="list-group-item"><strong>Especialista:</strong> {cita.especialista}</li>
              <li className="list-group-item"><strong>Consultorio:</strong> {cita.consultorio}</li>
              <li className="list-group-item"><strong>Fecha y Hora:</strong> {new Date(cita.fecha_hora).toLocaleString()}</li>
              <li className="list-group-item"><strong>Estado:</strong> <span className={`badge bg-${cita.estado === 'pendiente' ? 'warning' : 'success'}`}>{cita.estado}</span></li>
              <li className="list-group-item"><strong>Motivo:</strong> {cita.motivo}</li>
            </ul>
          </>
        ) : (
          <p className="text-center text-muted">Cargando...</p>
        )}
        <button className="btn btn-success mt-3 w-100" onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    </div>
  );
};

export default CitaDetalle;
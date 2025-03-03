import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Cita {
  id_cita: number;
  fecha_hora: string;
  estado: string;
  motivo?: string;
  paciente: {
    id_usuario: number;
    nombre: string;
    curp: string;
    email: string;
    telefono: string;
  };
  consultorio: {
    id_consultorio: number;
    nombre: string;
    ubicacion: string;
  };
  especialista: {
    id_especialista: number;
    id_usuario: number;
    especialidad: string;
  };
}

const CitaDetalle = () => {
  const { id_cita } = useParams();
  const [cita, setCita] = useState<Cita | null>(null);
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/citas/especialista/${id_cita}`)
      .then((response) => {setCita(response.data)
      })
      .catch((error) => console.error("Error cargando la cita:", error));

  }, []);

  const registrarHistorial = () => {
    if (!cita) return;

    axios
      .post("http://127.0.0.1:8000/api/historial", {
        id_usuario: cita.paciente.id_usuario,
        id_especialista: cita.especialista.id_especialista,
        id_cita: cita.id_cita,
        diagnostico,
        tratamiento,
        fecha: new Date().toISOString().split("T")[0],
      })
      .then(() => alert("Historial registrado con éxito"))
      .catch((error) => console.error("Error registrando historial:", error));

      navigate(`/pago/${cita.id_cita}`);

  };

  if (!cita) return <p className="text-center">Cargando...</p>;

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#00796b" }}>
        <div className="container">
          <span className="navbar-brand">Detalles de la Cita</span>
          <button className="btn btn-light" onClick={() => navigate(-1)}>
            Regresar
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">Detalles de la Cita</h2>

        <div className="card p-4 shadow-lg rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>{cita.paciente.nombre}</h4>
            <span className={`badge ${cita.estado === "pendiente" ? "bg-warning" : "bg-success"} text-dark`}>
              {cita.estado.toUpperCase()}
            </span>
          </div>

          <div className="row">
            <div className="col-md-6">
              <p><strong>Fecha y Hora:</strong> {new Date(cita.fecha_hora).toLocaleString()}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Consultorio:</strong> {cita?.consultorio?.nombre} - {cita?.consultorio?.ubicacion}</p>
            </div>
          </div>

          <p><strong>Motivo:</strong> {cita.motivo || "Sin especificar"}</p>

          <h5 className="mt-4">Registrar Historial Médico</h5>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Diagnóstico</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  placeholder="Escribe el diagnóstico aquí..."
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Tratamiento</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={tratamiento}
                  onChange={(e) => setTratamiento(e.target.value)}
                  placeholder="Escribe el tratamiento aquí..."
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-success w-100 py-3 px-4 shadow-sm"
              onClick={registrarHistorial}
            >
              <i className="bi bi-check-circle"></i> Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitaDetalle;

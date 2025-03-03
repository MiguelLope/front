import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";

type Consultorio = {
  id_consultorio: number;
  nombre: string;
  ubicacion: string;
};

type Especialista = {
  id_especialista: number;
  nombre: string;
  especialidad: string;
  horario_inicio: string;
  horario_fin: string;
  dias_trabajo: string[]; // Array de días de trabajo
};

const Dating = () => {
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [selectedConsultorio, setSelectedConsultorio] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "https://back-production-47e5.up.railway.app/api";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultorios = async () => {
      try {
        const response = await axios.get(`${API_URL}/consultorios`);
        setConsultorios(response.data);
      } catch (err) {
        setError("Error al cargar los consultorios.");
      }
    };

    fetchConsultorios();
  }, []);

  const handleConsultorioClick = async (id_consultorio: number) => {
    setSelectedConsultorio(id_consultorio);
    setEspecialistas([]);
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/consultorios/${id_consultorio}/especialistas`);
      
      // Convertir dias_trabajo de JSON string a un array y extraer el nombre del usuario
      const especialistasConDatos = response.data.especialistas.map((especialista: any) => ({
        ...especialista,
        dias_trabajo: JSON.parse(especialista.dias_trabajo), // Convierte el string JSON en array
        nombre: especialista.usuario.nombre, // Extraer nombre del usuario
      }));

      setEspecialistas(especialistasConDatos);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los especialistas.");
      setLoading(false);
    }
  };

  const handleAgendarCita = (especialista: Especialista) => {
    navigate("scheduledate", {
      state: {
        id_consultorio: selectedConsultorio,
        id_especialista: especialista.id_especialista,
        horario_inicio: especialista.horario_inicio,
        horario_fin: especialista.horario_fin,
        dias_trabajo: especialista.dias_trabajo,
      },
    });
  };

  const formatTime = (time: string) => (time ? time.slice(0, 5) : "");

  return (
    <div>
      <NavBar select="dating" />
      <div className="container py-4">
        <h2 className="text-center mb-4" style={{ color: "#00796b" }}>
          Agendar Cita
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Listado de Consultorios */}
        <div className="row g-4">
          {consultorios.map((consultorio) => (
            <div key={consultorio.id_consultorio} className="col-12 col-md-6 col-lg-4">
              <div
                className="card border-0 shadow-sm"
                style={{
                  backgroundColor:
                    selectedConsultorio === consultorio.id_consultorio ? "#b2dfdb" : "#e0f2f1",
                  color: "#004d40",
                  border: selectedConsultorio === consultorio.id_consultorio ? "2px solid #00796b" : "none",
                  cursor: "pointer",
                }}
                onClick={() => handleConsultorioClick(consultorio.id_consultorio)}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">{consultorio.nombre}</h5>
                  <p className="card-text">{consultorio.ubicacion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Especialistas Relacionados */}
        {selectedConsultorio && (
          <div className="mt-5">
            <h3 className="text-center" style={{ color: "#00796b" }}>
              Especialistas en este Consultorio
            </h3>
            {loading ? (
              <div className="text-center mt-3">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="row g-4 mt-3">
                {especialistas.map((especialista) => (
                  <div key={especialista.id_especialista} className="col-12 col-md-6 col-lg-4">
                    <div
                      className="card border-0 shadow-sm"
                      style={{
                        backgroundColor: "#e8f5e9",
                        color: "#004d40",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{especialista.nombre}</h5>
                        <p className="card-text">
                          <strong>Especialidad:</strong> {especialista.especialidad}
                        </p>
                        <p className="card-text">
                          <strong>Horario:</strong> {formatTime(especialista.horario_inicio)} -{" "}
                          {formatTime(especialista.horario_fin)}
                        </p>
                        <p className="card-text">
                          <strong>Días de Trabajo:</strong> {especialista.dias_trabajo.join(", ")}
                        </p>
                        <button
                          className="btn btn-success w-100"
                          onClick={() => handleAgendarCita(especialista)}
                        >
                          Agendar Cita
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dating;

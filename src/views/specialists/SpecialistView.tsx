import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

type EspecialistaInfo = {
  id_usuario: number;
  id_especialista: number;
  nombre: string;
  especialidad: string;
  horario_inicio: string;
  horario_fin: string;
  consultorio: {
    id_consultorio: number;
    nombre: string;
    ubicacion: string;
  } | null;
};

type Consultorio = {
  id_consultorio?: number;
  nombre?: string;
};

const SpecialistView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [especialistaInfo, setEspecialistaInfo] = useState<EspecialistaInfo | null>(null);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [selectedConsultorio, setSelectedConsultorio] = useState<number | null>(null);
  const [horarioInicio, setHorarioInicio] = useState<string>("");
  const [horarioFin, setHorarioFin] = useState<string>("");
  const [consultorio, setConsultorio] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [diasTrabajo, setDiasTrabajo] = useState<string[]>([]);

  const API_URL = "https://back-production-47e5.up.railway.app/api";

  // Manejo de errores para solicitudes HTTP
  const handleError = (error: any, defaultMessage: string) => {
    const errorMessage =
      error.response?.data?.message || defaultMessage || "Ocurrió un error inesperado.";
    setMessage({ type: "error", text: errorMessage });
  };

  // Formatear horario de HH:MM:SS a HH:MM
  const formatTime = (time: string) => (time ? time.slice(0, 5) : "");

  // Cargar datos iniciales
  useEffect(() => {
    if (!state?.data?.id_usuario) {
      setMessage({ type: "error", text: "No se proporcionó un ID de especialista." });
      setLoading(false);
      return;
    }

    const idEspecialista = state.data.id_usuario;

    const loadData = async () => {
      try {
        const [especialistaResponse, consultoriosResponse] = await Promise.all([
          axios.get(`${API_URL}/especialistas/${idEspecialista}`),
          axios.get(`${API_URL}/consultorios`),
        ]);

        console.log(especialistaResponse);
        

        const especialista = especialistaResponse.data.especialista;
        setEspecialistaInfo(especialista);
        setHorarioInicio(formatTime(especialista.horario_inicio));
        setHorarioFin(formatTime(especialista.horario_fin));
        setConsultorios(consultoriosResponse.data);
        setConsultorio(especialista.consultorio?.nombre || "No asignado");

        // Cargar los días de trabajo del especialista
        setDiasTrabajo(especialista.dias_trabajo || []);
      } catch (error) {
        handleError(error, "Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [state]);

  // Enviar datos del consultorio
  const handleConsultorioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConsultorio) {
      setMessage({ type: "error", text: "Debe seleccionar un consultorio." });
      return;
    }

    try {
      await axios.put(`${API_URL}/especialistas/${especialistaInfo?.id_especialista}/consultorio`, {
        id_consultorio: selectedConsultorio,
      });
      setMessage({ type: "success", text: "Consultorio asignado correctamente." });
    } catch (error) {
      handleError(error, "Error al asignar consultorio.");
    }
  };

  // Enviar datos del horario
  const handleHorarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/especialistas/${especialistaInfo?.id_especialista}/horario`, {
        horario_inicio: horarioInicio,
        horario_fin: horarioFin,
        dias_trabajo: diasTrabajo,  // Enviar los días de trabajo seleccionados
      });

      setMessage({ type: "success", text: "Horario y días de trabajo actualizados correctamente." });
    } catch (error) {
      handleError(error, "Error al actualizar horario y días de trabajo.");
    }
  };

  // Renderizar vista
  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div>
      <nav className="navbar navbar-dark" style={{ backgroundColor: "#00796b", color: "white" }}>
        <div className="container">
          <span className="navbar-brand">Detalles del Especialista</span>
          <button className="btn btn-light" onClick={() => navigate(-1)}>
            Regresar
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        {message && (
          <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
            {message.text}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card shadow" style={{ backgroundColor: "#e0f2f1" }}>
              <div className="card-header text-white" style={{ backgroundColor: "#004d40" }}>
                <h4>Información del Especialista</h4>
              </div>
              <div className="card-body">
                <p><strong>Nombre:</strong> {especialistaInfo?.nombre}</p>
                <p><strong>Especialidad:</strong> {especialistaInfo?.especialidad}</p>
                <p><strong>Horario:</strong> {horarioInicio} - {horarioFin}</p>
                <p><strong>Consultorio:</strong> {consultorio || "No asignado"}</p>
                <p><strong>Días de trabajo:</strong> {diasTrabajo.join(", ") || "No asignados"}</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card shadow" style={{ backgroundColor: "#fff3e0" }}>
              <div className="card-header text-white" style={{ backgroundColor: "#bf360c" }}>
                <h5>Asignar Consultorio</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleConsultorioSubmit}>
                  <select
                    className="form-select"
                    value={selectedConsultorio || ""}
                    onChange={(e) => {setSelectedConsultorio(Number(e.target.value)); setConsultorio(e.target.selectedOptions[0].text)}}
                  >
                    <option value="">Seleccionar</option>
                    {consultorios.map((c) => (
                      <option key={c.id_consultorio} value={c.id_consultorio}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-secondary mt-3 w-100">Asignar</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card shadow" style={{ backgroundColor: "#e8f5e9" }}>
              <div className="card-header text-white" style={{ backgroundColor: "#2e7d32" }}>
                <h5>Actualizar Horarios y Días de Trabajo</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleHorarioSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Horario de Inicio:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={horarioInicio}
                      onChange={(e) => setHorarioInicio(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Horario de Fin:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={horarioFin}
                      onChange={(e) => setHorarioFin(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Días de Trabajo:</label>
                    <div className="d-flex flex-wrap">
                      {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                        <div key={dia} className="form-check me-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={dia}
                            checked={diasTrabajo.includes(dia)}
                            onChange={(e) => {
                              const diaSeleccionado = e.target.value;
                              setDiasTrabajo((prev) =>
                                prev.includes(diaSeleccionado)
                                  ? prev.filter((d) => d !== diaSeleccionado)
                                  : [...prev, diaSeleccionado]
                              );
                            }}
                          />
                          <label className="form-check-label">{dia}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-success w-100">
                    Actualizar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistView;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

type Paciente = {
  id_usuario: number;
  nombre: string;
};

type Consultorio = {
  id_consultorio: number;
  nombre: string;
};

type Especialista = {
  id_especialista: number;
  nombre: string;
};

const ScheduleDate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id_consultorio, id_especialista, horario_inicio, horario_fin, dias_trabajo } = location.state || {};

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultorio, setConsultorio] = useState<Consultorio | null>(null);
  const [especialista, setEspecialista] = useState<Especialista | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [estado, setEstado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [diasValidos, setDiasValidos] = useState<number[]>([]);
  const [isHoraEnabled, setIsHoraEnabled] = useState(false); // Estado para habilitar la hora


  const userString = localStorage.getItem('usr');
  const user = userString ? JSON.parse(userString) : null;



  const API_URL = "http://127.0.0.1:8000/api";

  const diasPermitidos = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const mapDiasTrabajo = (dias: string[]) => {
    return dias
      .map(d => diasPermitidos.findIndex(dp => dp.toLowerCase() === d.toLowerCase()))
      .filter(index => index !== -1); // Eliminar valores inválidos
  };
  
  useEffect(() => {
    if (dias_trabajo) {
      setDiasValidos(mapDiasTrabajo(dias_trabajo));
    }

    const fetchPacientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/pacientes`);
        setPacientes(response.data);
      } catch {
        setError("Error al cargar los pacientes.");
      }
    };

    const fetchConsultorio = async () => {
      try {
        const response = await axios.get(`${API_URL}/consultorios/${id_consultorio}`);
        setConsultorio(response.data);
      } catch {
        setError("Error al cargar el consultorio.");
      }
    };

    const fetchEspecialista = async () => {
      try {
        const response = await axios.get(`${API_URL}/especialistas/date/${id_especialista}`);
        setEspecialista(response.data);
      } catch {
        setError("Error al cargar el especialista.");
      }
    };


    if (user.tipo_usuario === "paciente") {
      setSelectedPaciente(user.id_usuario);
    }

    fetchPacientes();
    if (id_consultorio) fetchConsultorio();
    if (id_especialista) fetchEspecialista();
  }, [id_consultorio, id_especialista, dias_trabajo]);

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaciente) {
      setError("Por favor, selecciona un paciente.");
      return;
    }

    if (!fecha) {
      setError("Por favor, ingresa la fecha.");
      return;
    }

    if (!hora) {
      setError("Por favor, ingresa la hora.");
      return;
    }

    if (!estado) {
      setError("Por favor, selecciona el estado.");
      return;
    }

    if (!motivo) {
      setError("Por favor, ingresa el motivo.");
      return;
    }

    const fecha_hora = `${fecha} ${hora}:00`;

    try {
      const response = await axios.post(`${API_URL}/citas`, {
        id_consultorio,
        id_especialista,
        id_usuario: selectedPaciente,
        fecha_hora,
        estado: estado.toLowerCase(),
        motivo,
      });

      if (response.status === 201) {
        setSuccess("Cita registrada exitosamente.");
        const citaId = response.data.id_cita;
        navigate(`/cita/detalle/${citaId}`);
      }
    } catch (err: any) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al registrar la cita.");
      }
    }
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    const fechaSeleccionada = new Date(nuevaFecha);
    const diaSemana = (fechaSeleccionada.getDay() + 6) % 7; // Ajusta para que lunes sea 0
  
    if (diasValidos.includes(diaSemana)) {
      setFecha(nuevaFecha);
      setIsHoraEnabled(true);
      setError(null);
    } else {
      setError("El especialista no trabaja el día seleccionado.");
      setFecha("");
      setIsHoraEnabled(false);
    }
  };
  

  const filtrarHorasDisponibles = (): string[] => {
    if (!horario_inicio || !horario_fin) return [];
  
    const horas: string[] = [];
    let [hInicio, mInicio] = horario_inicio.split(":").map(Number);
    let [hFin, mFin] = horario_fin.split(":").map(Number);
  
    let minutosTotalesInicio = hInicio * 60 + mInicio;
    let minutosTotalesFin = hFin * 60 + mFin;
    let intervalo = 60; // Ajusta este valor si necesitas otro intervalo
  
    for (let min = minutosTotalesInicio; min < minutosTotalesFin; min += intervalo) {
      let hora = Math.floor(min / 60);
      let minutos = min % 60;
      let horaStr = `${hora.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
      horas.push(horaStr);
    }
  
    return horas;
  };
  
  

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
      <div className="container py-3">
        <div className="card shadow-sm p-3">
          <h5 className="mb-3 text-center">Detalles de la Cita</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="mb-3">
            <strong>Consultorio:</strong> {consultorio ? consultorio.nombre : "Cargando..."}
          </div>
          <div className="mb-3">
            <strong>Especialista:</strong> {especialista ? especialista.nombre : "Cargando..."}
          </div>
          <div className="mb-3">
            <strong>Días de Trabajo:</strong> {dias_trabajo.join(", ")}
          </div>
          <form onSubmit={handleAgendar} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="paciente" className="form-label">Paciente</label>
              {user?.tipo_usuario === "paciente" ? (
                <select
                  id="paciente"
                  className="form-select"
                  value={user.id_usuario}
                  disabled
                  onChange={(e) => {
                    setSelectedPaciente(Number(e.target.value));
                  }}
                >
                  <option value="" disabled>Selecciona un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id_usuario} value={paciente.id_usuario}>
                      {paciente.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="paciente"
                  className="form-select"
                  onChange={(e) => {
                    setSelectedPaciente(Number(e.target.value));
                  }}
                >
                  <option value="" >Selecciona un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id_usuario} value={paciente.id_usuario}>
                      {paciente.nombre}
                    </option>
                  ))}
                </select>
              )
              }

            </div>
            <div className="col-md-6">
              <label htmlFor="fecha" className="form-label">Fecha</label>
              <input
                type="date"
                id="fecha"
                className="form-control"
                min={new Date().toISOString().split("T")[0]}
                value={fecha}
                onChange={handleFechaChange}
              />
            </div>

            {isHoraEnabled && (
              <div className="col-md-6">
                <label htmlFor="hora" className="form-label">Hora</label>
                <input
                  type="time"
                  id="hora"
                  className="form-control"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  list="horas-validas"
                  step="900"
                  onKeyDown={(e) => e.preventDefault()}
                />

                <datalist id="horas-validas">
                  {filtrarHorasDisponibles().map((h) => (
                    <option key={h} value={h} />
                  ))}
                </datalist>
              </div>
            )}

            <div className="col-md-6">
              <label htmlFor="estado" className="form-label">Estado</label>
              <select
                id="estado"
                className="form-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="" disabled>Selecciona un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="motivo" className="form-label">Motivo</label>
              <textarea
                id="motivo"
                className="form-control"
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              ></textarea>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-success w-100">
                Agendar Cita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDate;

import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

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

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "pendiente":
      return "badge bg-warning text-dark";
    case "confirmada":
      return "badge bg-success";
    case "en progreso":
      return "badge bg-primary";
    case "cancelada":
      return "badge bg-danger";
    default:
      return "badge bg-secondary";
  }
};

const Home = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [search, setSearch] = useState("");
  const userString = localStorage.getItem("usr");
  const user = userString ? JSON.parse(userString) : null;

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.tipo_usuario === "especialista") {
      axios
        .get(`https://back-production-47e5.up.railway.app/api/especialista/citas/${user.id_usuario}`)
        .then((response) => setCitas(response.data))
        .catch((error) => console.error("Error cargando citas:", error));
    }
    if (user?.tipo_usuario === "admin") {
      axios
        .get(`https://back-production-47e5.up.railway.app/api/especialista/citas`)
        .then((response) => setCitas(response.data))
        .catch((error) => console.error("Error cargando citas:", error));
    }
    if (user?.tipo_usuario === "paciente") {
      axios
        .get(`https://back-production-47e5.up.railway.app/api/paciente/citas/${user.id_usuario}`)
        .then((response) => setCitas(response.data))
        .catch((error) => console.error("Error cargando citas:", error));
    }

  }, []);

  const filteredCitas = citas.filter((cita) =>
    `${cita.paciente.nombre} ${cita?.consultorio?.nombre} ${cita.estado}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const actualizarEstadoCita = (idCita: number, nuevoEstado: string) => {
    axios
      .put(`https://back-production-47e5.up.railway.app/api/citas/${idCita}`, { estado: nuevoEstado })
      .then(() => {
        setCitas((prevCitas) =>
          prevCitas.map((cita) =>
            cita.id_cita === idCita ? { ...cita, estado: nuevoEstado } : cita
          )
        );
      })
      .catch((error) => console.error("Error actualizando cita:", error));
  };

  const puedeCancelar = (fecha_hora: string) => {
    const fechaCita = new Date(fecha_hora).getTime();
    const ahora = new Date().getTime();
    return ahora >= fechaCita;
  };

  const iniciarCita = (id: number) => {
    navigate(`/especialista/cita/view/${id}`);
  };

  return (
    <div>
      <NavBar select={"inicio"} />

      <div className="container mt-5">
        <h2 className="mb-4 text-center">Citas Pendientes</h2>

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por paciente, consultorio o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredCitas.length > 0 ? (
          <div className="row">
            {filteredCitas.map((cita) => (
              <div key={cita.id_cita} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card shadow-sm position-relative border-0"
                  style={{
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0px 5px 15px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0px 2px 10px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {/* Estado en la esquina superior derecha */}
                  <span
                    className={`${getEstadoBadge(
                      cita.estado
                    )} position-absolute top-0 end-0 m-2 px-3 py-1`}
                    style={{ fontSize: "0.9em", borderRadius: "10px" }}
                  >
                    {cita.estado.toUpperCase()}
                  </span>

                  <div className="card-body">
                    <h5 className="card-title">{cita.paciente.nombre}</h5>
                    <p className="card-text">
                      <strong>Fecha y Hora:</strong>{" "}
                      {new Date(cita.fecha_hora).toLocaleString()}
                    </p>
                    <p className="card-text">
                      <strong>Consultorio:</strong> {cita?.consultorio?.nombre}
                    </p>
                    <p className="card-text">
                      <strong>Motivo:</strong>{" "}
                      {cita.motivo || "Sin motivo especificado"}
                    </p>

                    {/* Botones de acción */}
                    {/* Verificar si faltan datos */}
                    {(!cita.consultorio || !cita.especialista) ? (
                      <div className="alert alert-warning text-center" role="alert">
                        <p className="mb-1"><strong>Atención:</strong> La cita no tiene asignado:</p>
                        <ul className="mb-2">
                          {!cita.consultorio && <li>Consultorio</li>}
                          {!cita.especialista && <li>Especialista</li>}
                        </ul>
                        <p>Por favor, reagende la cita.</p>
                        <button
                          className="btn btn-warning"
                          onClick={() => navigate(`/reagendar/${cita.id_cita}`)}
                        >
                          Reagendar Cita
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Botón para iniciar cita */}
                       

                        {user?.tipo_usuario === "especialista" && (
                           <button
                           className="btn btn-success"
                           onClick={() => iniciarCita(cita.id_cita)}
                         >
                           Iniciar Cita
                         </button>
                        )}

                        {user?.tipo_usuario === "paciente" && (
                          <button
                            className="btn btn-success"
                            onClick={() => actualizarEstadoCita(cita.id_cita, "confirmada")}
                          >
                            Confirmar Cita
                          </button>
                        )}

                        {/* Botón para cancelar si aplica */}
                        {(user?.tipo_usuario === "admin" || user?.tipo_usuario === "paciente" || puedeCancelar(cita.fecha_hora)) && (
                          <button
                            className="btn btn-danger"
                            onClick={() => actualizarEstadoCita(cita.id_cita, "cancelada")}
                          >
                            Cancelar Cita
                          </button>
                        )}
                      </>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No hay citas coincidentes.</p>
        )}
      </div>
    </div>
  );
};

export default Home;


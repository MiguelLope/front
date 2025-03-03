import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Historial {
  id_historial: number;
  diagnostico: string;
  tratamiento: string;
  fecha: string;
  usuario: {
    nombre: string;
    email: string;
    telefono: string;
  };
  especialista: {
    usuario: {
      nombre: string;
      email: string;
      telefono: string;
    };
  };
  cita: {
    fecha_hora: string;
    estado: string;
    motivo?: string;
    consultorio: {
      nombre: string;
    };
  };
}

const Record = () => {
  const [historiales, setHistoriales] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHistorial, setSelectedHistorial] = useState<Historial | null>(null);
  const [search, setSearch] = useState('');
  const userString = localStorage.getItem('usr');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (user.tipo_usuario === "paciente") {
      axios
        .get(`https://back-production-47e5.up.railway.app/api/historial/paciente/${user.id_usuario}`)
        .then((response) => {
          setHistoriales(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando historial:", error);
          setLoading(false);
        });
    }
    if (user.tipo_usuario === "especialista") {
      axios
        .get(`https://back-production-47e5.up.railway.app/api/historial/especialista/${user.id_usuario}`)
        .then((response) => {
          setHistoriales(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando historial:", error);
          setLoading(false);
        });
    }

    if (user.tipo_usuario === "especialista") {
      axios
        .get(`https://back-production-47e5.up.railway.app/api/historial/especialista/${user.id_usuario}`)
        .then((response) => {
          setHistoriales(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando historial:", error);
          setLoading(false);
        });
    }


    if (user.tipo_usuario === "admin") {
      axios
        .get(`https://back-production-47e5.up.railway.app/api/historial/completo/${0}`)
        .then((response) => {
          console.log(response);
          console.log(response);

          setHistoriales(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando historial:", error);
          setLoading(false);
        });
    }

  }, []);

  if (loading) return <p className="text-center">Cargando...</p>;

  const handleVerMas = (historial: Historial) => {
    setSelectedHistorial(historial);
  };

  const handleCerrar = () => {
    setSelectedHistorial(null);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("historial-medico");

    // Verifica que el elemento no sea null
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("historial_medico.pdf");
      });
    } else {
      console.error("El elemento con id 'historial-medico' no se encuentra.");
    }
  };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    };

  const filteredHistoriales = historiales.filter((historial) =>
    historial.usuario.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <NavBar select="historial" />
      <div className="container mt-4">
        <h2 className="text-center text-success mb-4">Historial Médico</h2>

        {historiales.length === 0 ? (
          <p className="text-center text-muted">No hay historial registrado.</p>
        ) : (
          <div className="row w-100">
              <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar Paciente..."
              value={search}
              onChange={handleSearchChange}
            />
            {filteredHistoriales.map((historial) => (
              <div key={historial.id_historial} className="col-md-4 mb-4">
                <div className="card shadow-lg border-light rounded">
                  <div className="card-body">
                    <h5 className="card-title">{historial.usuario.nombre}</h5>
                    <p className="text-muted mb-2">
                      <strong>Fecha:</strong> {new Date(historial.fecha).toLocaleDateString()}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${historial.cita.estado === "completada" ? "success" : "warning"}`}>
                        {historial.cita.estado}
                      </span>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleVerMas(historial)}
                      >
                        <i className="bi bi-info-circle"></i> Ver más
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedHistorial && (
          <> {/* Fragmento para envolver ambos elementos */}
            <div
              className="modal-backdrop fade show"
              style={{ zIndex: 1050 }}
              onClick={handleCerrar} // Cerrar al hacer clic en el fondo
            ></div>
            <div
              className="modal fade show"
              tabIndex={-1}
              style={{ display: "block", zIndex: 1051 }}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg" >
                <div className="modal-content"  >
                  <div id="historial-medico">
                    <div className="modal-header">
                      <h5 className="modal-title">Detalles del Historial Médico</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCerrar}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <h5><strong>Paciente: </strong> {selectedHistorial.usuario.nombre}</h5>
                      {user.tipo_usuario === "admin" && (
                        <div>
                          <p className="text-muted mb-1">
                            <strong>Email:</strong> {selectedHistorial.usuario.email}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Teléfono:</strong> {selectedHistorial.usuario.telefono}
                          </p>
                        </div>
                      )
                      }

                      {user.tipo_usuario === "especialista" && (
                        <div>
                          <p className="text-muted mb-1">
                            <strong>Email:</strong> {selectedHistorial.usuario.email}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Teléfono:</strong> {selectedHistorial.usuario.telefono}
                          </p>
                        </div>
                      )
                      }

                      <hr />
                      <p><strong>Diagnóstico:</strong> {selectedHistorial.diagnostico}</p>
                      <p><strong>Tratamiento:</strong> {selectedHistorial.tratamiento}</p>
                      <p><strong>Fecha de Registro:</strong> {new Date(selectedHistorial.fecha).toLocaleDateString()}</p>
                      <hr />
                      <p><strong>Fecha y Hora de la Cita:</strong> {new Date(selectedHistorial.cita.fecha_hora).toLocaleString()}</p>
                      <p><strong>Estado:</strong> {selectedHistorial.cita.estado}</p>
                      <p><strong>Motivo:</strong> {selectedHistorial.cita.motivo || "No especificado"}</p>
                      <p><strong>Consultorio:</strong> {selectedHistorial.cita.consultorio.nombre}</p>
                      <hr />
                      {user.tipo_usuario === "paciente" && (
                        <div>
                          <h5 className="text-muted mb-1">
                            <strong>Especialista:</strong> {selectedHistorial.especialista.usuario.nombre}
                          </h5>
                          <p className="text-muted mb-1">
                            <strong>Email:</strong> {selectedHistorial.especialista.usuario.email}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Teléfono:</strong> {selectedHistorial.especialista.usuario.telefono}
                          </p>
                        </div>
                      )
                      }


                      {user.tipo_usuario === "admin" && (
                        <div>
                          <h5 className="text-muted mb-1"><strong>Especialista:</strong> {selectedHistorial.especialista.usuario.nombre}
                          </h5>

                          <p className="text-muted mb-1">
                            <strong>Email:</strong> {selectedHistorial.especialista.usuario.email}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Teléfono:</strong> {selectedHistorial.especialista.usuario.telefono}
                          </p>
                        </div>
                      )
                      }


                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleDownloadPDF}>
                      Descargar PDF
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Record;

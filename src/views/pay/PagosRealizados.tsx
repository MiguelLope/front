import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

interface Pago {
  id_pago: number;
  id_cita: number;
  monto: number;
  metodo_pago: string;
  estado: string;
  cita: {
    id_cita: number;
    fecha_hora: string;
    estado: string;
    motivo: string;
    paciente: {
      id_usuario: number;
      nombre: string;
      telefono: string;
    };
    especialista: {
      usuario: {
        id_usuario: string;
        nombre: string;
      };
      especialidad: string;
    };
    consultorio: {
      nombre: string;
    };
  };
}


const PagosRealizados = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);

  const userString = localStorage.getItem('usr');
  const user = userString ? JSON.parse(userString) : null;
  console.log(user);

  const fetchPagos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/pagos");
      setPagos(response.data);
      console.log(response.data);

    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);


  const handleCompletePayment = async (id_pago: number) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/pagos/${id_pago}/completar`);
      console.log(response.data);
      fetchPagos(); // Recargar la lista después de completar el pago
    } catch (error) {
      console.error("Error al completar el pago:", error);
    }
  };

  return (
    <div>
      <NavBar select="pagos"></NavBar>
      <div className="container mt-4">
        <h2 className="mb-4">Pagos Realizados</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Paciente</th>
              <th>Especialista</th>
              <th>Consultorio</th>
              <th>Fecha y Hora</th>
              <th>Monto</th>
              <th>Método de Pago</th>
              <th>Estado</th>
            </tr>
          </thead>
          {(user?.tipo_usuario === "paciente" || user?.tipo_usuario === "especialista") && (
            <tbody>
              {pagos.length > 0 ? (
                pagos.map((pago, index) => (
                  ((user.id_usuario === pago.cita.paciente.id_usuario)||(user.id_usuario === pago.cita.especialista.usuario.id_usuario)) && (
                    <tr key={pago.id_pago}>
                      <td>{index + 1}</td>
                      <td>{pago.cita.paciente.nombre} ({pago.cita.paciente.telefono})</td>
                      <td>{pago.cita.especialista.usuario.nombre} ({pago.cita.especialista.especialidad})</td>
                      <td>{pago.cita.consultorio.nombre}</td>
                      <td>{new Date(pago.cita.fecha_hora).toLocaleString()}</td>
                      <td>${pago.monto}</td>
                      <td>{pago.metodo_pago}</td>
                      <td>
                        <span
                          className={`badge ${pago.estado === "completado"
                            ? "bg-success"
                            : pago.estado === "pendiente"
                              ? "bg-warning"
                              : "bg-danger"
                            }`}
                        >
                          {pago.estado}
                        </span>
                      </td>
                    </tr>
                  )

                ))
              ) : (

                <tr>
                  <td colSpan={8} className="text-center">
                    No hay pagos registrados
                  </td>
                </tr>

              )}
            </tbody>
          )}

          {(user?.tipo_usuario === "admin") && (

            <tbody>
              {pagos.length > 0 ? (
                pagos.map((pago, index) => (

                  <tr key={pago.id_pago}>
                    <td>{index + 1}</td>
                    <td>{pago.cita.paciente.nombre} ({pago.cita.paciente.telefono})</td>
                    <td>{pago.cita.especialista.usuario.nombre} ({pago.cita.especialista.especialidad})</td>
                    <td>{pago.cita.consultorio.nombre}</td>
                    <td>{new Date(pago.cita.fecha_hora).toLocaleString()}</td>
                    <td>${pago.monto}</td>
                    <td>{pago.metodo_pago}</td>
                    <td>
                      <span
                        className={`badge ${pago.estado === "completado"
                          ? "bg-success"
                          : pago.estado === "pendiente"
                            ? "bg-warning"
                            : "bg-danger"
                          }`}
                      >
                        {pago.estado}
                      </span>
                    </td>
                    <td>
                      {pago.estado === "pendiente" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompletePayment(pago.id_pago)}
                        >
                          Completar Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
                    No hay pagos registrados
                  </td>
                </tr>
              )}
            </tbody>

          )}


        </table>
      </div>
    </div>
  );
};

export default PagosRealizados;

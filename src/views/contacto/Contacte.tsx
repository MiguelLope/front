import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const primaryColor = "#00796b";

export const ContactoUsuario = () => {
  const [contacto, setContacto] = useState({
    ubicacion: "",
    email: "",
    telefono: "",
  });

  useEffect(() => {
    axios
      .get("https://back-production-3ec7.up.railway.app/api/contacto")
      .then((response) => {
        if (response.data) {
          setContacto(response.data);
        }
      })
      .catch((error) =>
        console.error("Error al obtener datos de contacto", error)
      );
  }, []);

  return (

    <div>
      <NavBar select="contact"></NavBar>

      <div className="container mt-4">
        <h2 className="text-center" style={{ color: primaryColor }}>
          Información de Contacto
        </h2>

        <div className="card p-4 shadow-sm border-0" style={{ backgroundColor: "#e0f2f1", borderRadius: "10px" }}>
          <p>
            <strong>Ubicación:</strong> {contacto.ubicacion}
          </p>
          <p>
            <strong>Correo Electrónico:</strong> {contacto.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {contacto.telefono || "No disponible"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactoAdmin = () => {
  const [contacto, setContacto] = useState({
    ubicacion: "",
    email: "",
    telefono: "",
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios
      .get("https://back-production-47e5.up.railway.app/api/contacto")
      .then((response) => {
        if (response.data) {
          setContacto(response.data);
        }
      })
      .catch((error) =>
        console.error("Error al obtener datos de contacto", error)
      );
  }, []);

  const handleChange = (e: any) => {
    setContacto({ ...contacto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post("https://back-production-47e5.up.railway.app/api/contacto", contacto)
      .then(() => setMensaje("Contacto actualizado correctamente"))
      .catch((error) => console.error("Error al actualizar contacto", error));
  };

  return (
    <div>
      <NavBar select="contact"></NavBar>
      <div className="container mt-4 mb-5">
        <h2 className="text-center" style={{ color: primaryColor }}>
          Información de Contacto (Vista Previa)
        </h2>

        <div className="card p-4 shadow-sm border-0" style={{ backgroundColor: "#e0f2f1", borderRadius: "10px" }}>
          <p>
            <strong>Ubicación:</strong> {contacto.ubicacion}
          </p>
          <p>
            <strong>Correo Electrónico:</strong> {contacto.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {contacto.telefono || "No disponible"}
          </p>
        </div>

        <h2 className="text-center mt-4" style={{ color: primaryColor }}>
          Administrar Información de Contacto
        </h2>

        {mensaje && (
          <div className="alert alert-success text-center">{mensaje}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="card p-4 shadow-sm border-0"
          style={{ backgroundColor: "#f1f8e9", borderRadius: "10px" }}
        >
          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <input
              type="text"
              className="form-control"
              name="ubicacion"
              value={contacto.ubicacion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={contacto.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              name="telefono"
              value={contacto.telefono}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

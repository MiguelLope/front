import { useState } from 'react';
import axios from 'axios';
import { SuccessDialog } from "./components/Dialog";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '', curp: '', email: '',
    contraseña: '', tipo_usuario: 'paciente', telefono: '',
  });

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);


  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await axios.post('https://back-production-47e5.up.railway.app/api/usuarios', formData);
      setSuccessDialogOpen(true);
      window.location.href = "/login";

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="p-2 d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#00796b' }}>
        <div
          className="card shadow p-4"
          style={{ width: '100%', maxWidth: '500px', borderRadius: '10px', paddingTop: '20px', paddingBottom: '20px' }}
        >
          <h3 className="text-center text-success mb-3">Crear Cuenta</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="nombre" className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Ingrese su nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="curp" className="form-label">CURP</label>
              <input
                type="text"
                className="form-control"
                id="curp"
                placeholder="Ingrese su CURP"
                value={formData.curp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Ingrese su correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="contraseña" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="contraseña"
                placeholder="Ingrese su contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                id="telefono"
                placeholder="Opcional: Ingrese su número de teléfono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success">Registrarse</button>
              <a href='/login' className="btn btn-outline-success">Volver</a>
            </div>
          </form>
        </div>
      </div>

      {isSuccessDialogOpen && (
        <SuccessDialog
          message="Usuario Registrado exitosamente."
          onClose={() => setSuccessDialogOpen(false)} // Simplificado
        />
      )}
    </div>

  );
};

export default Register;

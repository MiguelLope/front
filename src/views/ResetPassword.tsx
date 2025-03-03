import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

const primaryColor = "#00796b";

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e:any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/verificar-codigo', {
        email,
        codigo,
        nueva_contraseña: password,
        nueva_contraseña_confirmation: confirmPassword
      });
      setMessage(response.data.message);
      setError('');
      window.location.href = "/login";
    } catch (err:any) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div>
    
      <nav className="navbar navbar-dark shadow-sm" style={{ backgroundColor: primaryColor, color: "white" }}>
        <div className="container">
        <span className="navbar-brand">Restablecer Contraseña</span>
        <button className="btn btn-light" onClick={() => navigate(-1)}>
            Regresar
          </button>
        </div>
      </nav>
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#e0f2f1" }}>
        <div className="card shadow p-4 border-0" style={{ maxWidth: '400px', borderRadius: '10px', backgroundColor: "#ffffff" }}>
          <h3 className="text-center mb-4" style={{ color: primaryColor }}>Restablecer Contraseña</h3>
          <form onSubmit={handleReset}>
            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control border-0 shadow-sm"
                style={{ backgroundColor: "#f1f8e9", color: "#000" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Código de Verificación</label>
              <input
                type="text"
                className="form-control border-0 shadow-sm"
                style={{ backgroundColor: "#f1f8e9", color: "#000" }}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                className="form-control border-0 shadow-sm"
                style={{ backgroundColor: "#f1f8e9", color: "#000" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-control border-0 shadow-sm"
                style={{ backgroundColor: "#f1f8e9", color: "#000" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {message && <div className="alert alert-success text-center">{message}</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            <button type="submit" className="btn text-white w-100 shadow-sm" style={{ backgroundColor: primaryColor }}>
              Cambiar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

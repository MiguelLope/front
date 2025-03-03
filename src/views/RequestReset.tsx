import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const primaryColor = "#00796b";

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequest = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/enviar-codigo', { email });
      setMessage(response.data.message);

      setTimeout(() => {
        if (response.data.message === "Código de verificación enviado") {
          window.location.href = "/verifycode";
        }
      }, 4000);

      setError('');
    } catch (err:any) {
      console.log(err.response);
      setError(err.response?.data?.error || 'Error al enviar el código');
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark shadow-sm" style={{ backgroundColor: primaryColor, color: "white" }}>
        <div className="container">
          <span className="navbar-brand">Recuperar Contraseña</span>
          <button className="btn btn-light" onClick={() => navigate(-1)}>
            Regresar
          </button>
        </div>
      </nav>

      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#e0f2f1" }}>
        <div className="card shadow p-4 border-0" style={{ maxWidth: '400px', borderRadius: '10px', backgroundColor: "#ffffff" }}>
          <h3 className="text-center mb-4" style={{ color: primaryColor }}>Recuperar Contraseña</h3>
          <form onSubmit={handleRequest}>
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
            {message && <div className="alert alert-success text-center">{message}</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            <button type="submit" className="btn text-white w-100 shadow-sm" style={{ backgroundColor: primaryColor }}>
              Enviar Código
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestReset;

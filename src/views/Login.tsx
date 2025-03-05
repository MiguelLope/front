// Importa los paquetes necesarios
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e:any) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      // Paso 2: Realizar la solicitud POST de login con el token CSRF
      const response = await axios.post(
        'https://back-production-3ec7.up.railway.app/api/login', 
        { email, password }, {
          headers: {
              'Content-Type': 'application/json',
          }
      }
    );
    
      // Guardar el token o los datos de la sesión
      localStorage.setItem('usr', JSON.stringify(response.data.usuario));
      window.location.href = "/";
    } catch (err:any) {
      console.log(err.response.data.message);
      setError("" + err.response.data.message);
    }
  };

  const locagionHrefRegistrer = () => {
    window.location.href = "/registrer";
  }
  const passCheck = () => {
    window.location.href = "/sendcode";
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#00796b' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
        <h3 className="text-center text-success mb-4">Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico / CURP </label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo electrónico o CURP"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-link" onClick={locagionHrefRegistrer}>¿No tienes cuenta? Registrate</button>
            <button type="button" className="btn btn-link" onClick={passCheck}>¿Olvidaste tu contraseña? </button>
            
            <button type="submit" className="btn btn-success">Iniciar Sesión</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

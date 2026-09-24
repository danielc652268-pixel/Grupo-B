import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { cargarUsuario } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("Sesión iniciada:", respuesta.data);
      await cargarUsuario();
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Correo o contraseña incorrectos");
      } else {
        setError("No se pudo conectar con el servidor");
      }
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Iniciar sesión</h1>

        <p className="login-subtitle">
          Ingresa tus datos para continuar
        </p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            Iniciar sesión
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { avisarExito, avisarError } from "../../utils/notificaciones";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { cargarUsuario } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );
      await cargarUsuario();
      avisarExito("Sesión iniciada");
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        avisarError("Correo o contraseña incorrectos");
      } else {
        avisarError("No se pudo conectar con el servidor");
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

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegistering) {
        if (!username.trim()) { setError("Ingresa un nombre de usuario"); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: username });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("El correo ya está registrado");
      else if (err.code === "auth/wrong-password") setError("Contraseña incorrecta");
      else if (err.code === "auth/user-not-found") setError("Usuario no encontrado");
      else if (err.code === "auth/weak-password") setError("La contraseña debe tener al menos 6 caracteres");
      else setError("Error al iniciar sesión");
    }
  };

  const C = {
    green: "#2e7d32", greenLight: "#4caf50", greenPale: "#e8f5e9",
    greenMid: "#a5d6a7", bg: "#f1f8f1", panel: "#ffffff",
    border: "#c8e6c9", dim: "#757575", mid: "#424242",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 32px", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(46,125,50,0.10)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🛡️</div>
          <h1 style={{ color: C.green, fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: "0.05em" }}>
            CYBER<span style={{ color: "#1b5e20" }}>ESCUDO</span>
          </h1>
          <p style={{ color: C.dim, fontSize: 11, letterSpacing: "0.3em", marginTop: 4 }}>FAE</p>
        </div>
        <h2 style={{ color: C.mid, fontSize: 16, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
          {isRegistering ? "Crear cuenta" : "Iniciar sesión"}
        </h2>
        {isRegistering && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", margin: "0 0 12px", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI', Arial, sans-serif" }}
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", margin: "0 0 12px", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI', Arial, sans-serif" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{ width: "100%", margin: "0 0 16px", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI', Arial, sans-serif" }}
        />
        {error && <p style={{ color: "#c62828", fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</p>}
        <button onClick={handleSubmit} style={{ width: "100%", background: `linear-gradient(135deg,#2e7d32,#4caf50)`, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
          {isRegistering ? "Registrarse" : "Entrar"}
        </button>
        <p onClick={() => { setIsRegistering(!isRegistering); setError(""); }} style={{ cursor: "pointer", color: C.green, fontSize: 12, textAlign: "center", marginTop: 16, fontWeight: 600 }}>
          {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </p>
      </div>
    </div>
  );
}
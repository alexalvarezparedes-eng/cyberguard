import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SELLO_SRC = "data:image/jpeg;base64,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";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const C = {
    green: "#2e7d32",
    greenLight: "#4caf50",
    greenPale: "#e8f5e9",
    greenMid: "#a5d6a7",
    bg: "#f1f8f1",
    panel: "#ffffff",
    border: "#c8e6c9",
    dim: "#757575",
    mid: "#424242",
    accent: "#1b5e20",
    shadow: "0 2px 8px rgba(46,125,50,0.10)",
  };

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Completa todos los campos"); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!name) { setError("Ingresa tu nombre"); setLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      }
      onLogin();
    } catch (e) {
      const msgs = {
        "auth/user-not-found": "Usuario no encontrado",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/email-already-in-use": "El correo ya está registrado",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
        "auth/invalid-email": "Correo inválido",
        "auth/invalid-credential": "Credenciales incorrectas",
      };
      setError(msgs[e.code] || "Error de autenticación");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1b5e20 0%, #2e7d32 40%, #1a3a1a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(76,175,80,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: 20,
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        padding: "40px 36px",
        width: "100%",
        maxWidth: 400,
        position: "relative",
      }}>
        {/* Sello FAE */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={SELLO_SRC}
            alt="Sello Fuerza Aérea Ecuatoriana"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 16px rgba(46,125,50,0.3)",
              border: "3px solid #c8e6c9",
            }}
          />
        </div>

        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 900,
            margin: "0 0 4px",
            color: C.green,
            letterSpacing: "0.05em",
          }}>
            CYBER<span style={{ color: C.accent }}>ESCUDO</span>
            <span style={{ color: C.dim, fontSize: "0.45em", display: "block", letterSpacing: "0.3em", fontWeight: 600, marginTop: 2 }}>
              FUERZA AÉREA ECUATORIANA
            </span>
          </h1>
          <p style={{ color: C.dim, fontSize: 12, margin: 0 }}>Entrenamiento en Seguridad Digital</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 10, overflow: "hidden", border: `1.5px solid ${C.border}` }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer",
                background: mode === m ? C.green : "#f9fbe7",
                color: mode === m ? "#fff" : C.dim,
                fontWeight: 700, fontSize: 13,
                fontFamily: "'Segoe UI', Arial, sans-serif",
                transition: "all 0.2s",
              }}>
              {m === "login" ? "🔐 Ingresar" : "✍️ Registrarse"}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <div>
              <label style={{ color: C.mid, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>Nombre completo</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Ej: Capitán García"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: `1.5px solid ${C.border}`, fontSize: 13,
                  color: C.mid, outline: "none", boxSizing: "border-box",
                  background: "#fafff9",
                }}
              />
            </div>
          )}
          <div>
            <label style={{ color: C.mid, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>Correo electrónico</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="usuario@fae.mil.ec"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: `1.5px solid ${C.border}`, fontSize: 13,
                color: C.mid, outline: "none", boxSizing: "border-box",
                background: "#fafff9",
              }}
            />
          </div>
          <div>
            <label style={{ color: C.mid, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>Contraseña</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: `1.5px solid ${C.border}`, fontSize: 13,
                color: C.mid, outline: "none", boxSizing: "border-box",
                background: "#fafff9",
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#ffebee", border: "1px solid #ef9a9a",
              borderRadius: 8, padding: "9px 14px",
              color: "#c62828", fontSize: 12, fontWeight: 600,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? "#a5d6a7" : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: "#fff", border: "none", borderRadius: 10,
              padding: "13px", fontSize: 14, fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              boxShadow: "0 3px 10px rgba(46,125,50,0.35)",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
            }}>
            {loading ? "⏳ Procesando..." : mode === "login" ? "🛡️ INGRESAR AL SISTEMA" : "✅ CREAR CUENTA"}
          </button>
        </div>

        <p style={{ textAlign: "center", color: C.dim, fontSize: 11, marginTop: 20, marginBottom: 0 }}>
          🔒 Sistema de Entrenamiento en Ciberseguridad · FAE
        </p>
      </div>
    </div>
  );
}

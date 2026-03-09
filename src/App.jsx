import { useState, useEffect, useRef } from "react";

const SCENARIOS = [
  {
    id: 1, category: "Phishing", icon: "🎣", difficulty: "FÁCIL",
    title: "Email bancario sospechoso",
    description: "Recibes este email en tu bandeja de entrada:",
    content: `De: soporte@banco-seguro.net
Asunto: ⚠️ URGENTE: Su cuenta será bloqueada en 24h

Estimado cliente,
Hemos detectado actividad inusual. Para evitar el 
bloqueo INMEDIATO haga clic aquí:
→ http://banco-seguro-verificacion.tk/login

Ingrese sus credenciales para confirmar su identidad.
Equipo de Seguridad`,
    question: "¿Qué harías?",
    options: [
      { text: "Hacer clic en el enlace y verificar mi cuenta", correct: false },
      { text: "Llamar directamente al banco usando el número oficial", correct: true },
      { text: "Responder el email pidiendo más información", correct: false },
      { text: "Ignorarlo completamente sin avisar a nadie", correct: false },
    ],
    explanation: "Este es un ataque de phishing clásico. Señales de alerta: dominio .tk sospechoso, urgencia artificial, URL diferente al banco real. Siempre llama al número oficial impreso en tu tarjeta.",
    redFlags: ["Dominio .tk sospechoso", "Urgencia artificial", "URL diferente al banco", "Solicita credenciales por email"],
    points: 100,
  },
  {
    id: 2, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL",
    title: "Elige tu contraseña bancaria",
    description: "Necesitas crear una contraseña para tu cuenta bancaria. ¿Cuál elegirías?",
    content: null,
    question: "¿Cuál es la contraseña más segura?",
    options: [
      { text: "juan1990", correct: false },
      { text: "P@ssw0rd", correct: false },
      { text: "Tr3n-Azul#Nube!47", correct: true },
      { text: "123456789", correct: false },
    ],
    explanation: "Una contraseña fuerte combina mayúsculas, minúsculas, números y símbolos, tiene más de 12 caracteres y NO contiene datos personales. Las frases de contraseña como 'Tr3n-Azul#Nube!47' son más seguras y fáciles de recordar.",
    redFlags: ["Nombre propio", "Año de nacimiento", "Palabras comunes", "Solo números secuenciales"],
    points: 100,
  },
  {
    id: 3, category: "WiFi Público", icon: "📶", difficulty: "MEDIO",
    title: "Redes en la cafetería",
    description: "Estás en una cafetería y ves estas redes disponibles:",
    content: `📶 CaféDelCentro_FREE         (Sin contraseña)
📶 CaféDelCentro_WiFi         (Contraseña requerida)
📶 FREE_INTERNET_FAST         (Sin contraseña)
📶 iPhone de María            (Hotspot personal)`,
    question: "Necesitas hacer una transferencia bancaria urgente. ¿Qué haces?",
    options: [
      { text: "Conéctate a CaféDelCentro_FREE para hacerla rápido", correct: false },
      { text: "Usa FREE_INTERNET_FAST, suena confiable", correct: false },
      { text: "Usa tus datos móviles o una VPN antes de conectarte", correct: true },
      { text: "Preguntas la contraseña al cajero y la usas", correct: false },
    ],
    explanation: "Las redes WiFi públicas son peligrosas para transacciones sensibles. Los atacantes pueden crear redes falsas (Evil Twin) o interceptar tráfico (Man-in-the-Middle). Usa siempre datos móviles para operaciones bancarias, o una VPN confiable.",
    redFlags: ["Redes sin contraseña", "Nombres genéricos 'FREE'", "Transacciones sensibles en WiFi público", "Sin verificar autenticidad"],
    points: 150,
  },
  {
    id: 4, category: "Ingeniería Social", icon: "🎭", difficulty: "MEDIO",
    title: "Llamada de 'Microsoft'",
    description: "Recibes una llamada inesperada:",
    content: `"Buenas tardes, soy técnico de Microsoft. 
Hemos detectado que su computadora está infectada 
con un virus peligroso y envía datos a criminales.

Para solucionarlo necesitamos que descargue este 
programa y nos dé acceso remoto. Es gratis y urgente.
¿Puede hacerlo ahora mismo?"`,
    question: "¿Qué haces?",
    options: [
      { text: "Seguir las instrucciones, Microsoft es confiable", correct: false },
      { text: "Pedir su número y devolver la llamada", correct: false },
      { text: "Colgar inmediatamente sin seguir ninguna instrucción", correct: true },
      { text: "Descargar el programa pero no dar contraseñas", correct: false },
    ],
    explanation: "Microsoft, Google, tu banco y otras empresas NUNCA te llaman sin aviso para decirte que tienes un virus. Este es un scam de soporte técnico falso. Si cedes el acceso remoto, pueden robar datos, instalar malware o pedirte dinero.",
    redFlags: ["Llamada no solicitada", "Urgencia y miedo", "Solicitud de acceso remoto", "Empresas legítimas no llaman así"],
    points: 150,
  },
  {
    id: 5, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO",
    title: "Mensaje de un 'amigo'",
    description: "Tu amigo Carlos te manda este mensaje por WhatsApp:",
    content: `Carlos 💬:
"Oye! Estoy en un apuro, perdí mi billetera 
de viaje. ¿Me puedes prestar $50 por Bizum? 
Te los devuelvo en cuanto llegue a casa.

Es muy urgente, estoy varado. 
Por favor no le digas nada a mis padres 😬"`,
    question: "¿Qué haces?",
    options: [
      { text: "Le envías el dinero inmediatamente, es tu amigo", correct: false },
      { text: "Llamas a Carlos al número que ya tenías guardado para verificar", correct: true },
      { text: "Le pides su número de Bizum y le envías", correct: false },
      { text: "Le preguntas por WhatsApp más detalles antes de enviar", correct: false },
    ],
    explanation: "Este es el 'scam del amigo en apuros'. Los atacantes hackean o clonan cuentas de WhatsApp para pedir dinero. SIEMPRE llama al número real de tu contacto para verificar antes de enviar dinero.",
    redFlags: ["Urgencia repentina", "Petición de dinero", "'No le digas a nadie'", "Solo contacto por texto"],
    points: 150,
  },
  {
    id: 6, category: "Actualizaciones", icon: "🔄", difficulty: "FÁCIL",
    title: "Actualización pendiente",
    description: "Llevas 6 meses ignorando las actualizaciones. Tu amigo dice:",
    content: `"Yo nunca actualizo el sistema, solo 
sirve para hacer el equipo más lento. 
Los hackers igual van a entrar si quieren, 
las actualizaciones no sirven de nada."`,
    question: "¿Tu amigo tiene razón?",
    options: [
      { text: "Sí, las actualizaciones solo enlentecen el equipo", correct: false },
      { text: "No, las actualizaciones cierran vulnerabilidades críticas de seguridad", correct: true },
      { text: "Depende, solo hay que instalar las de seguridad", correct: false },
      { text: "Mejor esperar un mes para ver si tienen bugs", correct: false },
    ],
    explanation: "El 60% de las brechas de seguridad explotan vulnerabilidades con parches disponibles que no fueron instalados. Activa las actualizaciones automáticas y aplícalas dentro de las primeras 24-48 horas.",
    redFlags: ["Ignorar actualizaciones", "Creer que no sirven", "Posponer indefinidamente", "Solo actualizar apps visibles"],
    points: 100,
  },
  {
    id: 7, category: "Malware", icon: "💀", difficulty: "DIFÍCIL",
    title: "Archivo adjunto del trabajo",
    description: "Recibes este email de tu jefe (o eso parece):",
    content: `De: director@tu-empresa.com
Asunto: Revisar URGENTE - Contrato confidencial

Hola,
Necesito que revises este contrato antes de las 3pm.
Es confidencial, no lo compartas con nadie todavía.

[Contrato_Final_2024.pdf.exe] (2.3 MB)

Gracias, Roberto Méndez - Director General`,
    question: "¿Qué haces?",
    options: [
      { text: "Abrir el archivo, viene de tu jefe directo", correct: false },
      { text: "Llamar a tu jefe por teléfono para verificar antes de abrir", correct: true },
      { text: "Abrirlo pero en modo seguro", correct: false },
      { text: "Reenviarlo a tu correo personal para revisarlo en casa", correct: false },
    ],
    explanation: "El archivo '.pdf.exe' es un ejecutable malicioso disfrazado de PDF. Señales: extensión doble, urgencia + confidencialidad. Siempre verifica por teléfono con tu jefe antes de abrir adjuntos inesperados.",
    redFlags: ["Extensión .exe disfrazada", "Urgencia + confidencialidad", "Verificar solo por email", "Nombre genérico del archivo"],
    points: 200,
  },
  {
    id: 8, category: "2FA", icon: "🔒", difficulty: "DIFÍCIL",
    title: "Código de verificación inesperado",
    description: "Recibes este SMS mientras estás en casa:",
    content: `SMS recibido - 14:32:
"Tu código de verificación de Gmail es: 847291
No compartas este código con nadie."

Segundos después alguien te llama:
"Hola, soy del soporte de Google. Detectamos un 
intento de hackeo. Necesito ese código que acabas 
de recibir para proteger tu cuenta."`,
    question: "¿Qué haces?",
    options: [
      { text: "Das el código, es soporte oficial de Google", correct: false },
      { text: "Colgar, NUNCA compartes un código 2FA con nadie", correct: true },
      { text: "Pides más datos para verificar que es Google", correct: false },
      { text: "Das solo los primeros 3 dígitos como prueba", correct: false },
    ],
    explanation: "El atacante ya tiene tu contraseña y solo necesita el código 2FA. Google, Apple, tu banco u CUALQUIER empresa NUNCA te pedirá un código de verificación por teléfono. El SMS mismo dice 'No compartas este código'.",
    redFlags: ["Solicitud del código 2FA", "Llamada inmediata tras el SMS", "Urgencia de 'proteger tu cuenta'", "Nadie legítimo pide códigos 2FA"],
    points: 200,
  },
];

const TIPS = [
  { icon: "🔑", title: "Gestor de contraseñas", desc: "Usa Bitwarden o 1Password. Genera contraseñas únicas para cada sitio." },
  { icon: "📱", title: "Activa 2FA siempre", desc: "Doble factor en email, banco y redes sociales." },
  { icon: "🔄", title: "Actualiza todo", desc: "SO, apps y router. Las actualizaciones cierran vulnerabilidades reales." },
  { icon: "🔒", title: "HTTPS obligatorio", desc: "Verifica el candado antes de ingresar contraseñas." },
  { icon: "💾", title: "Regla 3-2-1 de backups", desc: "3 copias, 2 medios diferentes, 1 fuera de casa." },
  { icon: "🧠", title: "Pausa ante la urgencia", desc: "Los atacantes usan prisa para que actúes sin pensar." },
  { icon: "🎣", title: "Verifica el remitente", desc: "Pasa el cursor sobre links antes de clicar." },
  { icon: "🛡️", title: "VPN en redes públicas", desc: "Cifra tu tráfico en cafés, aeropuertos y hoteles." },
];

export default function CyberGuard() {
  const [screen, setScreen] = useState("home");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [glitch, setGlitch] = useState(false);
  const [filter, setFilter] = useState("TODOS");
  const [chatHistory, setChatHistory] = useState([]);
  const [userQ, setUserQ] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const chatEndRef = useRef(null);

  const CATEGORIES = ["TODOS", ...Array.from(new Set(SCENARIOS.map(s => s.category)))];
  const filteredScenarios = filter === "TODOS" ? SCENARIOS : SCENARIOS.filter(s => s.category === filter);

  useEffect(() => {
    const iv = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 150); }, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, aiLoading]);

  const scenario = filteredScenarios[currentIdx];

  const handleAnswer = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const correct = scenario.options[idx].correct;
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    if (newStreak > bestStreak) setBestStreak(newStreak);
    if (correct) {
      setScore(s => s + 1);
      const bonus = newStreak >= 3 ? Math.floor(scenario.points * 0.5) : 0;
      setTotalPoints(p => p + scenario.points + bonus);
      if (newStreak === 3) { setShowBadge(true); setTimeout(() => setShowBadge(false), 3000); }
    }
    setAnswers(a => [...a, { scenarioId: scenario.id, correct, category: scenario.category }]);
  };

  const nextScenario = () => {
    if (currentIdx < filteredScenarios.length - 1) {
      setCurrentIdx(i => i + 1); setSelected(null); setShowResult(false);
    } else { setScreen("results"); }
  };

  const resetQuiz = () => {
    setCurrentIdx(0); setSelected(null); setShowResult(false);
    setScore(0); setTotalPoints(0); setStreak(0); setBestStreak(0); setAnswers([]);
  };

  const askAI = async () => {
    if (!userQ.trim() || aiLoading) return;
    const question = userQ.trim();
    setUserQ("");
    setChatHistory(h => [...h, { role: "user", text: question }]);
    setAiLoading(true);
    try {
      const res = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `Eres CyberGuard AI, experto en ciberseguridad amigable y directo. Educas sobre seguridad digital de forma clara y práctica. Responde en español, conciso (máximo 3 párrafos). Usa emojis ocasionalmente.`,
    messages: [
      ...chatHistory.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
      { role: "user", content: question },
    ],
  }),
});
      const data = await res.json();
      const answer = data.content?.map(b => b.text || "").join("") || "No pude procesar tu pregunta.";
      setChatHistory(h => [...h, { role: "assistant", text: answer }]);
    } catch {
      setChatHistory(h => [...h, { role: "assistant", text: "⚠️ Error de conexión. Intenta de nuevo." }]);
    }
    setAiLoading(false);
  };

  const C = { green: "#00ffc8", red: "#ff0040", bg: "#060b10", panel: "rgba(0,255,200,0.04)", border: "rgba(0,255,200,0.12)", dim: "#4a7a90", mid: "#8ab0c4" };
  const wrap = { minHeight: "100vh", background: C.bg, color: "#e0f0ff", fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" };
  const grid = { position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize: "48px 48px" };
  const scan = { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)" };
  const cont = { maxWidth: 780, margin: "0 auto", padding: "20px 16px", position: "relative", zIndex: 2 };
  const btn = (variant = "primary", extra = {}) => ({ fontFamily: "'Courier New', monospace", cursor: "pointer", border: "none", borderRadius: 6, letterSpacing: "0.1em", fontWeight: 700, transition: "all 0.2s", ...(variant === "primary" ? { background: `linear-gradient(135deg,${C.green},#00b8a0)`, color: C.bg, padding: "12px 28px", fontSize: 13 } : {}), ...(variant === "ghost" ? { background: "transparent", color: C.green, border: `1px solid ${C.border}`, padding: "10px 20px", fontSize: 12 } : {}), ...(variant === "dim" ? { background: "transparent", color: C.dim, border: `1px solid rgba(74,122,144,0.2)`, padding: "8px 16px", fontSize: 11 } : {}), ...extra });
  const diffColor = (d) => d === "FÁCIL" ? "#00ffc8" : d === "MEDIO" ? "#ffc800" : "#ff0040";

  if (screen === "home") return (
    <div style={wrap}>
      <div style={grid} /><div style={scan} />
      <div style={cont}>
        <div style={{ textAlign: "center", padding: "36px 0 24px" }}>
          <div style={{ fontSize: 56, filter: glitch ? "hue-rotate(90deg) brightness(2)" : "none", transition: "filter 0.1s", marginBottom: 8 }}>🛡️</div>
          <h1 style={{ fontSize: "clamp(26px,7vw,54px)", fontWeight: 900, letterSpacing: "0.12em", margin: "0 0 6px", color: C.green, textShadow: glitch ? `3px 0 ${C.red},-3px 0 ${C.green}` : `0 0 40px ${C.green}80`, transition: "all 0.1s" }}>CYBER<span style={{ color: C.red }}>GUARD</span></h1>
          <p style={{ color: C.dim, fontSize: 11, letterSpacing: "0.35em", marginBottom: 6 }}>ENTRENAMIENTO EN SEGURIDAD DIGITAL</p>
          <p style={{ color: "#2a5a6a", fontSize: 12, marginBottom: 32 }}>8 escenarios reales · IA experta · Sistema de puntos</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 32 }}>
            {[{ icon: "🎯", n: "8", label: "Escenarios" }, { icon: "🏆", n: "1050", label: "Puntos max" }, { icon: "🤖", n: "IA", label: "Experta 24/7" }, { icon: "📊", n: "5", label: "Categorías" }].map(x => (
              <div key={x.label} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 10px" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{x.icon}</div>
                <div style={{ color: C.green, fontSize: 20, fontWeight: 900 }}>{x.n}</div>
                <div style={{ color: C.dim, fontSize: 10, letterSpacing: "0.2em" }}>{x.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <button style={btn("primary")} onClick={() => { resetQuiz(); setFilter("TODOS"); setScreen("quiz"); }}>▶ INICIAR ENTRENAMIENTO</button>
            <button style={btn("ghost")} onClick={() => setScreen("selector")}>📋 ELEGIR CATEGORÍA</button>
            <button style={btn("ghost")} onClick={() => setScreen("chat")}>🤖 CONSULTAR IA</button>
          </div>
        </div>
        <div style={{ background: "rgba(255,200,0,0.04)", border: "1px solid rgba(255,200,0,0.15)", borderRadius: 8, padding: "14px 18px", marginBottom: 12 }}>
          <div style={{ color: "#ffc800", fontSize: 10, letterSpacing: "0.3em", marginBottom: 8 }}>💡 TIP DEL DÍA</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{TIPS[tipIdx].icon}</span>
            <div>
              <div style={{ color: "#c0e0f0", fontSize: 13, fontWeight: 700 }}>{TIPS[tipIdx].title}</div>
              <div style={{ color: C.dim, fontSize: 11, marginTop: 3 }}>{TIPS[tipIdx].desc}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8 }}>
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => { resetQuiz(); setFilter(s.category); setCurrentIdx(0); setScreen("quiz"); }} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 10px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 9, color: diffColor(s.difficulty), border: `1px solid ${diffColor(s.difficulty)}40`, padding: "2px 6px", borderRadius: 3 }}>{s.difficulty}</span>
              </div>
              <div style={{ color: "#90c0d4", fontSize: 11, fontWeight: 700 }}>{s.title}</div>
              <div style={{ color: C.dim, fontSize: 10, marginTop: 2 }}>{s.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (screen === "selector") return (
    <div style={wrap}>
      <div style={grid} /><div style={scan} />
      <div style={cont}>
        <div style={{ paddingTop: 20, marginBottom: 24 }}><button style={btn("dim")} onClick={() => setScreen("home")}>← VOLVER</button></div>
        <h2 style={{ color: C.green, fontSize: 20, letterSpacing: "0.2em", marginBottom: 8 }}>SELECCIONAR CATEGORÍA</h2>
        <p style={{ color: C.dim, fontSize: 12, marginBottom: 24 }}>Elige el área en la que quieres entrenar</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {CATEGORIES.map(cat => {
            const s = cat === "TODOS" ? SCENARIOS : SCENARIOS.filter(x => x.category === cat);
            return (
              <button key={cat} onClick={() => { resetQuiz(); setFilter(cat); setScreen("quiz"); }} style={{ ...btn("ghost", {}), textAlign: "left", padding: "18px", borderRadius: 8, width: "100%" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.map(x => x.icon).slice(0, 3).join(" ")}</div>
                <div style={{ color: C.green, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{cat}</div>
                <div style={{ color: C.dim, fontSize: 11 }}>{s.length} escenario{s.length > 1 ? "s" : ""}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (screen === "quiz" && scenario) {
    const progress = (currentIdx / filteredScenarios.length) * 100;
    const isCorrect = showResult && scenario.options[selected]?.correct;
    return (
      <div style={wrap}>
        <div style={grid} /><div style={scan} />
        {showBadge && (
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 100, textAlign: "center", background: "rgba(0,0,0,0.9)", border: `2px solid ${C.green}`, borderRadius: 12, padding: "24px 40px" }}>
            <div style={{ fontSize: 48 }}>🔥</div>
            <div style={{ color: C.green, fontSize: 18, fontWeight: 900, letterSpacing: "0.2em" }}>RACHA x3</div>
            <div style={{ color: C.dim, fontSize: 12, marginTop: 4 }}>+50% puntos bonus</div>
          </div>
        )}
        <div style={cont}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, marginBottom: 16 }}>
            <button style={btn("dim")} onClick={() => setScreen("home")}>← SALIR</button>
            <div style={{ display: "flex", gap: 8 }}>
              {streak >= 2 && <div style={{ color: "#ff8c00", fontSize: 11, border: "1px solid rgba(255,140,0,0.3)", padding: "4px 10px", borderRadius: 4 }}>🔥 ×{streak}</div>}
              <div style={{ color: C.green, fontSize: 11, background: C.panel, border: `1px solid ${C.border}`, padding: "4px 12px", borderRadius: 4 }}>★ {totalPoints} pts</div>
              <div style={{ color: C.dim, fontSize: 11, padding: "4px 10px" }}>{currentIdx + 1}/{filteredScenarios.length}</div>
            </div>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 24 }}>
            <div style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: `linear-gradient(90deg,${C.green},${C.red})`, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>{scenario.icon}</span>
            <span style={{ background: "rgba(255,0,64,0.08)", border: "1px solid rgba(255,0,64,0.25)", color: "#ff6080", fontSize: 10, letterSpacing: "0.2em", padding: "3px 10px", borderRadius: 3, fontWeight: 700 }}>{scenario.category.toUpperCase()}</span>
            <span style={{ background: `${diffColor(scenario.difficulty)}10`, border: `1px solid ${diffColor(scenario.difficulty)}40`, color: diffColor(scenario.difficulty), fontSize: 10, letterSpacing: "0.2em", padding: "3px 10px", borderRadius: 3, fontWeight: 700 }}>{scenario.difficulty}</span>
            <span style={{ color: "#ffc800", fontSize: 11, marginLeft: "auto" }}>+{scenario.points} pts</span>
          </div>
          <h2 style={{ color: "#e0f0ff", fontSize: "clamp(17px,4vw,24px)", marginBottom: 8, fontWeight: 700 }}>{scenario.title}</h2>
          <p style={{ color: C.dim, fontSize: 12, marginBottom: 16 }}>{scenario.description}</p>
          {scenario.content && (
            <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,200,0.08)", borderLeft: `3px solid ${C.red}`, borderRadius: 6, padding: "14px 16px", marginBottom: 20, fontSize: 12, color: "#90c0d4", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
              {scenario.content}
            </div>
          )}
          <p style={{ color: C.green, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>{scenario.question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {scenario.options.map((opt, idx) => {
              let border = C.border, bg = C.panel, color = C.mid;
              if (showResult) {
                if (opt.correct) { border = C.green; bg = "rgba(0,255,200,0.07)"; color = C.green; }
                else if (selected === idx) { border = C.red; bg = "rgba(255,0,64,0.07)"; color = "#ff4060"; }
              }
              return (
                <button key={idx} onClick={() => handleAnswer(idx)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: "11px 14px", textAlign: "left", color, fontSize: 12, cursor: showResult ? "default" : "pointer", fontFamily: "'Courier New',monospace", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ opacity: 0.4, flexShrink: 0, fontSize: 10 }}>[{String.fromCharCode(65 + idx)}]</span>
                  <span style={{ flex: 1 }}>{opt.text}</span>
                  {showResult && opt.correct && <span style={{ color: C.green }}>✓</span>}
                  {showResult && selected === idx && !opt.correct && <span style={{ color: C.red }}>✗</span>}
                </button>
              );
            })}
          </div>
          {showResult && (
            <div style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${isCorrect ? "rgba(0,255,200,0.25)" : "rgba(255,0,64,0.25)"}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ color: isCorrect ? C.green : "#ff4060", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                {isCorrect ? `✅ ¡Correcto! +${scenario.points}${streak >= 3 ? ` +${Math.floor(scenario.points * 0.5)} bonus 🔥` : ""} pts` : "❌ Incorrecto"}
              </div>
              <p style={{ color: C.mid, fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{scenario.explanation}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {scenario.redFlags.map(flag => (
                  <span key={flag} style={{ background: "rgba(255,0,64,0.07)", border: "1px solid rgba(255,0,64,0.2)", color: "#ff6080", fontSize: 10, padding: "3px 8px", borderRadius: 3 }}>⚠ {flag}</span>
                ))}
              </div>
            </div>
          )}
          {showResult && (
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...btn("primary"), flex: 1 }} onClick={nextScenario}>{currentIdx < filteredScenarios.length - 1 ? "SIGUIENTE →" : "VER RESULTADOS →"}</button>
              <button style={btn("ghost")} onClick={() => setScreen("chat")}>🤖 IA</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "results") {
    const pct = (score / filteredScenarios.length) * 100;
    const level = pct >= 75 ? { label: "EXPERTO", color: C.green, emoji: "🏆" } : pct >= 50 ? { label: "INTERMEDIO", color: "#ffc800", emoji: "🎯" } : { label: "PRINCIPIANTE", color: C.red, emoji: "⚠️" };
    const byCategory = {};
    answers.forEach(a => {
      if (!byCategory[a.category]) byCategory[a.category] = { correct: 0, total: 0 };
      byCategory[a.category].total++;
      if (a.correct) byCategory[a.category].correct++;
    });
    return (
      <div style={wrap}>
        <div style={grid} /><div style={scan} />
        <div style={cont}>
          <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{level.emoji}</div>
            <div style={{ fontSize: "clamp(48px,12vw,80px)", fontWeight: 900, color: level.color, lineHeight: 1 }}>{score}/{filteredScenarios.length}</div>
            <div style={{ display: "inline-block", background: `${level.color}12`, border: `1px solid ${level.color}35`, color: level.color, padding: "5px 18px", borderRadius: 4, fontSize: 11, letterSpacing: "0.3em", fontWeight: 700, margin: "12px 0 8px" }}>NIVEL: {level.label}</div>
            <div style={{ color: C.green, fontSize: 20, fontWeight: 900, marginBottom: 4 }}>★ {totalPoints} puntos</div>
            {bestStreak >= 2 && <div style={{ color: "#ff8c00", fontSize: 12 }}>🔥 Mejor racha: ×{bestStreak}</div>}
          </div>
          {Object.keys(byCategory).length > 0 && (
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <div style={{ color: C.dim, fontSize: 10, letterSpacing: "0.3em", marginBottom: 14 }}>RENDIMIENTO POR CATEGORÍA</div>
              {Object.entries(byCategory).map(([cat, data]) => (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: C.mid, fontSize: 11 }}>{cat}</span>
                    <span style={{ color: data.correct === data.total ? C.green : C.red, fontSize: 11 }}>{data.correct}/{data.total}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${(data.correct / data.total) * 100}%`, background: data.correct === data.total ? C.green : "#ffc800" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button style={btn("primary")} onClick={() => { resetQuiz(); setScreen("quiz"); }}>↺ REPETIR</button>
            <button style={btn("ghost")} onClick={() => setScreen("selector")}>📋 OTRA CATEGORÍA</button>
            <button style={btn("ghost")} onClick={() => setScreen("chat")}>🤖 CONSULTAR IA</button>
            <button style={btn("dim")} onClick={() => { resetQuiz(); setScreen("home"); }}>⌂ INICIO</button>
          </div>
        </div>
      </div>
    );
  }

  const QUICK_Q = ["¿Cómo sé si me hackearon?", "¿Qué VPN me recomiendas?", "¿Cómo protejo mi WhatsApp?", "¿Es seguro el WiFi de mi trabajo?", "¿Qué hago si caí en phishing?"];
  return (
    <div style={{ ...wrap, display: "flex", flexDirection: "column", maxHeight: "100vh" }}>
      <div style={grid} /><div style={scan} />
      <div style={{ ...cont, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 14, flexShrink: 0 }}>
          <button style={btn("dim", { padding: "6px 12px" })} onClick={() => setScreen("home")}>←</button>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <div style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>CyberGuard AI</div>
            <div style={{ color: "#2a6a50", fontSize: 9, letterSpacing: "0.25em" }}>● EN LÍNEA</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
          {chatHistory.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
              <div style={{ color: "#2a4a5a", fontSize: 11, marginBottom: 16 }}>PREGUNTAS FRECUENTES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, maxWidth: 400, margin: "0 auto" }}>
                {QUICK_Q.map(q => (
                  <button key={q} onClick={() => setUserQ(q)} style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.mid, borderRadius: 6, padding: "9px 14px", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "'Courier New',monospace" }}>💬 {q}</button>
                ))}
              </div>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "84%", background: msg.role === "user" ? "rgba(0,255,200,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${msg.role === "user" ? "rgba(0,255,200,0.18)" : "rgba(255,255,255,0.05)"}`, borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 14px", fontSize: 12, lineHeight: 1.7, color: msg.role === "user" ? "#a0e8d0" : C.mid, whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ display: "flex", gap: 5, padding: "8px 4px", alignItems: "center" }}>
              <span style={{ color: C.dim, fontSize: 11 }}>Analizando</span>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: `pulse 1s ${i * 0.2}s infinite` }} />)}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, paddingBottom: 12, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={userQ} onChange={e => setUserQ(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && askAI()} placeholder="Pregunta sobre ciberseguridad..." style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 14px", color: "#e0f0ff", fontSize: 12, outline: "none", fontFamily: "'Courier New',monospace" }} />
            <button onClick={askAI} disabled={aiLoading || !userQ.trim()} style={{ ...btn("primary", { padding: "10px 18px" }), opacity: aiLoading || !userQ.trim() ? 0.4 : 1 }}>→</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
    </div>
  );
}

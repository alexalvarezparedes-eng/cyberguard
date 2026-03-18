import { useState, useEffect, useRef } from "react";

// Aleatorizar array
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
import Login from "./Login";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { supabase } from "./supabase";
const SELLO_JECIB = "data:image/jpeg;base64,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";
const SCENARIOS = [
  // PHISHING
  {
    id: 1, category: "Phishing", icon: "🎣", difficulty: "FÁCIL",
    title: "Email bancario sospechoso",
    description: "Recibes este email en tu bandeja de entrada:",
    content: `De: soporte@bancopichincha.net\nAsunto: ⚠️ URGENTE: Su cuenta será bloqueada en 24h\n\nEstimado cliente,\nHemos detectado actividad inusual. Para evitar el \nbloqueo INMEDIATO haga clic aquí:\n→ http://bancopichincha-verificacion.tk/login\n\nIngrese sus credenciales para confirmar su identidad.\nEquipo de Seguridad`,
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
    id: 9, category: "Phishing", icon: "🎣", difficulty: "MEDIO",
    title: "Premio falso de Amazon",
    description: "Recibes este email en tu correo:",
    content: `De: premios@amazon-ganadores.com\nAsunto: 🎉 ¡Felicidades! Has ganado un iPhone 15\n\nEstimado usuario,\nHas sido seleccionado como ganador de nuestro \nsorteo mensual. Tu premio: iPhone 15 Pro (128GB).\n\nPara reclamar tu premio GRATIS haz clic aquí:\n→ http://amazon-prizes-claim.xyz/winner\n\nSolo necesitas pagar $9.99 de envío.\n¡Oferta válida por 24 horas!`,
    question: "¿Qué haces?",
    options: [
      { text: "Haces clic y pagas el envío, es solo $9.99", correct: false },
      { text: "Buscas amazon.com directamente para verificar", correct: false },
      { text: "Eliminas el email, es una estafa de phishing", correct: true },
      { text: "Reenvías a tus amigos para que también ganen", correct: false },
    ],
    explanation: "Este es un scam clásico de 'premio falso'. Amazon nunca contacta ganadores por email con dominios externos. El cobro de 'envío' es solo para robar tu tarjeta de crédito.",
    redFlags: ["Dominio falso no oficial", "Premio no solicitado", "Pago de 'envío' sospechoso", "Urgencia de 24 horas"],
    points: 150,
  },
  {
    id: 10, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL",
    title: "Email del departamento TIC",
    description: "Recibes este mensaje del 'departamento TIC' del Ala 21:",
    content: `De: Tic-soporte@fae.mi1.com\nAsunto: Actualización obligatoria de contraseña\n\nEstimado amigo,\nPor políticas de seguridad debe actualizar su \ncontraseña antes de las 5pm de hoy.\n\nSi no lo hace, su cuenta será desactivada.\n→ https://portal-fae-update.net/password\n\nIngrese su contraseña actual y la nueva.\nDepartamento de TIC`,
    question: "¿Qué haces?",
    options: [
      { text: "Actualizas la contraseña, viene de TIC y es urgente", correct: false },
      { text: "Llamas directamente al departamento de TIC para verificar", correct: true },
      { text: "Esperas a ver si te desactivan la cuenta", correct: false },
      { text: "Cambias solo la nueva contraseña sin poner la actual", correct: false },
    ],
    explanation: "El departamento de TIC legítimo NUNCA pide tu contraseña actual por email. El dominio del remitente no coincide con el de tu empresa. Siempre verifica por teléfono o en persona.",
    redFlags: ["Dominio externo sospechoso", "Solicita contraseña actual", "Urgencia para actuar hoy", "URL no corporativa"],
    points: 200,
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
    id: 11, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO",
    title: "Reutilización de contraseñas",
    description: "Tu amigo te dice:",
    content: `"Yo uso la misma contraseña en todos lados \npero le agrego el nombre del sitio al final.\n\nPor ejemplo: MiClave123_Facebook, \nMiClave123_Gmail, MiClave123_Banco.\n\nAsí es fácil recordarlas y son diferentes \nen cada sitio. ¿No es ingenioso?"`,
    question: "¿Es una buena práctica de seguridad?",
    options: [
      { text: "Sí, es inteligente y fácil de recordar", correct: false },
      { text: "No, los hackers conocen este patrón y lo explotan fácilmente", correct: true },
      { text: "Solo si la contraseña base es muy larga", correct: false },
      { text: "Está bien siempre que no uses el mismo email", correct: false },
    ],
    explanation: "Este patrón es conocido por los hackers. Si filtran una contraseña, prueban variaciones automáticamente. Usa un gestor de contraseñas como Bitwarden para generar claves únicas y aleatorias por sitio.",
    redFlags: ["Patrón predecible", "Base común reutilizada", "Fácil de adivinar automáticamente", "Un sitio comprometido expone todos"],
    points: 150,
  },
  {
    id: 12, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL",
    title: "Gestor de contraseñas hackeado",
    description: "Tu compañero de trabajo dice:",
    content: `"¿Gestor de contraseñas? ¡Jamás! \nSi hackean ese programa, tienen TODAS \nmis contraseñas de golpe. \n\nPrefiero escribirlas en un cuaderno o \nen un archivo de Excel en mi escritorio. \nAl menos eso no se puede hackear remotamente."`,
    question: "¿Tiene razón tu compañero?",
    options: [
      { text: "Sí, concentrar todo en un gestor es muy arriesgado", correct: false },
      { text: "No, los gestores cifran localmente y son mucho más seguros", correct: true },
      { text: "El cuaderno físico es la mejor opción", correct: false },
      { text: "Excel con contraseña es suficientemente seguro", correct: false },
    ],
    explanation: "Los gestores de contraseñas cifran todo localmente antes de sincronizar. Un archivo Excel o cuaderno es mucho más vulnerable. Los gestores modernos (Bitwarden, 1Password) tienen auditorías de seguridad independientes.",
    redFlags: ["Excel sin cifrado real", "Cuaderno físico robable", "Contraseñas visibles en texto plano", "Sin protección contra acceso físico"],
    points: 200,
  },
  {
    id: 3, category: "WiFi Público", icon: "📶", difficulty: "MEDIO",
    title: "Redes en la cafetería",
    description: "Estás en una cafetería y ves estas redes disponibles:",
    content: `📶 CaféDelCentro_FREE         (Sin contraseña)\n📶 CaféDelCentro_WiFi         (Contraseña requerida)\n📶 FREE_INTERNET_FAST         (Sin contraseña)\n📶 iPhone de María            (Hotspot personal)`,
    question: "Necesitas hacer una transferencia bancaria urgente. ¿Qué haces?",
    options: [
      { text: "Conéctate a CaféDelCentro_FREE para hacerla rápido", correct: false },
      { text: "Usa FREE_INTERNET_FAST, suena confiable", correct: false },
      { text: "Usa tus datos móviles o una VPN antes de conectarte", correct: true },
      { text: "Preguntas la contraseña al cajero y la usas", correct: false },
    ],
    explanation: "Las redes WiFi públicas son peligrosas para transacciones sensibles. Los atacantes pueden crear redes falsas (Evil Twin) o interceptar tráfico. Usa siempre datos móviles para operaciones bancarias, o una VPN confiable.",
    redFlags: ["Redes sin contraseña", "Nombres genéricos 'FREE'", "Transacciones sensibles en WiFi público", "Sin verificar autenticidad"],
    points: 150,
  },
  {
    id: 13, category: "WiFi Público", icon: "📶", difficulty: "FÁCIL",
    title: "WiFi del aeropuerto",
    description: "Estás en el aeropuerto esperando tu vuelo y ves estas redes:",
    content: `📶 Airport_Free_WiFi          (Sin contraseña)\n📶 Aeropuerto_Oficial_GYE     (Sin contraseña)  \n📶 AeroNet_Pasajeros          (Contraseña: en mostrador)\n📶 Free_Fast_Airport          (Sin contraseña)`,
    question: "¿Cuál es la forma más segura de conectarte?",
    options: [
      { text: "Airport_Free_WiFi, tiene el nombre más genérico y confiable", correct: false },
      { text: "Aeropuerto_Oficial_GYE, parece la red oficial", correct: false },
      { text: "Preguntas en el mostrador la red oficial y usas VPN", correct: true },
      { text: "Cualquiera sirve si solo revisas redes sociales", correct: false },
    ],
    explanation: "En aeropuertos es común crear redes falsas que imitan nombres oficiales. Siempre verifica la red en el mostrador oficial y activa una VPN. Incluso redes sociales pueden exponer tu sesión.",
    redFlags: ["Nombres que imitan oficiales", "Sin verificación presencial", "Conexión sin VPN", "Confianza por nombre familiar"],
    points: 100,
  },
  {
    id: 14, category: "WiFi Público", icon: "📶", difficulty: "DIFÍCIL",
    title: "Ataque Evil Twin en hotel",
    description: "Estás en un hotel de negocios y ves en tu laptop:",
    content: `📶 HotelPlaza_Guest           (Contraseña: plaza2024)\n📶 HotelPlaza_Guest           (Sin contraseña - más señal)\n\nAmbas redes tienen el mismo nombre pero \nuna tiene más señal y no requiere contraseña.\nTu laptop se conecta automáticamente a la \nde mayor señal.`,
    question: "¿Qué está pasando y qué haces?",
    options: [
      { text: "Nada raro, el hotel tiene dos puntos de acceso", correct: false },
      { text: "Te quedas conectado, más señal es mejor", correct: false },
      { text: "Es un ataque Evil Twin, te desconectas y usas datos móviles", correct: true },
      { text: "Cambias a la red con contraseña solo para el banco", correct: false },
    ],
    explanation: "Dos redes con el mismo nombre es señal clásica de ataque Evil Twin. El atacante crea una red falsa con más señal para que te conectes automáticamente e interceptar todo tu tráfico.",
    redFlags: ["Mismo nombre, diferente seguridad", "Mayor señal sospechosa", "Conexión automática sin contraseña", "Red duplicada en mismo lugar"],
    points: 200,
  },
  {
    id: 4, category: "Ingeniería Social", icon: "🎭", difficulty: "MEDIO",
    title: "Llamada de 'Microsoft'",
    description: "Recibes una llamada inesperada:",
    content: `"Buenas tardes, soy técnico de Microsoft. \nHemos detectado que su computadora está infectada \ncon un virus peligroso y envía datos a criminales.\n\nPara solucionarlo necesitamos que descargue este \nprograma y nos dé acceso remoto. Es gratis y urgente.\n¿Puede hacerlo ahora mismo?"`,
    question: "¿Qué haces?",
    options: [
      { text: "Seguir las instrucciones, Microsoft es confiable", correct: false },
      { text: "Pedir su número y devolver la llamada", correct: false },
      { text: "Colgar inmediatamente sin seguir ninguna instrucción", correct: true },
      { text: "Descargar el programa pero no dar contraseñas", correct: false },
    ],
    explanation: "Microsoft, Google, tu banco y otras empresas NUNCA te llaman sin aviso para decirte que tienes un virus. Este es un scam de soporte técnico falso.",
    redFlags: ["Llamada no solicitada", "Urgencia y miedo", "Solicitud de acceso remoto", "Empresas legítimas no llaman así"],
    points: 150,
  },
  {
    id: 15, category: "Ingeniería Social", icon: "🎭", difficulty: "FÁCIL",
    title: "Técnico de mantenimiento",
    description: "Estás en la oficina y llega un hombre con uniforme:",
    content: `Un hombre con camiseta azul y credencial \nllega a tu oficina y dice:\n\n"Buenos días, soy pasante de mantenimiento \nde sistemas. Tengo que revisar los equipos \ndel piso. ¿Me puede dejar pasar? Es rápido, \nno le quitaré más de 5 minutos."\n\nNo tienes aviso previo de ninguna visita técnica.`,
    question: "¿Qué haces?",
    options: [
      { text: "Lo dejas pasar, tiene uniforme y credencial", correct: false },
      { text: "Lo dejas pasar pero lo vigilas de cerca", correct: false },
      { text: "Le pides que espere y llamas a seguridad o TIC para verificar", correct: true },
      { text: "Le dices que vuelva otro día", correct: false },
    ],
    explanation: "Los uniformes y credenciales son fáciles de falsificar. Esta técnica se llama 'pretexting'. Siempre verifica visitas técnicas con el departamento correspondiente antes de dar acceso.",
    redFlags: ["Sin aviso previo", "Urgencia para entrar rápido", "Credencial no verificada", "Acceso a equipos sin autorización"],
    points: 100,
  },
  {
    id: 16, category: "Ingeniería Social", icon: "🎭", difficulty: "DIFÍCIL",
    title: "El nuevo compañero de trabajo",
    description: "Un nuevo PMP se acerca a ti:",
    content: `"Hola! Soy Tnte. Corella, empecé esta semana en \nfinanzas. Necesito acceder al sistema \nurgente para un reporte del director pero \naún no me han dado mis credenciales.\n\n¿Me prestás tu usuario por 5 minutos? \nPrometo que solo veo los reportes. \nEl director está esperando y no quiero \nquedar mal en mi primera semana."`,
    question: "¿Qué haces?",
    options: [
      { text: "Le prestas el usuario, es solo 5 minutos", correct: false },
      { text: "Lo acompañas y tú haces la consulta por él", correct: false },
      { text: "Le dices que no puedes y lo diriges a TIC o RRHH", correct: true },
      { text: "Le prestas pero cambias tu contraseña después", correct: false },
    ],
    explanation: "Compartir credenciales viola políticas de seguridad y te hace responsable de sus acciones. Esta técnica usa presión social y urgencia. El camino correcto siempre es TIC o RRHH para credenciales nuevas.",
    redFlags: ["Solicitud de credenciales ajenas", "Urgencia y presión social", "Sin verificar identidad", "Acceso no autorizado al sistema"],
    points: 200,
  },
  {
    id: 5, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO",
    title: "Mensaje de un 'amigo'",
    description: "Tu amigo Carlos te manda este mensaje por WhatsApp:",
    content: `Carlos 💬:\n"Oye! Estoy en un apuro, perdí mi billetera \nde viaje. ¿Me puedes prestar $50 por DE UNA? \nTe los devuelvo en cuanto llegue a casa.\n\nEs muy urgente, estoy varado. \nPor favor no le digas nada a mis padres 😬"`,
    question: "¿Qué haces?",
    options: [
      { text: "Le envías el dinero inmediatamente, es tu amigo", correct: false },
      { text: "Llamas a Carlos al número que ya tenías guardado para verificar", correct: true },
      { text: "Le pides su número de DE UNA y le envías", correct: false },
      { text: "Le preguntas por WhatsApp más detalles antes de enviar", correct: false },
    ],
    explanation: "Este es el 'scam del amigo en apuros'. Los atacantes hackean o clonan cuentas de WhatsApp para pedir dinero. SIEMPRE llama al número real de tu contacto para verificar.",
    redFlags: ["Urgencia repentina", "Petición de dinero", "'No le digas a nadie'", "Solo contacto por texto"],
    points: 150,
  },
  {
    id: 17, category: "Redes Sociales", icon: "📱", difficulty: "FÁCIL",
    title: "Perfil duplicado en Facebook",
    description: "Recibes esta solicitud de amistad:",
    content: `Nueva solicitud de amistad de:\n👤 María González (perfil con foto tuya conocida)\n\nAl revisar el perfil ves que:\n- Solo tiene 3 fotos (las mismas que el perfil real)\n- Se creó hace 2 semanas\n- Tiene 12 amigos en común contigo\n- El perfil real de María ya era tu amiga`,
    question: "¿Qué haces?",
    options: [
      { text: "Aceptas, María habrá creado una cuenta nueva", correct: false },
      { text: "Le escribes al perfil nuevo para preguntar", correct: false },
      { text: "Contactas a María por otro medio y reportas el perfil falso", correct: true },
      { text: "Aceptas pero no interactúas con ese perfil", correct: false },
    ],
    explanation: "Este es un perfil clonado para hacer scams o recopilar información. Los atacantes copian fotos y agregan amigos en común para parecer legítimos. Siempre verifica por otro canal y reporta el perfil falso.",
    redFlags: ["Perfil recién creado", "Pocas fotos copiadas", "Ya eras amigo del perfil real", "Amigos en común para parecer legítimo"],
    points: 100,
  },
  {
    id: 18, category: "Redes Sociales", icon: "📱", difficulty: "DIFÍCIL",
    title: "Reto viral sospechoso",
    description: "Un reto viral se vuelve popular en TikTok e Instagram:",
    content: `🔥 RETO VIRAL: "10 cosas sobre mí" 🔥\n\nComparte estas 10 cosas para que tus amigos \nte conozcan mejor:\n1. Nombre completo\n2. Fecha de nacimiento\n3. Ciudad donde naciste\n4. Nombre de tu primera mascota\n5. Colegio donde estudiaste\n6. Nombre de tu mejor amigo de infancia\n7. Primer carro que tuviste\n8. Nombre de soltera de tu mamá\n9. Tu equipo de fútbol favorito\n10. Calle donde creciste`,
    question: "¿Participas en el reto?",
    options: [
      { text: "Sí, es divertido y todos tus amigos lo hacen", correct: false },
      { text: "Solo compartes algunas respuestas inofensivas", correct: false },
      { text: "No participas, son preguntas de seguridad bancaria", correct: true },
      { text: "Participas pero con datos falsos para divertirte", correct: false },
    ],
    explanation: "Este reto recopila exactamente las preguntas de seguridad que usan los bancos para recuperar contraseñas. Los atacantes diseñan estos 'retos virales' específicamente para robar esta información.",
    redFlags: ["Preguntas de seguridad bancaria", "Reto diseñado para extraer datos", "Información personal pública", "Ingeniería social masiva"],
    points: 200,
  },
  {
    id: 6, category: "Actualizaciones", icon: "🔄", difficulty: "FÁCIL",
    title: "Actualización pendiente",
    description: "Llevas 6 meses ignorando las actualizaciones. Tu amigo dice:",
    content: `"Yo nunca actualizo el sistema, solo \nsirve para hacer el equipo más lento. \nLos hackers igual van a entrar si quieren, \nlas actualizaciones no sirven de nada."`,
    question: "¿Tu amigo tiene razón?",
    options: [
      { text: "Sí, las actualizaciones solo enlentecen el equipo", correct: false },
      { text: "No, las actualizaciones cierran vulnerabilidades críticas de seguridad", correct: true },
      { text: "Depende, solo hay que instalar las de seguridad", correct: false },
      { text: "Mejor esperar un mes para ver si tienen bugs", correct: false },
    ],
    explanation: "El 60% de las brechas de seguridad explotan vulnerabilidades con parches disponibles que no fueron instalados. Activa las actualizaciones automáticas.",
    redFlags: ["Ignorar actualizaciones", "Creer que no sirven", "Posponer indefinidamente", "Solo actualizar apps visibles"],
    points: 100,
  },
  {
    id: 19, category: "Actualizaciones", icon: "🔄", difficulty: "MEDIO",
    title: "Notificación de actualización falsa",
    description: "Mientras navegas aparece este pop-up:",
    content: `⚠️ ADVERTENCIA DE SEGURIDAD ⚠️\n\nSu versión de Chrome está DESACTUALIZADA\ny su equipo está EN RIESGO.\n\nHaga clic en ACTUALIZAR AHORA para \ninstalar la versión más reciente y \nproteger su información.\n\n[ACTUALIZAR AHORA]    [Recordar después]`,
    question: "¿Qué haces?",
    options: [
      { text: "Haces clic en 'Actualizar ahora', necesitas estar seguro", correct: false },
      { text: "Cierras el pop-up y actualizas Chrome desde su menú oficial", correct: true },
      { text: "Haces clic en 'Recordar después' para verlo luego", correct: false },
      { text: "Ignoras el pop-up para siempre", correct: false },
    ],
    explanation: "Los pop-ups de actualización falsos son una táctica común para instalar malware. Chrome y otros navegadores se actualizan desde su propio menú de configuración, nunca desde pop-ups de páginas web.",
    redFlags: ["Pop-up en página web", "Urgencia de 'equipo en riesgo'", "Botón de descarga en sitio externo", "Diseño que imita alertas del sistema"],
    points: 150,
  },
  {
    id: 7, category: "Malware", icon: "💀", difficulty: "DIFÍCIL",
    title: "Archivo adjunto del trabajo",
    description: "Recibes este email de tu jefe (o eso parece):",
    content: `De: director@fae.mi1.ec\nAsunto: Revisar URGENTE - Contrato confidencial\n\nHola,\nNecesito que revises este contrato antes de las 3pm.\nEs confidencial, no lo compartas con nadie todavía.\n\n[Contrato_Final_2024.pdf.exe] (2.3 MB)\n\nGracias, Jorge Zumba - Director General`,
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
    id: 20, category: "Malware", icon: "💀", difficulty: "FÁCIL",
    title: "USB encontrado en el parking",
    description: "Al llegar a la oficina encuentras esto:",
    content: `En el estacionamiento de tu empresa encuentras \nun USB con una etiqueta que dice:\n\n🏷️ "PASES 2026 - CONFIDENCIAL"\n\nNadie está cerca. Es un USB normal que \ncabe en cualquier computadora.`,
    question: "¿Qué haces?",
    options: [
      { text: "Lo conectas para ver si puedes devolvérselo a alguien", correct: false },
      { text: "Lo conectas en tu equipo personal, no en el del trabajo", correct: false },
      { text: "Lo entregas a JECIB sin conectarlo", correct: true },
      { text: "Lo dejas donde estaba, no es tu problema", correct: false },
    ],
    explanation: "Los USBs abandonados son una táctica clásica de ataque llamada 'USB Drop Attack'. La etiqueta atractiva como 'PASES 2026' es intencional para provocar curiosidad. Al conectarlo se instala malware automáticamente.",
    redFlags: ["USB encontrado en lugar público", "Etiqueta diseñada para provocar curiosidad", "Origen desconocido", "Ejecución automática al conectar"],
    points: 100,
  },
  {
    id: 21, category: "Malware", icon: "💀", difficulty: "MEDIO",
    title: "Software gratuito sospechoso",
    description: "Necesitas editar un PDF y buscas en Google:",
    content: `Resultados de búsqueda para "editar PDF gratis":\n\n🔍 edit-pdf-free-download.net\n   "Descarga GRATIS el mejor editor de PDF"\n   \n🔍 pdf-editor-pro-crack.com  \n   "Adobe Acrobat Pro GRATIS - Sin pagar"\n   \n🔍 acrobat.adobe.com\n   "Adobe Acrobat - Editor oficial de PDF"\n   \n🔍 ilovepdf.com\n   "Herramienta online gratuita para PDF"`,
    question: "¿Cuál usas?",
    options: [
      { text: "edit-pdf-free-download.net, es el primero y gratis", correct: false },
      { text: "pdf-editor-pro-crack.com, Adobe Acrobat gratis suena bien", correct: false },
      { text: "ilovepdf.com o el sitio oficial de Adobe", correct: true },
      { text: "Descargas el primero y lo analizas con antivirus antes", correct: false },
    ],
    explanation: "Los sitios de 'software crackeado' o descargables desconocidos son vectores comunes de malware. ilovepdf.com es una herramienta legítima y reconocida. Siempre prefiere herramientas online conocidas o sitios oficiales.",
    redFlags: ["Dominios sospechosos", "Software 'crackeado' gratis", "Descarga de ejecutables desconocidos", "Demasiado bueno para ser verdad"],
    points: 150,
  },
  {
    id: 8, category: "2FA", icon: "🔒", difficulty: "DIFÍCIL",
    title: "Código de verificación inesperado",
    description: "Recibes este SMS mientras estás en casa:",
    content: `SMS recibido - 14:32:\n"Tu código de verificación de Gmail es: 847291\nNo compartas este código con nadie."\n\nSegundos después alguien te llama:\n"Hola, soy del soporte de Google. Detectamos un \nintento de hackeo. Necesito ese código que acabas \nde recibir para proteger tu cuenta."`,
    question: "¿Qué haces?",
    options: [
      { text: "Das el código, es soporte oficial de Google", correct: false },
      { text: "Colgar, NUNCA compartes un código 2FA con nadie", correct: true },
      { text: "Pides más datos para verificar que es Google", correct: false },
      { text: "Das solo los primeros 3 dígitos como prueba", correct: false },
    ],
    explanation: "El atacante ya tiene tu contraseña y solo necesita el código 2FA. Google, Apple, tu banco o CUALQUIER empresa NUNCA te pedirá un código de verificación por teléfono.",
    redFlags: ["Solicitud del código 2FA", "Llamada inmediata tras el SMS", "Urgencia de 'proteger tu cuenta'", "Nadie legítimo pide códigos 2FA"],
    points: 200,
  },
  {
    id: 22, category: "2FA", icon: "🔒", difficulty: "FÁCIL",
    title: "¿Qué tipo de 2FA usar?",
    description: "Vas a activar el doble factor en tu banco. Te ofrecen estas opciones:",
    content: `El banco te ofrece elegir tu método de \ndoble factor de autenticación:\n\nA) SMS al celular con código de 6 dígitos\nB) Email con código de verificación  \nC) App autenticadora (Google Authenticator)\nD) Pregunta de seguridad (nombre mascota, etc.)`,
    question: "¿Cuál es el método más seguro?",
    options: [
      { text: "SMS, es lo más cómodo y rápido", correct: false },
      { text: "Email, así todo llega al mismo lugar", correct: false },
      { text: "App autenticadora, genera códigos localmente sin red", correct: true },
      { text: "Pregunta de seguridad, fácil de recordar", correct: false },
    ],
    explanation: "Las apps autenticadoras (Google Authenticator, Authy) son las más seguras porque generan códigos localmente sin depender de SMS o email. Los SMS pueden ser interceptados mediante ataques SIM Swap.",
    redFlags: ["SMS interceptable por SIM Swap", "Email hackeable por phishing", "Preguntas de seguridad adivinables", "Dependencia de red para SMS"],
    points: 100,
  },
  {
    id: 23, category: "2FA", icon: "🔒", difficulty: "MEDIO",
    title: "SIM Swap en tu celular",
    description: "Un día tu celular deja de tener señal sin razón aparente:",
    content: `Tu celular muestra "Sin servicio" desde \nesta mañana. Llamas desde otro teléfono \na tu número y no entra.\n\nLuego recibes un email de tu banco:\n"Se ha realizado una transferencia de $500 \ndesde su cuenta. Si no reconoce esta \noperación contáctenos."\n\nTu número sigue sin señal.`,
    question: "¿Qué está pasando y qué haces?",
    options: [
      { text: "Es un problema técnico del operador, esperas", correct: false },
      { text: "Llamas al banco y a tu operadora inmediatamente para reportar SIM Swap", correct: true },
      { text: "Esperas a que vuelva la señal para revisar", correct: false },
      { text: "Vas a la tienda del operador al día siguiente", correct: false },
    ],
    explanation: "Esto es un ataque SIM Swap: el atacante convenció a tu operadora de transferir tu número a una SIM que controla él. Ahora recibe tus SMS de verificación bancaria. Debes actuar INMEDIATAMENTE llamando al banco y operadora.",
    redFlags: ["Pérdida repentina de señal", "Transacciones no reconocidas", "Código 2FA por SMS vulnerable", "Urgencia de actuar de inmediato"],
    points: 150,
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

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState("home");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [filter, setFilter] = useState("TODOS");
  const [chatHistory, setChatHistory] = useState([]);
  const [userQ, setUserQ] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [rankingData, setRankingData] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarName, setAvatarName] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(null);
  const [tempName, setTempName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [timerActive, setTimerActive] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  const BLOCKS = [
    { id: "Phishing", name: "Phishing", icon: "🎣", color: "#c62828", bg: "#ffebee" },
    { id: "Contraseñas", name: "Contraseñas", icon: "🔐", color: "#1565c0", bg: "#e3f2fd" },
    { id: "WiFi Público", name: "WiFi Público", icon: "📶", color: "#2e7d32", bg: "#e8f5e9" },
    { id: "Ingeniería Social", name: "Ingeniería Social", icon: "🎭", color: "#6a1b9a", bg: "#f3e5f5" },
    { id: "Redes Sociales", name: "Redes Sociales", icon: "📱", color: "#e65100", bg: "#fff3e0" },
    { id: "Actualizaciones", name: "Actualizaciones", icon: "🔄", color: "#00695c", bg: "#e0f2f1" },
    { id: "Malware", name: "Malware", icon: "💀", color: "#b71c1c", bg: "#ffebee" },
    { id: "2FA", name: "2FA", icon: "🔒", color: "#4527a0", bg: "#ede7f6" },
  ];

  const AVATARS = [
    { id: 1, emoji: "🦅", name: "Águila Cyber", color: "#1565c0" },
    { id: 2, emoji: "🦉", name: "Búho Hacker", color: "#4a148c" },
    { id: 3, emoji: "🐺", name: "Lobo Digital", color: "#1b5e20" },
    { id: 4, emoji: "🦊", name: "Zorro Tech", color: "#e65100" },
    { id: 5, emoji: "🐯", name: "Tigre Firewall", color: "#b71c1c" },
    { id: 6, emoji: "🦁", name: "León Encriptado", color: "#f57f17" },
    { id: 7, emoji: "🐉", name: "Dragón Binario", color: "#880e4f" },
    { id: 8, emoji: "🦈", name: "Tiburón Red", color: "#006064" },
    { id: 9, emoji: "🦅", name: "Halcón OSINT", color: "#37474f" },
    { id: 10, emoji: "🐻", name: "Oso Forense", color: "#3e2723" },
    { id: 11, emoji: "🦋", name: "Mariposa Stealth", color: "#880e4f" },
    { id: 12, emoji: "🐬", name: "Delfín Pentester", color: "#0277bd" },
  ];

  const CATEGORIES = ["TODOS", ...Array.from(new Set(SCENARIOS.map(s => s.category)))];
  const [quizScenarios, setQuizScenarios] = useState([]);

  const buildQuiz = (f) => {
    const base = f === "TODOS" ? SCENARIOS : SCENARIOS.filter(s => s.category === f);
    return shuffle([...base]).map(s => ({ ...s, options: shuffle([...s.options]) }));
  };

  // filteredScenarios para compatibilidad con resultados
  const filteredScenarios = quizScenarios.length > 0 ? quizScenarios : SCENARIOS;

  useEffect(() => {
    const iv = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, aiLoading]);

  // Temporizador 15 segundos
  useEffect(() => {
    if (timerActive && !showResult) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            setShowResult(true);
            setSelected(null);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, showResult, currentIdx]);


  const handleAnswer = (idx) => {
    const scenario = quizScenarios[currentIdx];
    if (!scenario || showResult) return;
    clearInterval(timerRef.current);
    setTimerActive(false);
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
    const totalScenarios = quizScenarios.length;
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(40);
      setTimerActive(true);
    } else {
      clearInterval(timerRef.current);
      saveScore(score, totalPoints, activeBlock || filter);
      setScreen("results");
    }
  };

  const resetCounters = () => {
    clearInterval(timerRef.current);
    setCurrentIdx(0); setSelected(null); setShowResult(false);
    setScore(0); setTotalPoints(0); setStreak(0); setBestStreak(0); setAnswers([]);
    setTimeLeft(40); setTimerActive(false);
  };

  const resetQuiz = () => {
    resetCounters();
    setQuizScenarios([]);
    setActiveBlock(null);
  };

  const goHome = () => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setTotalPoints(0);
    setStreak(0);
    setBestStreak(0);
    setAnswers([]);
    setTimeLeft(40);
    setActiveBlock(null);
    setQuizScenarios([]);
    setScreen("home");
  };

  const saveScore = async (finalScore, finalPoints, filterUsed) => {
    const user = auth.currentUser;
    if (!user) return;
    const displayName = avatarName ? avatarName : (user.displayName || user.email);
    await supabase.from("ranking").insert([{
      username: displayName,
      email: user.email,
      score: finalScore,
      points: finalPoints,
      category: filterUsed,
      avatar: avatar ? avatar.emoji : "",
    }]);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Eres CyberEscudo FAE AI, experto en ciberseguridad amigable y directo. Educas sobre seguridad digital de forma clara y práctica. Responde en español, conciso (máximo 3 párrafos). Usa emojis ocasionalmente.`,
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

  const loadRanking = async () => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setQuizScenarios([]);
    const { data } = await supabase
      .from("ranking")
      .select("*")
      .order("points", { ascending: false })
      .limit(10);
    setRankingData(data || []);
    setScreen("ranking");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(false);
    setAvatar(null);
    setAvatarName("");
    setShowAvatar(false);
    setTempAvatar(null);
    setTempName("");
    setNameError(false);
    resetQuiz();
    setScreen("home");
  };

  if (!loggedIn) return <Login onLogin={() => { setLoggedIn(true); setShowAvatar(true); }} />;

  // ===== PANTALLA: SELECCIÓN DE AVATAR =====
  if (showAvatar) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a1628,#0d2d6b,#071530)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 500, width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, backdropFilter: "blur(10px)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎮</div>
            <h2 style={{ color: "#f5d060", fontSize: 22, fontWeight: 900, margin: "0 0 6px", letterSpacing: 2 }}>ELIGE TU AVATAR</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>Selecciona tu identidad en el campo de batalla digital</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
            {AVATARS.map(av => (
              <button key={av.id} onClick={() => setTempAvatar(av)}
                style={{ background: tempAvatar?.id === av.id ? av.color : "rgba(255,255,255,0.05)", border: tempAvatar?.id === av.id ? "2px solid #f5d060" : "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 6px", cursor: "pointer", textAlign: "center", transition: "all 0.2s", transform: tempAvatar?.id === av.id ? "scale(1.08)" : "scale(1)" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{av.emoji}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 9, fontWeight: 700, lineHeight: 1.2 }}>{av.name}</div>
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, display: "block", marginBottom: 8, letterSpacing: 1 }}>NOMBRE DE COMBATE</label>
            <input value={tempName} onChange={e => { setTempName(e.target.value); setNameError(false); }}
              placeholder="Ej: CyberHawk_21..."
              maxLength={20}
              style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: nameError ? "1.5px solid #f44336" : "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "11px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}/>
            {nameError && <div style={{ color: "#f44336", fontSize: 11, marginTop: 4 }}>Ingresa un nombre y selecciona un avatar</div>}
          </div>
          <button onClick={() => {
            if (!tempName.trim() || !tempAvatar) { setNameError(true); return; }
            setAvatar(tempAvatar);
            setAvatarName(tempName.trim());
            setShowAvatar(false);
          }} style={{ width: "100%", background: "linear-gradient(135deg,#c8920a,#f5d060)", border: "none", borderRadius: 10, padding: "13px", color: "#0a1628", fontSize: 15, fontWeight: 900, cursor: "pointer", letterSpacing: 2 }}>
            ▶ ENTRAR AL COMBATE
          </button>
        </div>
      </div>
    );
  }

  const C = {
    green: "#2e7d32",
    greenLight: "#4caf50",
    greenPale: "#e8f5e9",
    greenMid: "#a5d6a7",
    red: "#c62828",
    redLight: "#ef9a9a",
    bg: "#f1f8f1",
    panel: "#ffffff",
    border: "#c8e6c9",
    dim: "#757575",
    mid: "#424242",
    accent: "#1b5e20",
    shadow: "0 2px 8px rgba(46,125,50,0.10)",
  };

  const wrap = { minHeight: "100vh", background: C.bg, color: C.mid, fontFamily: "'Segoe UI', Arial, sans-serif", position: "relative" };
  const cont = { maxWidth: 800, margin: "0 auto", padding: "20px 16px" };
  const card = { background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow };
  const btn = (variant = "primary", extra = {}) => ({
    fontFamily: "'Segoe UI', Arial, sans-serif", cursor: "pointer", border: "none", borderRadius: 8,
    fontWeight: 700, transition: "all 0.2s", fontSize: 13, letterSpacing: "0.03em",
    ...(variant === "primary" ? { background: `linear-gradient(135deg,${C.green},${C.greenLight})`, color: "#fff", padding: "12px 28px", boxShadow: "0 2px 6px rgba(46,125,50,0.3)" } : {}),
    ...(variant === "ghost" ? { background: C.greenPale, color: C.green, border: `1.5px solid ${C.greenMid}`, padding: "10px 20px" } : {}),
    ...(variant === "dim" ? { background: "#f5f5f5", color: C.dim, border: `1px solid #e0e0e0`, padding: "8px 16px" } : {}),
    ...extra
  });
  const diffColor = (d) => d === "FÁCIL" ? "#2e7d32" : d === "MEDIO" ? "#f57f17" : "#c62828";
  const diffBg = (d) => d === "FÁCIL" ? "#e8f5e9" : d === "MEDIO" ? "#fff8e1" : "#ffebee";

  // ===== PANTALLA: HOME =====

  if (screen === "home") return (
    <div style={wrap}>
      <div style={cont}>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {avatar && <div style={{ display: "flex", alignItems: "center", gap: 6, background: avatar.color, borderRadius: 20, padding: "4px 12px" }}>
              <span style={{ fontSize: 18 }}>{avatar.emoji}</span>
              <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{avatarName}</span>
            </div>}
            <button style={btn("dim")} onClick={handleLogout}>🔓 Cerrar sesión</button>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
          <img src={SELLO_JECIB} alt="Sello JECIB FAE" style={{ width: 130, height: 130, objectFit: "contain", marginBottom: 12 }} />
          <h1 style={{ fontSize: "clamp(24px,6vw,48px)", fontWeight: 900, margin: "0 0 4px", color: C.green, letterSpacing: "0.05em" }}>
            CYBER<span style={{ color: C.accent }}>ESCUDO</span>
            <span style={{ color: C.dim, fontSize: "0.45em", display: "block", letterSpacing: "0.3em", fontWeight: 600, marginTop: 2 }}>FAE</span>
          </h1>
          <p style={{ color: C.dim, fontSize: 13, marginBottom: 28 }}>Entrenamiento en Seguridad Digital · {SCENARIOS.length} escenarios reales</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 28 }}>
            {[{ icon: "🎯", n: SCENARIOS.length, label: "Escenarios" }, { icon: "🏆", n: "2650+", label: "Puntos max" }, { icon: "🤖", n: "IA", label: "Experta 24/7" }, { icon: "📊", n: "7", label: "Categorías" }].map(x => (
              <div key={x.label} style={{ ...card, padding: "14px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>{x.icon}</div>
                <div style={{ color: C.green, fontSize: 20, fontWeight: 900 }}>{x.n}</div>
                <div style={{ color: C.dim, fontSize: 11 }}>{x.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
            <button style={btn("primary")} onClick={() => { const q = buildQuiz("TODOS"); setQuizScenarios(q); resetCounters(); setFilter("TODOS"); setActiveBlock("TODOS"); setTimerActive(true); setScreen("quiz"); }}>▶ Iniciar Entrenamiento</button>
            <button style={btn("ghost")} onClick={() => setScreen("selector")}>📋 Elegir Categoría</button>
            <button style={btn("ghost")} onClick={loadRanking}>🏆 Ranking</button>
          </div>
        </div>
        <div style={{ ...card, padding: "14px 18px", marginBottom: 14, borderLeft: `4px solid ${C.greenLight}` }}>
          <div style={{ color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 8 }}>💡 TIP DEL DÍA</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{TIPS[tipIdx].icon}</span>
            <div>
              <div style={{ color: C.mid, fontSize: 13, fontWeight: 700 }}>{TIPS[tipIdx].title}</div>
              <div style={{ color: C.dim, fontSize: 12, marginTop: 2 }}>{TIPS[tipIdx].desc}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8 }}>
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => { const q = buildQuiz(s.category); setQuizScenarios(q); resetCounters(); setFilter(s.category); setActiveBlock(s.category); setTimerActive(true); setScreen("quiz"); }}
              style={{ ...card, padding: "12px 10px", cursor: "pointer", textAlign: "left", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 9, color: diffColor(s.difficulty), background: diffBg(s.difficulty), padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>{s.difficulty}</span>
              </div>
              <div style={{ color: C.mid, fontSize: 11, fontWeight: 700 }}>{s.title}</div>
              <div style={{ color: C.dim, fontSize: 10, marginTop: 2 }}>{s.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== PANTALLA: BLOQUES =====
  if (screen === "selector") return (
    <div style={wrap}>
      <div style={cont}>
        <div style={{ paddingTop: 20, marginBottom: 20 }}><button style={btn("dim")} onClick={() => setScreen("home")}>← Volver</button></div>
        <h2 style={{ color: C.green, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Escoge tu Bloque</h2>
        <p style={{ color: C.dim, fontSize: 12, marginBottom: 20 }}>Cada bloque tiene preguntas aleatorias · 15 segundos por pregunta</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
          {BLOCKS.map(block => {
            const count = SCENARIOS.filter(s => s.category === block.id).length;
            return (
              <button key={block.id}
                onClick={() => {
                  const q = buildQuiz(block.id);
                  setQuizScenarios(q);
                  resetCounters();
                  setFilter(block.id);
                  setActiveBlock(block.id);
                  setTimerActive(true);
                  setScreen("quiz");
                }}
                style={{ background: block.bg, border: `2px solid ${block.color}`, borderRadius: 14, padding: "20px 14px", cursor: "pointer", textAlign: "center", transition: "transform 0.15s" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{block.icon}</div>
                <div style={{ color: block.color, fontSize: 13, fontWeight: 900, marginBottom: 4 }}>{block.name}</div>
                <div style={{ color: "#757575", fontSize: 11 }}>{count} preguntas</div>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => {
            const q = buildQuiz("TODOS");
            setQuizScenarios(q);
            resetCounters();
            setFilter("TODOS");
            setActiveBlock("TODOS");
            setTimerActive(true);
            setScreen("quiz");
          }}
          style={{ width: "100%", background: "linear-gradient(135deg,#f57f17,#ffa726)", border: "none", borderRadius: 14, padding: "20px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🏆</div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, marginBottom: 4 }}>TODAS LAS CATEGORÍAS</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{SCENARIOS.length} preguntas aleatorias</div>
        </button>
      </div>
    </div>
  );

  // ===== PANTALLA: QUIZ =====
  if (screen === "quiz") {
    const scenario = quizScenarios[currentIdx];
    if (!scenario) return (
      <div style={wrap}>
        <div style={cont}>
          <div style={{ paddingTop: 40, textAlign: "center" }}>
            <button style={btn("primary")} onClick={goHome}>← Volver al inicio</button>
          </div>
        </div>
      </div>
    );
    const progress = quizScenarios.length > 0 ? ((currentIdx) / quizScenarios.length) * 100 : 0;
    const isCorrect = showResult && scenario.options[selected]?.correct;
    return (
      <div style={wrap}>
        {showBadge && (
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 100, textAlign: "center", background: "#fff", border: `2px solid ${C.green}`, borderRadius: 16, padding: "24px 40px", boxShadow: "0 8px 32px rgba(46,125,50,0.2)" }}>
            <div style={{ fontSize: 48 }}>🔥</div>
            <div style={{ color: C.green, fontSize: 18, fontWeight: 900 }}>¡RACHA x3!</div>
            <div style={{ color: C.dim, fontSize: 12, marginTop: 4 }}>+50% puntos bonus</div>
          </div>
        )}
        <div style={cont}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, marginBottom: 12 }}>
            <button style={btn("dim")} onClick={goHome}>← Salir</button>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {streak >= 2 && <div style={{ color: "#e65100", fontSize: 12, background: "#fff3e0", border: "1px solid #ffcc80", padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>🔥 ×{streak}</div>}
              <div style={{ color: C.green, fontSize: 12, background: C.greenPale, border: `1px solid ${C.greenMid}`, padding: "4px 12px", borderRadius: 20, fontWeight: 700 }}>★ {totalPoints} pts</div>
              <div style={{ color: C.dim, fontSize: 12 }}>{currentIdx + 1}/{quizScenarios.length}</div>
            </div>
          </div>
          <div style={{ height: 6, background: "#e0e0e0", borderRadius: 3, marginBottom: 8 }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${progress}%`, background: `linear-gradient(90deg,${C.green},${C.greenLight})`, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 8, background: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, width: `${(timeLeft / 40) * 100}%`, background: timeLeft > 20 ? "#4caf50" : timeLeft > 10 ? "#ff9800" : "#f44336", transition: "width 1s linear, background 0.3s" }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: timeLeft > 20 ? C.green : timeLeft > 10 ? "#e65100" : C.red, minWidth: 28, textAlign: "right" }}>{timeLeft}s</div>
          </div>
          <div style={{ ...card, padding: "20px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 28 }}>{scenario.icon}</span>
              <span style={{ background: "#fce4ec", color: "#c62828", fontSize: 10, padding: "3px 10px", borderRadius: 10, fontWeight: 700 }}>{scenario.category.toUpperCase()}</span>
              <span style={{ background: diffBg(scenario.difficulty), color: diffColor(scenario.difficulty), fontSize: 10, padding: "3px 10px", borderRadius: 10, fontWeight: 700 }}>{scenario.difficulty}</span>
              <span style={{ color: "#f57f17", fontSize: 12, marginLeft: "auto", fontWeight: 700 }}>+{scenario.points} pts</span>
            </div>
            <h2 style={{ color: C.mid, fontSize: "clamp(16px,4vw,22px)", marginBottom: 6, fontWeight: 800 }}>{scenario.title}</h2>
            <p style={{ color: C.dim, fontSize: 12, marginBottom: 14 }}>{scenario.description}</p>
            {scenario.content && (
              <div style={{ background: "#f5f5f5", border: `1px solid #e0e0e0`, borderLeft: `4px solid ${C.red}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: C.mid, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                {scenario.content}
              </div>
            )}
            <p style={{ color: C.green, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{scenario.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {scenario.options.map((opt, idx) => {
                let borderColor = C.border, bgColor = "#fafafa", color = C.mid;
                if (showResult) {
                  if (opt.correct) { borderColor = C.green; bgColor = C.greenPale; color = C.green; }
                  else if (selected === idx) { borderColor = C.red; bgColor = "#ffebee"; color = C.red; }
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} style={{ background: bgColor, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "11px 14px", textAlign: "left", color, fontSize: 12, cursor: showResult ? "default" : "pointer", fontFamily: "'Segoe UI', Arial, sans-serif", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ opacity: 0.5, flexShrink: 0, fontSize: 11, fontWeight: 700 }}>{String.fromCharCode(65 + idx)}.</span>
                    <span style={{ flex: 1 }}>{opt.text}</span>
                    {showResult && opt.correct && <span style={{ color: C.green, fontWeight: 900 }}>✓</span>}
                    {showResult && selected === idx && !opt.correct && <span style={{ color: C.red, fontWeight: 900 }}>✗</span>}
                  </button>
                );
              })}
            </div>
            {showResult && (
              <div style={{ background: isCorrect ? C.greenPale : "#ffebee", border: `1px solid ${isCorrect ? C.greenMid : C.redLight}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
                <div style={{ color: isCorrect ? C.green : C.red, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
                  {isCorrect ? `✅ ¡Correcto! +${scenario.points}${streak >= 3 ? ` +${Math.floor(scenario.points * 0.5)} bonus 🔥` : ""} pts` : "❌ Respuesta incorrecta"}
                </div>
                <p style={{ color: C.mid, fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{scenario.explanation}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {scenario.redFlags.map(flag => (
                    <span key={flag} style={{ background: "#ffebee", border: "1px solid #ef9a9a", color: C.red, fontSize: 10, padding: "3px 8px", borderRadius: 6 }}>⚠ {flag}</span>
                  ))}
                </div>
              </div>
            )}
            {showResult && (
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ ...btn("primary"), flex: 1 }} onClick={nextScenario}>{currentIdx < quizScenarios.length - 1 ? "SIGUIENTE →" : "VER RESULTADOS →"}</button>
                <button style={btn("ghost")} onClick={() => setScreen("chat")}>🤖 IA</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== PANTALLA: RANKING =====
  if (screen === "ranking") return (
    <div style={wrap}>
      <div style={cont}>
        <div style={{ paddingTop: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={btn("dim")} onClick={() => setScreen("home")}>← Volver</button>
          <h2 style={{ color: C.green, fontSize: 20, fontWeight: 800, margin: 0 }}>🏆 Top 10 Ranking</h2>
          <div style={{ width: 80 }} />
        </div>
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          {rankingData.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: C.dim }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <p>Aún no hay puntajes registrados.</p>
              <p style={{ fontSize: 12 }}>¡Sé el primero en completar un entrenamiento!</p>
            </div>
          ) : (
            rankingData.map((entry, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: idx < rankingData.length - 1 ? `1px solid ${C.border}` : "none", background: idx === 0 ? "#fff8e1" : idx === 1 ? "#f5f5f5" : idx === 2 ? "#fff3e0" : C.panel }}>
                <div style={{ fontSize: 24, width: 36, textAlign: "center" }}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {entry.avatar && <span style={{ fontSize: 18 }}>{entry.avatar}</span>}
                  <span style={{ color: C.mid, fontWeight: 700, fontSize: 14 }}>{entry.username}</span>
                </div>
                  <div style={{ color: C.dim, fontSize: 11 }}>{entry.category === "TODOS" ? "Todas las categorías" : entry.category}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: C.green, fontWeight: 900, fontSize: 16 }}>★ {entry.points}</div>
                  <div style={{ color: C.dim, fontSize: 11 }}>{entry.score} correctas</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button style={btn("primary")} onClick={() => { const q = buildQuiz("TODOS"); setQuizScenarios(q); resetCounters(); setFilter("TODOS"); setActiveBlock("TODOS"); setTimerActive(true); setScreen("quiz"); }}>▶ Jugar Ahora</button>
        </div>
      </div>
    </div>
  );

  // ===== PANTALLA: RESULTS =====
  if (screen === "results") {
    const totalQ = answers.length || 1; const pct = (score / totalQ) * 100;
    const level = pct >= 75 ? { label: "EXPERTO", color: C.green, bg: C.greenPale, emoji: "🏆" } : pct >= 50 ? { label: "INTERMEDIO", color: "#f57f17", bg: "#fff8e1", emoji: "🎯" } : { label: "PRINCIPIANTE", color: C.red, bg: "#ffebee", emoji: "⚠️" };
    const byCategory = {};
    answers.forEach(a => {
      if (!byCategory[a.category]) byCategory[a.category] = { correct: 0, total: 0 };
      byCategory[a.category].total++;
      if (a.correct) byCategory[a.category].correct++;
    });
    return (
      <div style={wrap}>
        <div style={cont}>
          <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{level.emoji}</div>
            <div style={{ fontSize: "clamp(48px,12vw,72px)", fontWeight: 900, color: C.green }}>{score}/{answers.length || totalQ}</div>
            <div style={{ display: "inline-block", background: level.bg, border: `1px solid ${level.color}`, color: level.color, padding: "5px 18px", borderRadius: 20, fontSize: 12, fontWeight: 800, margin: "12px 0 8px" }}>NIVEL: {level.label}</div>
            <div style={{ color: C.green, fontSize: 20, fontWeight: 900, marginBottom: 4 }}>★ {totalPoints} puntos</div>
            {bestStreak >= 2 && <div style={{ color: "#e65100", fontSize: 13, fontWeight: 700 }}>🔥 Mejor racha: ×{bestStreak}</div>}
          </div>
          {Object.keys(byCategory).length > 0 && (
            <div style={{ ...card, padding: 16, marginBottom: 20 }}>
              <div style={{ color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 14 }}>RENDIMIENTO POR CATEGORÍA</div>
              {Object.entries(byCategory).map(([cat, data]) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: C.mid, fontSize: 12 }}>{cat}</span>
                    <span style={{ color: data.correct === data.total ? C.green : C.red, fontSize: 12, fontWeight: 700 }}>{data.correct}/{data.total}</span>
                  </div>
                  <div style={{ height: 6, background: "#e0e0e0", borderRadius: 3 }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(data.correct / data.total) * 100}%`, background: data.correct === data.total ? C.green : "#ffa726" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button style={btn("primary")} onClick={() => { const q = buildQuiz(filter); setQuizScenarios(q); resetCounters(); setTimerActive(true); setScreen("quiz"); }}>↺ Repetir</button>
            <button style={btn("ghost")} onClick={() => { goHome(); setTimeout(() => setScreen("selector"), 50); }}>📋 Otra Categoría</button>
            <button style={btn("ghost")} onClick={loadRanking}>🏆 Ranking</button>
            <button style={btn("dim")} onClick={goHome}>⌂ Inicio</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== PANTALLA: CHAT =====
  const QUICK_Q = ["¿Cómo sé si me hackearon?", "¿Qué VPN me recomiendas?", "¿Cómo protejo mi WhatsApp?", "¿Es seguro el WiFi de mi trabajo?", "¿Qué hago si caí en phishing?"];
  return (
    <div style={{ ...wrap, display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 14, flexShrink: 0 }}>
          <button style={btn("dim", { padding: "6px 12px" })} onClick={() => setScreen("home")}>←</button>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <div style={{ color: C.green, fontSize: 13, fontWeight: 800 }}>CyberEscudo FAE IA</div>
            <div style={{ color: C.greenLight, fontSize: 10, fontWeight: 600 }}>● EN LÍNEA</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
          {chatHistory.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
              <div style={{ color: C.dim, fontSize: 12, marginBottom: 14, fontWeight: 600 }}>PREGUNTAS FRECUENTES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, maxWidth: 420, margin: "0 auto" }}>
                {QUICK_Q.map(q => (
                  <button key={q} onClick={() => setUserQ(q)} style={{ ...card, color: C.mid, borderRadius: 8, padding: "10px 14px", fontSize: 12, cursor: "pointer", textAlign: "left" }}>💬 {q}</button>
                ))}
              </div>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "84%", background: msg.role === "user" ? C.greenPale : C.panel, border: `1px solid ${msg.role === "user" ? C.greenMid : C.border}`, borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 14px", fontSize: 12, lineHeight: 1.7, color: C.mid, boxShadow: C.shadow, whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ display: "flex", gap: 5, padding: "8px 4px", alignItems: "center" }}>
              <span style={{ color: C.dim, fontSize: 11 }}>Analizando</span>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: `pulse 1s ${i * 0.2}s infinite` }} />)}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, paddingBottom: 12, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={userQ} onChange={e => setUserQ(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && askAI()} placeholder="Pregunta sobre ciberseguridad..." style={{ flex: 1, background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.mid, fontSize: 12, outline: "none" }} />
            <button onClick={askAI} disabled={aiLoading || !userQ.trim()} style={{ ...btn("primary", { padding: "10px 18px" }), opacity: aiLoading || !userQ.trim() ? 0.4 : 1 }}>→</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
    </div>
  );
}

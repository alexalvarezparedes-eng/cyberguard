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
  // ===== PHISHING NUEVAS =====
  { id: 101, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Correo del SRI Ecuador", description: "Recibes este email:", content: "De: notificaciones@sri-ecuador.net\nAsunto: Tiene una devolución pendiente de $347\n\nEstimado contribuyente, tiene un reembolso.\nHaga clic para recibir su dinero:\n→ http://sri-devoluciones.tk/reclamar", question: "¿Qué haces?", options: [{ text: "Haces clic para recibir tu dinero", correct: false }, { text: "Ingresas al sri.gob.ec oficial para verificar", correct: true }, { text: "Respondes el email con tus datos", correct: false }, { text: "Llamas al número del email", correct: false }], explanation: "El SRI Ecuador solo notifica desde dominios .gob.ec. Dominios .net o .tk son falsos.", redFlags: ["Dominio no gubernamental", "Oferta de dinero inesperada", "URL .tk"], points: 100 },
  { id: 102, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Alerta de seguridad de Google", description: "Recibes este email:", content: "De: security@google-alerts.com\nAsunto: Alguien accedió a tu cuenta desde Rusia\n\nDetectamos acceso no autorizado.\nVerifica tu identidad aquí:\n→ http://google-security-check.net/verify\n\nTienes 1 hora antes de que se suspenda.", question: "¿Qué haces?", options: [{ text: "Haces clic urgente para proteger tu cuenta", correct: false }, { text: "Vas directamente a accounts.google.com", correct: true }, { text: "Respondes con tu contraseña para verificar", correct: false }, { text: "Ignoras el email completamente", correct: false }], explanation: "Google solo envía alertas desde @google.com. Verifica siempre en accounts.google.com directamente.", redFlags: ["Dominio falso", "Urgencia de 1 hora", "URL no oficial"], points: 150 },
  { id: 103, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Spear phishing del director", description: "Recibes este email:", content: "De: director.general@fae-ecuador.com\nAsunto: Transferencia urgente y confidencial\n\nNecesito que realices una transferencia\nde $5,000 de forma urgente y confidencial.\nNo lo menciones a nadie.\n\nCnel. Director General", question: "¿Qué haces?", options: [{ text: "Realizas la transferencia, es el director", correct: false }, { text: "Llamas al director por teléfono para verificar", correct: true }, { text: "Pides más información por email", correct: false }, { text: "Consultas con el área financiera por email", correct: false }], explanation: "Spear phishing apunta a personas específicas. Siempre verifica por teléfono transferencias urgentes.", redFlags: ["Dominio externo no oficial", "Urgencia + confidencialidad", "Transferencia de dinero"], points: 200 },
  { id: 104, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Notificación falsa de Netflix", description: "Recibes este email:", content: "De: billing@netflix-support.net\nAsunto: Tu suscripción será cancelada hoy\n\nProblema con tu método de pago.\nActualiza tu tarjeta:\n→ http://netflix-billing-update.com/card", question: "¿Qué haces?", options: [{ text: "Haces clic y actualizas tu tarjeta", correct: false }, { text: "Ingresas a netflix.com directamente", correct: true }, { text: "Respondes con los datos de tu tarjeta", correct: false }, { text: "Llamas al número del email", correct: false }], explanation: "Netflix solo envía emails desde @netflix.com. Siempre ingresa directamente al sitio oficial.", redFlags: ["Dominio diferente a netflix.com", "Urgencia de cancelación", "Solicita datos de tarjeta"], points: 100 },
  { id: 105, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Phishing por SMS - Banco", description: "Recibes este SMS:", content: "MSG de Banco Pichincha:\nSu tarjeta fue bloqueada por\nactividad sospechosa.\n\nDesbloquee aquí:\nhttp://bp-desbloqueo.tk/card\n\nUrgente: caduca en 2 horas.", question: "¿Qué haces?", options: [{ text: "Haces clic en el link para desbloquear", correct: false }, { text: "Llamas al número de tu tarjeta bancaria", correct: true }, { text: "Respondes el SMS con tu número de cuenta", correct: false }, { text: "Esperas que pasen las 2 horas", correct: false }], explanation: "Smishing es phishing por SMS. Los bancos nunca envían links de desbloqueo por SMS.", redFlags: ["Link .tk en SMS", "Urgencia de 2 horas", "Solicitud de datos por SMS"], points: 150 },
  { id: 106, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Phishing de WhatsApp Business", description: "Recibes este WhatsApp:", content: "WhatsApp Business - DHL Express:\nSu paquete #EC84729 está retenido\nen aduana. Pague $12 de arancel:\n\nhttps://dhl-ecuador-pago.net/pay\n\nCaducidad: 24 horas", question: "¿Qué haces?", options: [{ text: "Pagas los $12 para liberar tu paquete", correct: false }, { text: "Ignoras y verificas en dhl.com.ec oficial", correct: true }, { text: "Respondes pidiendo más información", correct: false }, { text: "Reenvías a tus contactos para que sepan", correct: false }], explanation: "DHL Ecuador solo gestiona pagos a través de dhl.com.ec. Dominios externos son phishing.", redFlags: ["Dominio no oficial de DHL", "Pago urgente por WhatsApp", "URL sospechosa"], points: 200 },
  { id: 107, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Ganaste un iPhone", description: "Aparece esta notificación en tu celular:", content: "FELICITACIONES\nEres el visitante número 1,000,000\nde este sitio.\n\nHas ganado un iPhone 15 Pro!\nReclama en los próximos 5 minutos:\n[RECLAMAR PREMIO AHORA]", question: "¿Qué haces?", options: [{ text: "Haces clic para reclamar tu iPhone", correct: false }, { text: "Cierras la notificación, es una trampa", correct: true }, { text: "Esperas para ver si es real", correct: false }, { text: "Compartes con amigos para que también ganen", correct: false }], explanation: "Notificaciones de premios aleatorios son siempre estafas diseñadas para instalar malware o robar datos.", redFlags: ["Premio por visita número X", "Urgencia de 5 minutos", "Notificación no solicitada"], points: 100 },
  { id: 108, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Phishing de PayPal", description: "Recibes este email:", content: "De: service@paypal-secure.net\nAsunto: Transacción no autorizada de $299\n\nDetectamos un cargo sospechoso.\nSi no reconoces esta transacción,\ncancela aquí en 24 horas:\n→ https://paypal-dispute.net/cancel", question: "¿Qué haces?", options: [{ text: "Haces clic urgente para cancelar el cargo", correct: false }, { text: "Ingresas directamente a paypal.com", correct: true }, { text: "Respondes el email para disputar el cargo", correct: false }, { text: "Llamas al número del email", correct: false }], explanation: "PayPal solo envía emails desde @paypal.com. Siempre verifica cargos en paypal.com directamente.", redFlags: ["Dominio diferente a paypal.com", "Cargo sospechoso urgente", "Link externo"], points: 150 },
  { id: 109, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Vishing telefónico bancario", description: "Recibes esta llamada:", content: "Hola, soy Ana López del Banco Pichincha.\nDetectamos 3 transacciones sospechosas\nen su cuenta por $890.\n\nPara cancelarlas necesito verificar\nsu identidad con:\n- Número de tarjeta completo\n- CVV\n- Clave de internet banking", question: "¿Qué haces?", options: [{ text: "Das los datos para cancelar las transacciones", correct: false }, { text: "Cuelgas y llamas al banco al número de tu tarjeta", correct: true }, { text: "Das solo el número de tarjeta sin el CVV", correct: false }, { text: "Pides el número del empleado y llamas de vuelta", correct: false }], explanation: "Los bancos nunca solicitan CVV ni claves por teléfono. Siempre cuelga y llama al número oficial de tu tarjeta.", redFlags: ["Solicitud de CVV por teléfono", "Solicitud de clave internet banking", "Urgencia de cancelar cargos"], points: 200 },
  { id: 110, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Email de lotería ganadora", description: "Recibes este email:", content: "De: loteria@euromillones-winners.com\nAsunto: GANASTE 500,000 euros!\n\nFue seleccionado en nuestro sorteo.\nReclame su premio enviando:\n- Nombre completo\n- Número de cédula\n- Cuenta bancaria", question: "¿Qué haces?", options: [{ text: "Envías tus datos para reclamar el premio", correct: false }, { text: "Eliminas el email inmediatamente", correct: true }, { text: "Pides más información antes de enviar datos", correct: false }, { text: "Compartes la noticia con familiares", correct: false }], explanation: "Nadie puede ganar una lotería en la que no participó. Nunca envíes datos personales a remitentes desconocidos.", redFlags: ["Premio no solicitado", "Solicita datos bancarios", "Dominio sospechoso"], points: 100 },
  { id: 111, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Falsa oferta de trabajo", description: "Recibes este email:", content: "De: rrhh@empresa-internacional.net\nAsunto: Oferta de trabajo - $3000/mes desde casa\n\nFue preseleccionado para el puesto.\nPara continuar envíe:\n- Foto de su cédula\n- Foto de su pasaporte\n- Número de cuenta bancaria", question: "¿Qué haces?", options: [{ text: "Envías los documentos, es una buena oferta", correct: false }, { text: "Investigas la empresa primero en Google", correct: false }, { text: "Eliminas el email, es una estafa de robo de identidad", correct: true }, { text: "Envías solo la foto de cédula", correct: false }], explanation: "Solicitar documentos de identidad y datos bancarios desde el inicio es señal de robo de identidad.", redFlags: ["Oferta no solicitada", "Solicita documentos de identidad", "Datos bancarios al inicio"], points: 150 },
  { id: 112, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Phishing de Microsoft 365", description: "Recibes este email:", content: "De: admin@microsoft-365-renewal.com\nAsunto: Su licencia de Office 365 expira hoy\n\nRenueve su licencia para no perder acceso.\nHaga clic y actualice el pago:\n→ https://ms365-renew-now.com/pay\n\nSin renovación, perderá todos sus archivos.", question: "¿Qué haces?", options: [{ text: "Haces clic para no perder tus archivos", correct: false }, { text: "Consultas con el área de TI de tu institución", correct: true }, { text: "Pagas directamente por el link del email", correct: false }, { text: "Reenvías a tu jefe para que decida", correct: false }], explanation: "Las licencias de Microsoft se renuevan a través de microsoft.com o el área de TI institucional, nunca por links en emails.", redFlags: ["Dominio no oficial", "Amenaza de perder archivos", "Urgencia de renovación"], points: 200 },
  { id: 113, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Email del IESS Ecuador", description: "Recibes este email:", content: "De: notificacion@iess-ecuador.org\nAsunto: Actualice sus datos o pierde beneficios\n\nApreciado afiliado, debe actualizar\nsus datos antes del viernes.\n→ http://iess-actualizacion.tk/datos", question: "¿Qué haces?", options: [{ text: "Haces clic para actualizar tus datos", correct: false }, { text: "Ingresas directamente a iess.gob.ec", correct: true }, { text: "Llamas al teléfono del email", correct: false }, { text: "Envías tus datos por email de respuesta", correct: false }], explanation: "El IESS solo envía comunicaciones desde iess.gob.ec. Dominios .org o .tk son fraudulentos.", redFlags: ["Dominio no .gob.ec", "Amenaza de perder beneficios", "URL .tk"], points: 100 },
  { id: 114, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Phishing de Facebook", description: "Recibes este mensaje en Facebook:", content: "Tu cuenta ha sido reportada por\nviolación de derechos de autor.\n\nApela aquí en las próximas 24h\no tu cuenta será eliminada permanentemente:\nhttps://fb-appeal-center.com/review", question: "¿Qué haces?", options: [{ text: "Haces clic para apelar y salvar tu cuenta", correct: false }, { text: "Verificas en la configuración oficial de Facebook", correct: true }, { text: "Completas el formulario del link urgente", correct: false }, { text: "Cierras sesión para proteger tu cuenta", correct: false }], explanation: "Facebook gestiona apelaciones solo dentro de su plataforma oficial, nunca por links externos.", redFlags: ["URL no facebook.com", "Urgencia de 24 horas", "Amenaza de eliminar cuenta"], points: 150 },
  { id: 115, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Clone phishing de factura", description: "Recibes un email de un proveedor conocido:", content: "De: facturas@proveedor-tec.com\nAsunto: RE: Factura #2847 - datos bancarios actualizados\n\nEstimado cliente, hemos actualizado\nnuestra cuenta bancaria. Por favor\nrealice el pago a la nueva cuenta:\nBanco: Produbanco\nCuenta: 98765432", question: "¿Qué haces?", options: [{ text: "Realizas el pago a la nueva cuenta", correct: false }, { text: "Llamas al proveedor al número que ya conoces", correct: true }, { text: "Respondes el email confirmando el cambio", correct: false }, { text: "Esperas confirmación por email antes de pagar", correct: false }], explanation: "Clone phishing intercepta comunicaciones reales. Siempre llama al proveedor para confirmar cambios bancarios.", redFlags: ["Cambio de cuenta bancaria por email", "Sin verificación previa", "Urgencia en el pago"], points: 200 },
  { id: 116, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "SMS de entrega de paquete", description: "Recibes este SMS:", content: "SERVIENTREGA: Su paquete\n#SE847291 no pudo ser entregado.\nReagende aquí:\nhttp://se-ecuador.tk/reagendar\n\nVálido 48 horas", question: "¿Qué haces?", options: [{ text: "Haces clic para reagendar la entrega", correct: false }, { text: "Ingresas a servientrega.com.ec oficial", correct: true }, { text: "Respondes el SMS con tu dirección", correct: false }, { text: "Esperas que vuelvan a llamar", correct: false }], explanation: "Las empresas de courier oficiales gestionan reprogramaciones solo desde sus sitios oficiales, no por SMS con links .tk.", redFlags: ["Link .tk en SMS", "Empresa de courier por SMS", "Urgencia de 48 horas"], points: 100 },
  { id: 117, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Phishing de Zoom", description: "Recibes este email:", content: "De: noreply@zoom-meetings.net\nAsunto: Reunión programada - únete ahora\n\nTienes una reunión en 5 minutos.\nHaz clic para unirte:\n→ http://zoom-meet-join.com/room847\n\nSe requiere actualización del cliente.", question: "¿Qué haces?", options: [{ text: "Haces clic y descargas la actualización", correct: false }, { text: "Verificas en zoom.us si tienes reunión pendiente", correct: true }, { text: "Te unes rápido para no llegar tarde", correct: false }, { text: "Descargas la actualización desde el link", correct: false }], explanation: "Zoom solo envía links desde zoom.us. Links de reuniones falsas pueden instalar malware.", redFlags: ["Dominio diferente a zoom.us", "Reunión inesperada", "Descarga de actualización"], points: 150 },
  { id: 118, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Phishing multi-etapa", description: "Recibes un email y haces clic:", content: "El link te lleva a una página idéntica\nal portal FAE. Ingresas tu usuario\ny contraseña. Aparece un mensaje:\n\nVerificación adicional requerida.\nIngresa el código que llega a tu\ncelular para completar el acceso.", question: "¿Qué haces?", options: [{ text: "Ingresas el código, parece el portal oficial", correct: false }, { text: "Cierras inmediatamente y cambias tu contraseña", correct: true }, { text: "Ingresas el código solo para ver qué pasa", correct: false }, { text: "Llamas a soporte desde el número de la página", correct: false }], explanation: "Los ataques avanzados replican portales exactos y solicitan el 2FA para robarlo en tiempo real.", redFlags: ["Portal idéntico al oficial", "Solicita código 2FA", "Acceso desde link de email"], points: 200 },
  { id: 119, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Email de confirmación falso", description: "Recibes este email:", content: "De: pedidos@amazon-confirmacion.net\nAsunto: Confirmación de pedido #1847294\n\nGracias por tu compra de $459.99\n(MacBook Air)\n\nSi no realizaste esta compra:\n→ http://amazon-cancel.tk/order", question: "¿Qué haces?", options: [{ text: "Haces clic para cancelar el pedido falso", correct: false }, { text: "Ingresas a amazon.com para verificar tus pedidos", correct: true }, { text: "Respondes diciendo que no hiciste el pedido", correct: false }, { text: "Llamas al número del email", correct: false }], explanation: "Amazon solo envía confirmaciones desde @amazon.com. Verifica siempre en amazon.com directamente.", redFlags: ["Dominio no amazon.com", "Compra no reconocida", "Link .tk para cancelar"], points: 100 },
  { id: 120, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Phishing de recursos humanos", description: "Recibes este email en el trabajo:", content: "De: rrhh-fae@gmail.com\nAsunto: Actualización de datos para nómina\n\nEstimado personal, para el pago de\nnómina del mes actualice sus datos:\n→ https://forms.google.com/rrhh-fae\n\nFecha límite: mañana", question: "¿Qué haces?", options: [{ text: "Completas el formulario para no tener problemas con el pago", correct: false }, { text: "Contactas directamente al departamento de RRHH", correct: true }, { text: "Completas solo los datos básicos", correct: false }, { text: "Reenvías a tus compañeros por si acaso", correct: false }], explanation: "RRHH institucional nunca usa Gmail para solicitar datos. Verifica siempre en persona o por canales oficiales.", redFlags: ["Gmail para comunicación oficial", "Urgencia de fecha límite", "Solicita datos personales"], points: 150 },
  { id: 121, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Whaling al asistente", description: "El asistente del comandante recibe:", content: "De: cmdte.fae@gmail.com\nAsunto: Autorización urgente para ejercicio\n\nNecesito que autorice de inmediato\nel acceso de esta empresa contratista\nal sistema SIAFF.\nEs para el ejercicio de mañana.\nNo lo comentes.", question: "¿Qué haces?", options: [{ text: "Autorizas el acceso, es el comandante", correct: false }, { text: "Verificas por teléfono con el comandante antes", correct: true }, { text: "Envías la autorización a su email oficial FAE", correct: false }, { text: "Autorizas con copia a seguridad", correct: false }], explanation: "El comandante no usaría Gmail para comunicaciones oficiales. Siempre verificar autorizaciones de acceso por voz.", redFlags: ["Gmail para comunicación oficial", "Acceso a sistemas urgente", "Sin canal oficial"], points: 200 },
  { id: 122, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Email de Correos del Ecuador", description: "Recibes este email:", content: "De: tracking@correos-ecuador.net\nAsunto: Paquete retenido - pago requerido\n\nSu paquete está retenido por impuesto.\nPague $8.50 aquí:\n→ http://correos-ec-pago.tk/pay", question: "¿Qué haces?", options: [{ text: "Pagas los $8.50 para recibir tu paquete", correct: false }, { text: "Ingresas a correos.gob.ec para verificar", correct: true }, { text: "Respondes el email con tus datos", correct: false }, { text: "Llamas al número del email", correct: false }], explanation: "Correos del Ecuador solo opera desde correos.gob.ec. Cualquier otro dominio es fraudulento.", redFlags: ["Dominio no .gob.ec", "Pago por link externo", "URL .tk"], points: 100 },
  { id: 123, category: "Phishing", icon: "🎣", difficulty: "MEDIO", title: "Phishing de actualización de app", description: "Recibes esta notificación en tu celular:", content: "ACTUALIZACIÓN URGENTE\nSu app del Banco Pichincha\nrequiere actualización de seguridad.\n\nDescargue la versión nueva aquí:\nhttp://bp-app-update.net/descarga", question: "¿Qué haces?", options: [{ text: "Descargas la actualización del link", correct: false }, { text: "Actualizas la app solo desde Play Store o App Store oficial", correct: true }, { text: "Descargas pero la escaneas con antivirus antes", correct: false }, { text: "Ignoras la notificación por ahora", correct: false }], explanation: "Las apps bancarias solo se actualizan desde las tiendas oficiales. Nunca descargues APKs o apps desde links externos.", redFlags: ["Link externo para app bancaria", "Actualización fuera de tienda oficial", "Dominio sospechoso"], points: 150 },
  { id: 124, category: "Phishing", icon: "🎣", difficulty: "DIFÍCIL", title: "Spear phishing con OSINT", description: "Recibes este email muy personalizado:", content: "De: coordinacion@ejercicio-andfas.mil.ec\nAsunto: Actualización ejercicio ANDFAS 2026\n\nEstimado Tcrn., en seguimiento\nal ejercicio del 15 de marzo, adjunto\nlos nuevos protocolos.\n\n[protocolo_ciber_ANDFAS.pdf.exe]", question: "¿Qué haces?", options: [{ text: "Abres el archivo, es sobre un ejercicio real", correct: false }, { text: "Verificas con el coordinador del ejercicio por teléfono", correct: true }, { text: "Abres solo si el antivirus no detecta nada", correct: false }, { text: "Respondes el email pidiendo confirmación", correct: false }], explanation: "Los atacantes usan información real para personalizar ataques. Siempre verifica adjuntos inesperados por teléfono.", redFlags: ["Adjunto .exe disfrazado", "Información personal en el email", "Ejercicio real como pretexto"], points: 200 },
  { id: 125, category: "Phishing", icon: "🎣", difficulty: "FÁCIL", title: "Phishing de encuesta con premio", description: "Recibes este email:", content: "De: encuestas@movistar-premios.net\nAsunto: Completa nuestra encuesta y gana $500\n\nEstimado cliente, por ser usuario fiel\npuedes ganar $500.\nCompleta aquí en 10 minutos:\n→ http://movistar-encuesta.tk/premio", question: "¿Qué haces?", options: [{ text: "Completas la encuesta para ganar el premio", correct: false }, { text: "Eliminas el email, es una estafa", correct: true }, { text: "Completas la encuesta sin dar datos bancarios", correct: false }, { text: "Verificas en el sitio oficial de Movistar", correct: false }], explanation: "Las encuestas con premios que llegan por email son siempre estafas de phishing para robar datos personales.", redFlags: ["Premio por encuesta no solicitada", "Dominio no oficial", "Urgencia de 10 minutos"], points: 100 },

  // ===== CONTRASEÑAS NUEVAS =====
  { id: 201, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "Contraseña del WiFi institucional", description: "Un compañero nuevo te pide:", content: "Oye, me puedes dar la contraseña\ndel WiFi institucional?\nOlvidé la mía y necesito\nconectarme urgente para\nuna presentación.", question: "¿Qué haces?", options: [{ text: "Le das la contraseña, es un compañero", correct: false }, { text: "Le dices que solicite acceso a TIC", correct: true }, { text: "Le das pero le pides que no la comparta", correct: false }, { text: "Le conectas tú mismo desde tu dispositivo", correct: false }], explanation: "Las contraseñas institucionales no deben compartirse. TIC gestiona los accesos oficialmente.", redFlags: ["Compartir contraseñas institucionales", "Sin verificar identidad"], points: 100 },
  { id: 202, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Longitud vs complejidad", description: "¿Cuál contraseña es más segura?", content: "Opción A: Xk9#mP2@\n(8 caracteres, muy compleja)\n\nOpción B: mi-perro-se-llama-boby-2024\n(27 caracteres, minúsculas)\n\nOpción C: Cyberhawk-DefensaFAE!2026\n(26 caracteres, con símbolos)", question: "¿Cuál elegirías?", options: [{ text: "Opción A, es muy compleja con símbolos", correct: false }, { text: "Opción B, es larga y fácil de recordar", correct: false }, { text: "Opción C, larga y con complejidad adicional", correct: true }, { text: "Las tres son igualmente seguras", correct: false }], explanation: "La longitud importa más que la complejidad. Una frase larga con algo de complejidad es ideal.", redFlags: ["Contraseña corta aunque compleja", "Sin mezcla de tipos de caracteres"], points: 150 },
  { id: 203, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Política de cambio cada 90 días", description: "Tu compañero hace esto cada 90 días:", content: "Cada 90 días agrego un número\nal final. Contraseña1, Contraseña2,\nContraseña3...\n\nAsí cumplo la política\nsin esfuerzo.", question: "¿Es una buena práctica?", options: [{ text: "Sí, cumple la política institucional", correct: false }, { text: "No, es un patrón predecible y vulnerable", correct: true }, { text: "Sí, siempre que el número sea grande", correct: false }, { text: "La política de 90 días es innecesaria", correct: false }], explanation: "Incrementar números es un patrón conocido. Los investigadores recomiendan frases largas y únicas.", redFlags: ["Patrón incremental predecible", "Cumplimiento superficial de política"], points: 200 },
  { id: 204, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "Contraseña escrita en post-it", description: "Visitas la oficina de un colega y ves:", content: "En un post-it pegado al monitor:\n\nUsuario: aalvarez\nContraseña: FAE2024#admin\n\nEl colega no está en su escritorio.", question: "¿Qué haces?", options: [{ text: "No haces nada, no es tu problema", correct: false }, { text: "Avisas al colega y reportas a seguridad TIC", correct: true }, { text: "Quitas el post-it para protegerlo", correct: false }, { text: "Fotografías el post-it como evidencia", correct: false }], explanation: "Contraseñas escritas en lugares visibles son una violación grave de seguridad. Debe reportarse.", redFlags: ["Contraseña visible en escritorio", "Credenciales expuestas físicamente"], points: 100 },
  { id: 205, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Soporte técnico pide contraseña", description: "Te llama soporte técnico:", content: "Hola, soy del área de TIC.\nNecesito tu contraseña para\nsolucionar un problema en tu equipo.\nEs urgente, el sistema está caído.", question: "¿Qué haces?", options: [{ text: "Das tu contraseña, es soporte oficial", correct: false }, { text: "Te niegas, el soporte legítimo nunca pide contraseñas", correct: true }, { text: "Das solo parte de la contraseña", correct: false }, { text: "Pides que te manden un email antes", correct: false }], explanation: "El soporte técnico legítimo nunca necesita tu contraseña. Pueden acceder a sistemas sin ella.", redFlags: ["Solicitud de contraseña por teléfono", "Urgencia del sistema caído"], points: 150 },
  { id: 206, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Brecha de datos en LinkedIn", description: "Recibes este aviso legítimo:", content: "LinkedIn informa que tu email\napareció en una brecha de datos.\nTu contraseña puede estar comprometida.\n\nUsas la misma contraseña de LinkedIn\nen tu email y en el portal FAE.", question: "¿Qué haces?", options: [{ text: "Solo cambias la contraseña de LinkedIn", correct: false }, { text: "Cambias la contraseña en todos los servicios donde la usas", correct: true }, { text: "Esperas para ver si hay algún problema", correct: false }, { text: "Eliminas tu cuenta de LinkedIn", correct: false }], explanation: "Si reutilizas contraseñas, una brecha en un servicio compromete todos. Cambia todas de inmediato.", redFlags: ["Contraseña reutilizada", "No actuar tras brecha"], points: 200 },
  { id: 207, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "Contraseña basada en datos personales", description: "Tu amigo usa como contraseña:", content: "FabianaAlejandra0804\n\nEs el nombre de su hija y su\nfecha de cumpleaños.\nNunca lo voy a olvidar\ny nadie lo puede adivinar.", question: "¿Es segura?", options: [{ text: "Sí, es larga y personal, difícil de adivinar", correct: false }, { text: "No, los datos personales son fáciles de encontrar en redes sociales", correct: true }, { text: "Sí, siempre que no la comparta", correct: false }, { text: "Depende de si tiene redes sociales", correct: false }], explanation: "Los atacantes usan OSINT para recopilar datos personales de redes sociales y crear contraseñas de diccionario.", redFlags: ["Nombre de familiar", "Fecha de nacimiento", "Datos de redes sociales"], points: 100 },
  { id: 208, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Compartir contraseña con el jefe", description: "Tu jefe te dice:", content: "Necesito acceder a tu sesión\npara revisar un documento urgente.\nDame tu contraseña,\nes solo por 5 minutos.", question: "¿Qué haces?", options: [{ text: "Le das la contraseña, es tu jefe directo", correct: false }, { text: "Le ofreces hacer tú mismo la búsqueda del documento", correct: true }, { text: "Le das pero la cambias inmediatamente después", correct: false }, { text: "Le pides que espere a que estés presente", correct: false }], explanation: "Nunca compartas contraseñas, ni con tu jefe. Ofrece alternativas que no comprometan tus credenciales.", redFlags: ["Compartir con superiores", "Urgencia temporal"], points: 150 },
  { id: 209, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Ataque de diccionario", description: "Un hacker prueba contraseñas automáticamente:", content: "El sistema prueba:\n- Contraseñas comunes (password, 123456)\n- Variaciones con números al final\n- Palabras del diccionario\n- Datos personales de tus redes\n\nTu contraseña es: Ecuador2024", question: "¿Qué tan vulnerable eres?", options: [{ text: "Poco vulnerable, tiene mayúscula y número", correct: false }, { text: "Muy vulnerable, sigue patrones predecibles de diccionario", correct: true }, { text: "Seguro porque tiene 10 caracteres", correct: false }, { text: "Depende de cuántos intentos permite el sistema", correct: false }], explanation: "Ecuador2024 es una combinación país+año extremadamente común en diccionarios de ataque.", redFlags: ["País + año", "Patrón de diccionario común", "Menos de 12 caracteres"], points: 200 },
  { id: 210, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "Contraseña en papel bajo el teclado", description: "Como nuevo en el área, el coordinador te dice:", content: "Tu contraseña provisional está\nen el papel bajo tu teclado.\nCámbiala cuando puedas.", question: "¿Qué haces?", options: [{ text: "Usas la contraseña provisional por el momento", correct: false }, { text: "Cambias la contraseña inmediatamente al primer acceso", correct: true }, { text: "Guardas el papel en un cajón con llave", correct: false }, { text: "Memorizas la contraseña y dejas el papel", correct: false }], explanation: "Las contraseñas provisionales deben cambiarse inmediatamente. Es una vulnerabilidad activa.", redFlags: ["Contraseña provisional sin cambio", "Papel con contraseña accesible"], points: 100 },
  { id: 211, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Gestor de contraseñas gratuito", description: "Quieres usar un gestor de contraseñas:", content: "Opción A: Bitwarden (gratuito, código abierto)\nOpción B: 1Password (de pago, $3/mes)\nOpción C: Guardar en el navegador Chrome\nOpción D: Anotar en un archivo Word", question: "¿Cuál recomiendas?", options: [{ text: "D - Word es accesible y fácil", correct: false }, { text: "C - Chrome ya lo hace automáticamente", correct: false }, { text: "A o B - Ambos gestores dedicados son buenos", correct: true }, { text: "B - Solo los de pago son seguros", correct: false }], explanation: "Bitwarden es excelente y gratuito. Los gestores dedicados son superiores al almacenamiento del navegador.", redFlags: ["Word sin cifrado", "Navegador como único gestor"], points: 150 },
  { id: 212, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Contraseña visible en pantalla compartida", description: "Durante una videollamada de Zoom compartes pantalla:", content: "Sin darte cuenta aparece brevemente\ntu Escritorio con un archivo llamado:\ncontraseñas_trabajo.txt\nabierto en el fondo de pantalla.", question: "¿Qué haces?", options: [{ text: "No haces nada, fue muy brevemente", correct: false }, { text: "Cambias todas las contraseñas del archivo inmediatamente", correct: true }, { text: "Cierras el archivo para que no se vea más", correct: false }, { text: "Avisas a los participantes que fue accidental", correct: false }], explanation: "Si las contraseñas fueron visibles aunque sea brevemente, deben cambiarse de inmediato.", redFlags: ["Contraseñas en texto plano", "Exposición en pantalla compartida"], points: 200 },
  { id: 213, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "PIN del celular institucional", description: "El oficial nuevo pregunta:", content: "¿Cuál es el PIN del celular\ninstitucional compartido del área?\nNecesito hacer una llamada urgente.", question: "¿Qué haces?", options: [{ text: "Le das el PIN, es una urgencia", correct: false }, { text: "Haces tú la llamada o reportas a su superior", correct: true }, { text: "Le das el PIN con confianza", correct: false }, { text: "Le dices que pregunte al jefe del área", correct: false }], explanation: "Los PINs y accesos a equipos institucionales no deben compartirse. Ofrece alternativas seguras.", redFlags: ["PIN de equipo institucional", "Urgencia como excusa", "Nuevo sin autorización"], points: 100 },
  { id: 214, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Contraseñas en correo electrónico", description: "Tu administrador te envía:", content: "De: sysadmin@fae.mil.ec\nAsunto: Credenciales de acceso al nuevo sistema\n\nSus credenciales son:\nUsuario: alvarez.a\nContraseña temporal: FAE#2024temp\n\nPor favor no comparta este email.", question: "¿Qué debes hacer?", options: [{ text: "Guardar el email como respaldo de la contraseña", correct: false }, { text: "Cambiar la contraseña temporal inmediatamente tras el primer acceso", correct: true }, { text: "Reenviar el email a tu correo personal como respaldo", correct: false }, { text: "Usar la contraseña temporal indefinidamente", correct: false }], explanation: "Las contraseñas temporales deben cambiarse inmediatamente. Los emails con credenciales son un riesgo.", redFlags: ["Conservar contraseña temporal", "Reenviar email con credenciales"], points: 150 },
  { id: 215, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Credential stuffing", description: "Un atacante obtiene contraseñas de brechas previas:", content: "Tu email fue expuesto en la brecha\nde Canva (2019) con contraseña: Verano2019\n\nUsas esa misma contraseña en el\nportal FAE desde 2019.", question: "¿Estás comprometido?", options: [{ text: "No, el portal FAE es diferente a Canva", correct: false }, { text: "Sí, el atacante puede tener acceso al portal FAE", correct: true }, { text: "Solo si el atacante sabe que usas FAE", correct: false }, { text: "No si tienes 2FA activado en FAE", correct: false }], explanation: "Credential stuffing prueba credenciales filtradas en otros servicios. Si reutilizas contraseñas, estás expuesto.", redFlags: ["Contraseña reutilizada desde 2019", "Email expuesto en brecha", "Sin cambio de contraseña"], points: 200 },
  { id: 216, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "¿Cuándo cambiar contraseña?", description: "¿En cuál situación DEBES cambiar tu contraseña inmediatamente?", content: "A) Cada 90 días por política\nB) Cuando sospechas que alguien la vio\nC) Cuando un servicio reporta una brecha\nD) Cuando usaste un equipo no confiable", question: "¿Cuándo cambiar?", options: [{ text: "Solo A - cuando lo pide la política", correct: false }, { text: "Solo C - cuando hay brechas conocidas", correct: false }, { text: "B, C y D - situaciones de riesgo real", correct: true }, { text: "Solo cuando notes actividad sospechosa", correct: false }], explanation: "Debes cambiar contraseña ante cualquier situación de riesgo, no solo por calendario.", redFlags: ["Solo cambiar por política", "Esperar actividad sospechosa"], points: 100 },
  { id: 217, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Compartir acceso con proveedor externo", description: "Un proveedor de TI externo necesita acceso:", content: "El proveedor dice que necesita tu\nusuario y contraseña para hacer\nuna migración de datos este fin de semana.\nSolo lo necesita hasta el lunes.", question: "¿Qué haces?", options: [{ text: "Le das tus credenciales, es temporal", correct: false }, { text: "Solicitas a TIC que cree credenciales temporales para el proveedor", correct: true }, { text: "Le das pero con una contraseña temporal que tú eliges", correct: false }, { text: "Estás presente durante toda la migración", correct: false }], explanation: "Los proveedores externos deben tener credenciales propias y temporales, nunca las tuyas.", redFlags: ["Credenciales propias a terceros", "Acceso temporal sin gestión oficial"], points: 150 },
  { id: 218, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Have I Been Pwned", description: "Revisas en haveibeenpwned.com y encuentras:", content: "Tu email aparece en 4 brechas:\n- Adobe (2013)\n- LinkedIn (2016)\n- Canva (2019)\n- RockYou2021\n\nUsas la misma contraseña base\ndesde 2013 con variaciones anuales.", question: "¿Qué tan urgente es el problema?", options: [{ text: "Poco urgente, fueron hace años", correct: false }, { text: "Solo cambiar en los servicios afectados", correct: false }, { text: "Muy urgente, cambiar todo y usar contraseñas únicas", correct: true }, { text: "Solo si ves actividad sospechosa reciente", correct: false }], explanation: "Las bases de datos filtradas circulan indefinidamente. Debes cambiar todo inmediatamente y nunca reutilizar.", redFlags: ["Múltiples brechas", "Contraseña reutilizada por años", "Variaciones predecibles"], points: 200 },
  { id: 219, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "Contraseña de red social débil", description: "Usas estas contraseñas:", content: "Instagram: instagram2024\nFacebook: facebook2024\n\nSon diferentes para cada red\ny fáciles de recordar.", question: "¿Son seguras?", options: [{ text: "Sí, son diferentes para cada red", correct: false }, { text: "No, siguen el patrón predecible nombre_servicio+año", correct: true }, { text: "Sí, tienen 13 caracteres que es suficiente", correct: false }, { text: "Solo si activas 2FA además", correct: false }], explanation: "Contraseñas basadas en el nombre del servicio son un patrón conocido por atacantes.", redFlags: ["Patrón servicio+año", "Predecibles aunque sean diferentes"], points: 100 },
  { id: 220, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Fuerza bruta - tiempo de crackeo", description: "¿Cuánto tarda en romperse cada contraseña?", content: "A) abc123 - 6 caracteres\n   → instantáneo\n\nB) Falcon7! - 8 caracteres\n   → pocas horas\n\nC) CyberFAE-Seguridad!2026\n   → miles de años\n\nD) P@ss - 4 caracteres\n   → instantáneo", question: "¿Cuál usarías?", options: [{ text: "B - tiene mayúscula, número y símbolo", correct: false }, { text: "A - es fácil de recordar", correct: false }, { text: "C - longitud hace la diferencia", correct: true }, { text: "D - es suficiente con símbolo", correct: false }], explanation: "La longitud es el factor más importante. 20+ caracteres bien elegidos son prácticamente irrompibles.", redFlags: ["Contraseñas cortas", "Priorizar facilidad sobre seguridad"], points: 150 },
  { id: 221, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Keylogger en PC compartida", description: "Usas una computadora compartida en la base:", content: "Escribes tu contraseña en el portal FAE\ndesde la PC compartida de la sala de espera.\n\nSin saberlo, esa PC tiene instalado\nun keylogger que registra todo lo\nque escribes en el teclado.", question: "¿Qué debes hacer?", options: [{ text: "Nada, si no ves actividad sospechosa estás bien", correct: false }, { text: "Cambiar tu contraseña desde un equipo seguro inmediatamente", correct: true }, { text: "Escanear la PC compartida con antivirus", correct: false }, { text: "Reportar la PC pero esperar confirmación", correct: false }], explanation: "Si ingresaste credenciales en una PC no confiable, asume que están comprometidas y cámbialas inmediatamente.", redFlags: ["PC compartida no confiable", "Posible keylogger", "Credenciales en equipo ajeno"], points: 200 },
  { id: 222, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "Contraseña para múltiples sistemas", description: "Llegas nuevo a la institución y usas:", content: "La misma contraseña para:\n- Portal FAE\n- Email institucional\n- Sistema de nómina\n- VPN\n- Red WiFi\n\nAsí solo debes recordar una.", question: "¿Es seguro?", options: [{ text: "Sí, es eficiente y fácil de recordar", correct: false }, { text: "No, si comprometen uno comprometen todos", correct: true }, { text: "Sí, si la contraseña es muy fuerte", correct: false }, { text: "Solo si cambias todos al mismo tiempo", correct: false }], explanation: "Una sola contraseña para todo significa que comprometer un sistema expone todos los demás.", redFlags: ["Una contraseña para todo", "Sin aislamiento entre sistemas"], points: 100 },
  { id: 223, category: "Contraseñas", icon: "🔐", difficulty: "MEDIO", title: "Contraseña temporal no cambiada", description: "Llevas 6 meses con la contraseña temporal:", content: "Al ingresar al sistema hace 6 meses\nrecibiste la contraseña temporal:\nTEMP@2024fae\n\nNunca la cambiaste porque\nel sistema no te obligó.", question: "¿Hay algún problema?", options: [{ text: "No, si funciona no hay que cambiarla", correct: false }, { text: "Sí, la contraseña temporal es conocida por el administrador y debe cambiarse", correct: true }, { text: "Solo si alguien más la conoce", correct: false }, { text: "Solo si caduca por política", correct: false }], explanation: "Las contraseñas temporales son conocidas por quien las creó y deben cambiarse inmediatamente al primer acceso.", redFlags: ["Contraseña temporal sin cambiar", "Conocida por el administrador"], points: 150 },
  { id: 224, category: "Contraseñas", icon: "🔐", difficulty: "DIFÍCIL", title: "Rainbow table attack", description: "Un atacante obtiene la base de datos de contraseñas sin salt:", content: "MD5(password) = 5f4dcc3b5aa765d61d8327deb882cf99\n\nEl atacante tiene una tabla con millones\nde hashes precalculados (rainbow table)\ny encuentra tu hash en segundos.", question: "¿Cuál contraseña sobrevive mejor?", options: [{ text: "password (hash MD5 común)", correct: false }, { text: "Ecuador2024 (hash MD5 común)", correct: false }, { text: "xK9#mP2@vL5!qR8nZw3 (única y compleja)", correct: true }, { text: "123456789 (hash muy común)", correct: false }], explanation: "Las rainbow tables precalculan hashes de contraseñas comunes. Contraseñas únicas y complejas no están en esas tablas.", redFlags: ["Contraseñas comunes en tablas precalculadas", "Sin salt en el sistema"], points: 200 },
  { id: 225, category: "Contraseñas", icon: "🔐", difficulty: "FÁCIL", title: "Verificar brechas de datos", description: "¿Cómo sabes si tu contraseña fue comprometida?", content: "Herramientas disponibles:\nA) haveibeenpwned.com - verifica emails y contraseñas\nB) Google Password Checkup - integrado en Chrome\nC) Bitwarden - alerta de brechas automáticamente\nD) Todas las anteriores son válidas", question: "¿Cuál usarías?", options: [{ text: "Solo A, es el más conocido", correct: false }, { text: "Solo B, Google es más confiable", correct: false }, { text: "D - todas son herramientas válidas y confiables", correct: true }, { text: "Ninguna, es riesgoso ingresar tu email en sitios externos", correct: false }], explanation: "Todas estas herramientas son legítimas y confiables para verificar si tus credenciales fueron comprometidas.", redFlags: ["No verificar brechas periódicamente", "Desconocer herramientas de seguridad"], points: 100 },


  // ===== WIFI PÚBLICO NUEVAS =====
  { id: 301, category: "WiFi Público", icon: "📶", difficulty: "FÁCIL", title: "VPN en red pública", description: "Estás en el WiFi de un centro comercial:", content: "Necesitas revisar tu email institucional\nde la FAE desde el WiFi del mall.\n\nTienes instalada una VPN en tu laptop\npero no la has activado.", question: "¿Qué debes hacer?", options: [{ text: "Revisas el email sin activar la VPN, es rápido", correct: false }, { text: "Activas la VPN antes de revisar el email institucional", correct: true }, { text: "Usas el modo incógnito del navegador", correct: false }, { text: "Esperas a llegar a la base para revisar", correct: false }], explanation: "El modo incógnito no cifra el tráfico. La VPN es necesaria para proteger comunicaciones en WiFi público.", redFlags: ["Email institucional sin VPN", "Modo incógnito no es VPN"], points: 100 },
  { id: 302, category: "WiFi Público", icon: "📶", difficulty: "MEDIO", title: "Hotspot personal vs WiFi público", description: "Estás de viaje y necesitas trabajar:", content: "Opciones disponibles:\nA) WiFi del hotel gratuito sin contraseña\nB) Tu hotspot personal del celular\nC) WiFi del lobby con contraseña del hotel\nD) VPN más WiFi del hotel", question: "¿Cuál es la más segura?", options: [{ text: "A - WiFi gratuito del hotel", correct: false }, { text: "B - Hotspot personal", correct: false }, { text: "C - WiFi con contraseña del hotel", correct: false }, { text: "B o D - Hotspot personal o VPN más WiFi", correct: true }], explanation: "El hotspot personal es seguro. La VPN sobre WiFi del hotel también. WiFi público sin VPN es riesgoso.", redFlags: ["WiFi público sin VPN", "Contraseña de hotel no garantiza privacidad"], points: 150 },
  { id: 303, category: "WiFi Público", icon: "📶", difficulty: "DIFÍCIL", title: "Man-in-the-Middle en WiFi", description: "Estás en un café usando WiFi público:", content: "Sin saberlo, hay un atacante en la\nmisma red ejecutando un ataque\nMan-in-the-Middle.\n\nPuede ver todo tu tráfico no cifrado\nincluidos sitios HTTP y consultas DNS.", question: "¿Qué protección tienes?", options: [{ text: "HTTPS en sitios web te protege completamente", correct: false }, { text: "VPN activa te protege de este ataque", correct: true }, { text: "Usando modo incógnito estás protegido", correct: false }, { text: "El antivirus detecta este tipo de ataque", correct: false }], explanation: "Solo la VPN cifra todo el tráfico incluyendo DNS. HTTPS protege el contenido pero no los metadatos.", redFlags: ["WiFi público sin VPN", "Confianza solo en HTTPS"], points: 200 },
  { id: 304, category: "WiFi Público", icon: "📶", difficulty: "FÁCIL", title: "Desactivar WiFi cuando no se usa", description: "Sales de un restaurante con el WiFi activo:", content: "Tu celular tiene el WiFi activado.\nSe conectará automáticamente a redes\nconocidas o intentará conectar\na redes abiertas cercanas.", question: "¿Qué debes hacer?", options: [{ text: "Dejas el WiFi activo, es más cómodo", correct: false }, { text: "Desactivas el WiFi hasta necesitarlo de nuevo", correct: true }, { text: "Solo desactivas si la batería está baja", correct: false }, { text: "No importa si tienes antivirus", correct: false }], explanation: "El WiFi activo busca redes automáticamente y puede conectarse a redes maliciosas. Desactívalo cuando no lo uses.", redFlags: ["WiFi activo sin usar", "Conexión automática a redes desconocidas"], points: 100 },
  { id: 305, category: "WiFi Público", icon: "📶", difficulty: "MEDIO", title: "Portal cautivo de WiFi público", description: "Te conectas al WiFi de un hotel y aparece:", content: "Una página de inicio que pide:\n- Tu nombre completo\n- Número de habitación\n- Email personal\n- Número de teléfono", question: "¿Qué haces?", options: [{ text: "Completas todos los datos para conectarte", correct: false }, { text: "Usas datos mínimos y activas VPN después", correct: true }, { text: "Te niegas y usas solo tus datos móviles", correct: false }, { text: "Pides al hotel que no recolecten datos", correct: false }], explanation: "Los portales cautivos recopilan datos de marketing. Usa datos mínimos y siempre activa VPN al conectarte.", redFlags: ["Datos excesivos para WiFi", "Sin VPN después de conectar"], points: 150 },
  { id: 306, category: "WiFi Público", icon: "📶", difficulty: "DIFÍCIL", title: "SSL Stripping en WiFi público", description: "En WiFi público sin VPN un atacante ejecuta SSL Stripping:", content: "Convierte conexiones HTTPS a HTTP\nsin que notes la diferencia visual.\n\nAccedes a tu email creyendo que\nusas HTTPS pero en realidad es HTTP.", question: "¿Cómo te proteges?", options: [{ text: "Verificando el candado en el navegador", correct: false }, { text: "Usando VPN que cifra antes del punto de salida", correct: true }, { text: "Solo usando Chrome que detecta esto", correct: false }, { text: "Verificando que la URL empiece con https", correct: false }], explanation: "SSL Stripping puede engañar visualmente. La VPN cifra el tráfico antes de salir de tu dispositivo.", redFlags: ["Confianza solo en candado HTTPS", "WiFi público sin VPN"], points: 200 },
  { id: 307, category: "WiFi Público", icon: "📶", difficulty: "FÁCIL", title: "Olvidar redes WiFi públicas", description: "Después de usar el WiFi de un aeropuerto:", content: "Tu dispositivo guardó la red:\nAirport_Free_WiFi\n\nLa próxima vez que estés cerca\nde cualquier aeropuerto, tu dispositivo\nbuscará esa red automáticamente.", question: "¿Qué debes hacer?", options: [{ text: "Dejas la red guardada, es conveniente", correct: false }, { text: "Eliminas la red guardada de tu dispositivo", correct: true }, { text: "Solo la eliminas si tienes problemas", correct: false }, { text: "Desactivas solo la reconexión automática", correct: false }], explanation: "Las redes públicas guardadas pueden causar que te conectes a redes falsas con el mismo nombre. Elimínalas.", redFlags: ["Redes públicas guardadas", "Reconexión automática"], points: 100 },
  { id: 308, category: "WiFi Público", icon: "📶", difficulty: "MEDIO", title: "Bluetooth en lugares públicos", description: "Estás en el aeropuerto con Bluetooth activo:", content: "Tu celular tiene Bluetooth encendido.\nUn atacante cercano puede:\n- Ver el nombre de tu dispositivo\n- Intentar emparejarse sin autorización\n- Robar datos mediante Bluesnarfing", question: "¿Qué debes hacer?", options: [{ text: "Dejas el Bluetooth activo, es útil", correct: false }, { text: "Desactivas el Bluetooth cuando no lo necesitas", correct: true }, { text: "Solo lo desactivas en zonas de alta seguridad", correct: false }, { text: "El antivirus protege del Bluetooth", correct: false }], explanation: "El Bluetooth activo innecesariamente es un vector de ataque. Desactívalo cuando no lo uses.", redFlags: ["Bluetooth activo innecesariamente", "Dispositivo visible públicamente"], points: 150 },
  { id: 309, category: "WiFi Público", icon: "📶", difficulty: "DIFÍCIL", title: "Vulnerabilidad KRACK en WPA2", description: "Lees en noticias:", content: "Investigadores descubren vulnerabilidad\nKRACK en protocolo WPA2 que permite\na atacantes descifrar tráfico WiFi\naunque la red tenga contraseña segura.", question: "¿Qué implica para tu seguridad?", options: [{ text: "Solo afecta a redes sin contraseña", correct: false }, { text: "Las redes WPA2 también son vulnerables sin VPN", correct: true }, { text: "Solo afecta si el atacante conoce la contraseña", correct: false }, { text: "WPA3 no existe como solución", correct: false }], explanation: "KRACK demostró que WPA2 puede ser vulnerado. La VPN sigue siendo la capa de protección adicional.", redFlags: ["Confianza total en WPA2", "Sin VPN en redes WiFi"], points: 200 },
  { id: 310, category: "WiFi Público", icon: "📶", difficulty: "FÁCIL", title: "Protocolo WEP vs WPA3", description: "Configuras un router nuevo en la base:", content: "El router ofrece estos protocolos:\nA) WEP compatible con equipos viejos\nB) WPA intermedio\nC) WPA2 estándar actual\nD) WPA3 más nuevo y seguro", question: "¿Cuál debes usar?", options: [{ text: "A - WEP para compatibilidad máxima", correct: false }, { text: "B - WPA es suficiente", correct: false }, { text: "C - WPA2 es el estándar", correct: false }, { text: "D - WPA3 si está disponible si no WPA2", correct: true }], explanation: "WEP y WPA son fácilmente rompibles. WPA3 es el estándar más seguro actual. WPA2 es aceptable si WPA3 no está disponible.", redFlags: ["WEP completamente obsoleto", "WPA con vulnerabilidades conocidas"], points: 100 },
  { id: 311, category: "WiFi Público", icon: "📶", difficulty: "MEDIO", title: "VPN gratuita vs confiable", description: "Necesitas una VPN para viajes:", content: "Opciones:\nA) VPN gratuita de la App Store con términos confusos\nB) ProtonVPN gratuito código abierto\nC) VPN corporativa de la FAE\nD) NordVPN o ExpressVPN de pago", question: "¿Cuál es la mejor opción?", options: [{ text: "A - gratuita de App Store cualquiera sirve", correct: false }, { text: "B o C o D - VPNs confiables y verificadas", correct: true }, { text: "Cualquier VPN gratuita funciona igual", correct: false }, { text: "No necesitas VPN si usas HTTPS", correct: false }], explanation: "Las VPNs gratuitas desconocidas pueden vender tus datos. ProtonVPN, VPN corporativa y servicios de pago son la mejor opción.", redFlags: ["VPN gratuita de origen desconocido", "Términos confusos de servicio"], points: 150 },
  { id: 312, category: "WiFi Público", icon: "📶", difficulty: "DIFÍCIL", title: "Ataque de deautenticación WiFi", description: "Trabajas con WiFi seguro en la oficina cuando:", content: "De repente tu conexión WiFi cae.\nAparece una red con el mismo nombre\nque tu red oficial pero con señal más fuerte.\n\nTu laptop se conecta automáticamente.", question: "¿Qué está pasando?", options: [{ text: "Es un problema técnico del router", correct: false }, { text: "Es un ataque de deautenticación para forzar reconexión a red falsa", correct: true }, { text: "Tu contraseña de WiFi expiró", correct: false }, { text: "Es una actualización del router", correct: false }], explanation: "Los atacantes envían paquetes de deautenticación para desconectarte y luego presentan una red falsa.", redFlags: ["Caída repentina de WiFi", "Red igual con más señal", "Reconexión automática"], points: 200 },
  { id: 313, category: "WiFi Público", icon: "📶", difficulty: "FÁCIL", title: "Red WiFi institucional falsa", description: "Fuera de la base ves esta red disponible:", content: "FAE_Institucional_Libre\nSin contraseña - señal muy fuerte\n\nEsta red no existía la última vez\nque estuviste en este lugar.", question: "¿Qué haces?", options: [{ text: "Te conectas, parece la red oficial de la FAE", correct: false }, { text: "No te conectas, es sospechosa y está fuera de la base", correct: true }, { text: "Te conectas pero solo para ver el email", correct: false }, { text: "Verificas con un compañero si es real", correct: false }], explanation: "Una red con nombre institucional fuera de las instalaciones y sin contraseña es casi siempre una trampa.", redFlags: ["Red institucional fuera de instalaciones", "Sin contraseña", "Red nueva sospechosa"], points: 100 },
  { id: 314, category: "WiFi Público", icon: "📶", difficulty: "MEDIO", title: "Videollamada clasificada en hotel", description: "Estás en un hotel con WiFi disponible:", content: "Tienes una reunión de videoconferencia\nclasificada sobre operaciones de la FAE.\n\nEl hotel tiene WiFi con contraseña\ny tienes tu VPN corporativa activa.", question: "¿Qué debes hacer?", options: [{ text: "Realizas la llamada con WiFi del hotel y VPN activa", correct: false }, { text: "Usas solo tus datos móviles para la reunión clasificada", correct: true }, { text: "Usas WiFi del hotel sin VPN si la señal es buena", correct: false }, { text: "Usas WiFi con VPN en sala privada del hotel", correct: false }], explanation: "Para reuniones clasificadas, los datos móviles son más seguros que cualquier WiFi de terceros, incluso con VPN.", redFlags: ["Reuniones clasificadas en WiFi de hotel", "Depender de VPN de terceros para info clasificada"], points: 150 },
  { id: 315, category: "WiFi Público", icon: "📶", difficulty: "DIFÍCIL", title: "DNS Poisoning en red pública", description: "Conectado a WiFi público sin VPN:", content: "Un atacante ha envenenado el DNS.\nCuando escribes gmail.com en tu navegador,\nel DNS te redirige a una IP maliciosa\nque muestra una copia idéntica de Gmail.", question: "¿Cómo te proteges?", options: [{ text: "HTTPS garantiza que es el sitio real", correct: false }, { text: "VPN usa sus propios DNS cifrados protegiéndote", correct: true }, { text: "El antivirus bloquea páginas falsas", correct: false }, { text: "Verificando que la URL sea correcta", correct: false }], explanation: "DNS Poisoning redirige a nivel de red. La VPN usa sus propios DNS cifrados, evitando el DNS envenenado.", redFlags: ["DNS público no confiable", "Sin VPN en WiFi público"], points: 200 },

  // ===== INGENIERÍA SOCIAL NUEVAS =====
  { id: 401, category: "Ingeniería Social", icon: "🎭", difficulty: "FÁCIL", title: "Tailgating en puerta segura", description: "Entras a una zona restringida con tu tarjeta:", content: "Después de usar tu tarjeta de acceso\npara abrir la puerta, una persona\ndetrás de ti dice:\n\nGracias, se me olvidó mi tarjeta\nen el escritorio. ¿Me deja pasar?", question: "¿Qué haces?", options: [{ text: "Le dejas pasar, parece del personal", correct: false }, { text: "No le dejas pasar y le indicas que obtenga acceso oficialmente", correct: true }, { text: "Le dejas pasar y lo acompañas", correct: false }, { text: "Le dejas pasar porque va tarde", correct: false }], explanation: "El tailgating es una técnica de ingeniería social para entrar a zonas restringidas sin autorización.", redFlags: ["Persona sin identificación", "Solicitud de acceso con excusa"], points: 100 },
  { id: 402, category: "Ingeniería Social", icon: "🎭", difficulty: "MEDIO", title: "Llamada de auditoría interna", description: "Recibes esta llamada:", content: "Hola, soy del departamento de auditoría\ninterna. Estamos verificando el cumplimiento\nde políticas de contraseñas.\n\n¿Puede confirmarme su contraseña actual\npara verificar que cumple los requisitos?", question: "¿Qué haces?", options: [{ text: "Das tu contraseña, es auditoría interna", correct: false }, { text: "Te niegas y reportas la llamada a seguridad", correct: true }, { text: "Das solo los primeros caracteres para verificar", correct: false }, { text: "Pides un email de confirmación antes", correct: false }], explanation: "Auditoría nunca necesita tu contraseña real. Pueden verificar políticas de otras maneras.", redFlags: ["Solicitud de contraseña por auditoría", "Verificación por teléfono"], points: 150 },
  { id: 403, category: "Ingeniería Social", icon: "🎭", difficulty: "DIFÍCIL", title: "Pretexting del director general", description: "Recibes esta llamada en la oficina:", content: "Hola, habla el General Comandante.\nNecesito urgente que me envíes\nla lista de personal con sus\nnúmeros de cédula y datos de\ncontacto personal. Es para un ejercicio\nclasificado. No lo comentes.", question: "¿Qué haces?", options: [{ text: "Envías la lista, es el Comandante", correct: false }, { text: "Verificas la identidad llamando al número oficial del despacho", correct: true }, { text: "Envías pero solo a su email oficial", correct: false }, { text: "Pides que te mande un email de confirmación", correct: false }], explanation: "Siempre verifica solicitudes de datos sensibles, especialmente si vienen de superiores por canales inusuales.", redFlags: ["Solicitud urgente y confidencial", "Canal inusual para info sensible"], points: 200 },
  { id: 404, category: "Ingeniería Social", icon: "🎭", difficulty: "FÁCIL", title: "Encuesta de satisfacción sospechosa", description: "Te llaman para una encuesta:", content: "Somos del área de bienestar de la FAE.\nHacemos una encuesta de satisfacción.\n\nNecesitamos: nombre completo, grado,\nárea de trabajo, horario habitual\ny nombre de su jefe directo.", question: "¿Qué haces?", options: [{ text: "Respondes, es el área de bienestar", correct: false }, { text: "Verificas con el área de bienestar si la encuesta es oficial", correct: true }, { text: "Respondes solo las preguntas básicas", correct: false }, { text: "Cuelgas sin decir nada", correct: false }], explanation: "Las encuestas que recopilan información operacional pueden ser pretexting para obtener inteligencia.", redFlags: ["Datos operacionales en encuesta", "Sin verificación previa"], points: 100 },
  { id: 405, category: "Ingeniería Social", icon: "🎭", difficulty: "MEDIO", title: "Investigador sospechoso en LinkedIn", description: "Recibes este mensaje en LinkedIn:", content: "Hola! Soy investigador de ciberseguridad\nen una universidad. Estudio protocolos\nde la FAE.\n\n¿Podría compartir información sobre\nla estructura de su red institucional\ny los sistemas que utilizan?", question: "¿Qué haces?", options: [{ text: "Compartes información básica, es investigación académica", correct: false }, { text: "Rechazas y reportas el mensaje a seguridad", correct: true }, { text: "Compartes solo información pública", correct: false }, { text: "Preguntas para qué exactamente antes de responder", correct: false }], explanation: "La información sobre infraestructura institucional es sensible. Los atacantes usan perfiles académicos como pretexto.", redFlags: ["Solicitud de info técnica institucional", "Contacto no solicitado en RRSS"], points: 150 },
  { id: 406, category: "Ingeniería Social", icon: "🎭", difficulty: "DIFÍCIL", title: "Pendrive no solicitado en reunión", description: "En una reunión de alto nivel:", content: "Un asistente desconocido distribuye\npendrive con la presentación del día.\n\nEl coordinador dice que no sabe\nde ningún pendrive oficial y que\nél enviará la presentación por email.", question: "¿Qué haces con el pendrive?", options: [{ text: "Lo usas, si el coordinador dice algo lo borras", correct: false }, { text: "Lo conectas solo para ver qué tiene", correct: false }, { text: "No lo conectas y lo entregas a seguridad", correct: true }, { text: "Lo analizas con antivirus antes de usarlo", correct: false }], explanation: "Pendrives no solicitados en reuniones de alto nivel son un vector clásico de ataque.", redFlags: ["Pendrive no solicitado", "Origen desconocido en reunión"], points: 200 },
  { id: 407, category: "Ingeniería Social", icon: "🎭", difficulty: "FÁCIL", title: "Urgencia para saltarse protocolos", description: "Tu superior llega muy apurado:", content: "No tengo tiempo para el protocolo normal.\nNecesito que me des acceso inmediato\nal servidor de respaldos.\nEs una emergencia, te lo explico después.", question: "¿Qué haces?", options: [{ text: "Le das acceso, es tu superior y es urgente", correct: false }, { text: "Sigues el protocolo normal aunque sea urgente", correct: true }, { text: "Le das acceso pero documentas el incidente", correct: false }, { text: "Llamas al jefe de tu superior para confirmar", correct: false }], explanation: "La urgencia es una técnica de manipulación. Los protocolos de seguridad existen precisamente para emergencias.", redFlags: ["Urgencia para saltarse protocolos", "Presión de autoridad"], points: 100 },
  { id: 408, category: "Ingeniería Social", icon: "🎭", difficulty: "MEDIO", title: "Soporte técnico no solicitado", description: "Recibes esta llamada:", content: "Hola, soy del soporte de TIC.\nTenemos reportes de que tu equipo\ntiene un problema de rendimiento.\n\nTe puedo ayudar ahora mismo\nsi me das acceso remoto 5 minutos.", question: "¿Qué haces?", options: [{ text: "Aceptas, es soporte técnico oficial", correct: false }, { text: "Rechazas y llamas tú a TIC para verificar", correct: true }, { text: "Aceptas pero los observas mientras trabajan", correct: false }, { text: "Pides que vengan en persona", correct: false }], explanation: "El soporte legítimo se verifica llamando al número oficial. Nunca aceptes soporte remoto no solicitado.", redFlags: ["Soporte no solicitado", "Oferta de ayuda a cambio de acceso"], points: 150 },
  { id: 409, category: "Ingeniería Social", icon: "🎭", difficulty: "DIFÍCIL", title: "Business Email Compromise", description: "El área financiera recibe:", content: "De: director.financiero@fae-ec.com\nAsunto: Pago urgente a proveedor nuevo\n\nNecesito que procesen hoy el pago\nde $45,000 al proveedor CloudTech.\nEs un contrato nuevo y confidencial.\nDatos bancarios adjuntos.", question: "¿Qué hace el área financiera?", options: [{ text: "Procesa el pago, es del director financiero", correct: false }, { text: "Verifica con el director por teléfono antes de cualquier transferencia", correct: true }, { text: "Procesa pero con copia al jefe directo", correct: false }, { text: "Solicita más documentación por email", correct: false }], explanation: "Business Email Compromise falsifica emails corporativos para desviar pagos. Toda transferencia grande requiere verificación verbal.", redFlags: ["Pago urgente por email", "Proveedor nuevo sin proceso formal", "Dominio diferente al oficial"], points: 200 },
  { id: 410, category: "Ingeniería Social", icon: "🎭", difficulty: "FÁCIL", title: "Documento confidencial en impresora", description: "Encuentras este documento en la impresora:", content: "Un informe con membrete de la FAE\nque contiene:\n- Nombres y grados de personal\n- Horarios de turno\n- Protocolos de seguridad\n\nEstá marcado como CONFIDENCIAL.", question: "¿Qué haces?", options: [{ text: "Lo dejas ahí, no es tuyo", correct: false }, { text: "Lo llevas al área de seguridad y reportas el incidente", correct: true }, { text: "Lo guardas para devolvérselo al dueño", correct: false }, { text: "Lo destruyes en la trituradora de papel", correct: false }], explanation: "Los documentos confidenciales encontrados deben entregarse a seguridad, no guardarse ni destruirse sin autorización.", redFlags: ["Documento confidencial expuesto", "No reportar el hallazgo"], points: 100 },
  { id: 411, category: "Ingeniería Social", icon: "🎭", difficulty: "MEDIO", title: "Autorización por email interno", description: "Recibes este email de un colega:", content: "De: cap.morales@fae.mil.ec\nAsunto: Favor urgente - confidencial\n\nEstoy en reunión no puedo hablar.\nNecesito que autorices acceso\nal sistema SIAFF para el proveedor.\nEs urgente, responde por email.", question: "¿Qué haces?", options: [{ text: "Autorizas por email, es un colega de confianza", correct: false }, { text: "Llamas al Cap. Morales para verificar verbalmente", correct: true }, { text: "Autorizas pero con copia al jefe", correct: false }, { text: "Pides más información por email antes", correct: false }], explanation: "Las cuentas de email pueden estar comprometidas. Las autorizaciones de acceso a sistemas deben verificarse por voz.", redFlags: ["Email como único canal de autorización", "Urgencia más confidencialidad"], points: 150 },
  { id: 412, category: "Ingeniería Social", icon: "🎭", difficulty: "DIFÍCIL", title: "Reconocimiento OSINT avanzado", description: "Un atacante investiga a un oficial usando:", content: "- LinkedIn: grado, función, proyectos\n- Facebook: familia, rutinas, hobbies\n- Instagram: ubicaciones frecuentes\n- Google: noticias y menciones públicas\n\nCon esta info construye un perfil\ndetallado para un ataque dirigido.", question: "¿Cómo te proteges del OSINT?", options: [{ text: "Eliminando todas las redes sociales", correct: false }, { text: "Limitando información profesional y personal en redes", correct: true }, { text: "Usando alias completamente diferentes", correct: false }, { text: "Solo aceptando amigos conocidos en redes", correct: false }], explanation: "Limitar la información pública reduce la superficie de ataque para spear phishing e ingeniería social dirigida.", redFlags: ["Información profesional pública excesiva", "Rutinas predecibles en redes"], points: 200 },
  { id: 413, category: "Ingeniería Social", icon: "🎭", difficulty: "FÁCIL", title: "Regalo USB corporativo sospechoso", description: "Recibes en la oficina un paquete:", content: "Un paquete con membrete de una empresa\ntecnológica conocida que contiene:\n- Una memoria USB con el logo de la empresa\n- Una nota: Gracias por su preferencia.\n  Contenga materiales de muestra.", question: "¿Qué haces?", options: [{ text: "Conectas la USB para ver los materiales", correct: false }, { text: "Entregas la USB a TIC sin conectarla", correct: true }, { text: "Conectas en una PC sin información importante", correct: false }, { text: "Escaneas la USB con antivirus antes", correct: false }], explanation: "Los regalos de USB son vectores conocidos de ataque. Nunca conectes hardware no autorizado.", redFlags: ["USB no solicitada", "Origen de empresa desconocida"], points: 100 },
  { id: 414, category: "Ingeniería Social", icon: "🎭", difficulty: "MEDIO", title: "Mensajero retira equipos sin aviso", description: "Llega un mensajero a la oficina:", content: "Un mensajero dice que tiene que\nretirar unos equipos para mantenimiento.\nTrae una orden de trabajo con membrete.\n\nNo hay aviso previo del departamento\nde TIC sobre ningún mantenimiento.", question: "¿Qué haces?", options: [{ text: "Dejas llevar los equipos, tiene orden de trabajo", correct: false }, { text: "Verificas con TIC antes de permitir retirar cualquier equipo", correct: true }, { text: "Acompañas al mensajero mientras retira los equipos", correct: false }, { text: "Tomas foto de la orden y dejas llevar los equipos", correct: false }], explanation: "Diversion theft usa documentos falsificados para robar equipos. Siempre verifica con el área responsable.", redFlags: ["Retiro de equipos sin aviso previo", "Documentos sin verificar"], points: 150 },
  { id: 415, category: "Ingeniería Social", icon: "🎭", difficulty: "DIFÍCIL", title: "Insider threat - comportamiento sospechoso", description: "Notas que un compañero:", content: "- Trabaja muchas horas fuera de turno\n- Accede a archivos de otras áreas\n- Hace preguntas inusuales sobre sistemas\n- Copia archivos a USB frecuentemente\n- Parece nervioso cuando alguien se acerca", question: "¿Qué haces?", options: [{ text: "No haces nada, puede tener razones válidas", correct: false }, { text: "Reportas las conductas sospechosas a seguridad", correct: true }, { text: "Le preguntas directamente qué está haciendo", correct: false }, { text: "Vigilas más antes de reportar", correct: false }], explanation: "Las señales de insider threat deben reportarse a seguridad. No confrontes directamente al sospechoso.", redFlags: ["Acceso inusual a archivos", "Copia de archivos a USB", "Comportamiento fuera de norma"], points: 200 },

  // ===== REDES SOCIALES NUEVAS =====
  { id: 501, category: "Redes Sociales", icon: "📱", difficulty: "FÁCIL", title: "Publicación de operación militar", description: "Publicas en Facebook:", content: "Llegué a la base de Latacunga.\nMañana comenzamos el ejercicio\nmilitar conjunto ANDFAS 2026.\nEstaremos aquí hasta el 20 de marzo.\n📍 Latacunga, Ecuador", question: "¿Hay algún problema con esta publicación?", options: [{ text: "No, es información general", correct: false }, { text: "Sí, expone ubicación y operación militar sensible", correct: true }, { text: "Solo si es cuenta pública", correct: false }, { text: "Solo si menciona el número de personal", correct: false }], explanation: "Publicar ubicaciones de ejercicios militares en redes sociales compromete la seguridad operacional.", redFlags: ["Ubicación de operación militar", "Fechas de ejercicio público", "Info operacional en redes"], points: 100 },
  { id: 502, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO", title: "Privacidad en WhatsApp", description: "Tu configuración actual de WhatsApp:", content: "- Foto de perfil: visible para todos\n- Estado: visible para todos\n- Última vez visto: visible para todos\n- Grupos: cualquiera puede añadirte\n- Copia de seguridad: Google Drive sin cifrado", question: "¿Qué debes cambiar?", options: [{ text: "Solo la foto de perfil a privada", correct: false }, { text: "Todo: foto, estado, última vez y grupos a contactos. Cifrar respaldo.", correct: true }, { text: "Solo los grupos a contactos", correct: false }, { text: "La configuración actual está bien", correct: false }], explanation: "La configuración por defecto expone demasiada información. Ajusta privacidad a mis contactos como mínimo.", redFlags: ["Visibilidad pública innecesaria", "Respaldo sin cifrar"], points: 150 },
  { id: 503, category: "Redes Sociales", icon: "📱", difficulty: "DIFÍCIL", title: "Desinformación en WhatsApp militar", description: "Un grupo de WhatsApp comparte:", content: "URGENTE: El Ministerio de Defensa\nconfirma que todos los militares\ndeben actualizar su RUC antes del viernes\no perderán beneficios.\nEnlace: http://mindefensa-actualizacion.com", question: "¿Qué haces?", options: [{ text: "Compartes urgente con tus contactos militares", correct: false }, { text: "Ingresas al enlace para actualizar tus datos", correct: false }, { text: "Verificas en el sitio oficial del Ministerio y reportas el mensaje", correct: true }, { text: "Esperas a ver si más personas lo comparten", correct: false }], explanation: "La desinformación en grupos militares puede causar daño real. Siempre verifica en fuentes oficiales antes de actuar o compartir.", redFlags: ["Dominio no oficial del Ministerio", "Urgencia con fecha límite", "Mensaje viral en WhatsApp"], points: 200 },
  { id: 504, category: "Redes Sociales", icon: "📱", difficulty: "FÁCIL", title: "Check-in en base aérea", description: "Tu compañero hace check-in en Facebook:", content: "Trabajando duro💪\n📍 Base Aérea Mariscal Sucre\n[foto del interior de un hangar]", question: "¿Es un problema de seguridad?", options: [{ text: "No, la base es conocida públicamente", correct: false }, { text: "Sí, revela ubicación y actividades en instalación militar", correct: true }, { text: "Solo si la foto muestra equipos clasificados", correct: false }, { text: "Solo si la cuenta es pública", correct: false }], explanation: "El check-in en instalaciones militares revela información operacional y puede comprometer la seguridad de la base.", redFlags: ["Check-in en instalación militar", "Foto interior de instalación"], points: 100 },
  { id: 505, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO", title: "Perfil sospechoso en Facebook", description: "Recibes solicitud en Facebook de:", content: "Perfil: Sofía Mendoza\nFoto: persona muy atractiva\nAmigos en común: 0\nFotos: 5 (solo selfies)\nCuenta creada: 1 mes\n\nMensaje: Hola! Vi tu perfil\ny me parece interesante. ¿Charlamos?", question: "¿Qué haces?", options: [{ text: "Aceptas y respondes, es solo chatear", correct: false }, { text: "Rechazas, las señales sugieren perfil falso o honey trap", correct: true }, { text: "Aceptas pero no compartes información personal", correct: false }, { text: "Investigas el perfil antes de aceptar", correct: false }], explanation: "Perfiles con pocas fotos, cuenta nueva y sin amigos en común son señales de honey trap o scam.", redFlags: ["Cuenta nueva sin amigos comunes", "Pocas fotos", "Contacto no solicitado"], points: 150 },
  { id: 506, category: "Redes Sociales", icon: "📱", difficulty: "DIFÍCIL", title: "Honey trap de inteligencia", description: "Oficial recibe mensajes de una persona desconocida:", content: "Después de semanas de conversación:\nMe alegra tanto hablar contigo.\n¿Me puedes contar más sobre\ntu trabajo? ¿Qué tipo de misiones\nhace la FAE?", question: "¿Qué está pasando?", options: [{ text: "Es una persona genuinamente interesada", correct: false }, { text: "Es un posible honey trap de inteligencia", correct: true }, { text: "Solo es curiosidad normal por el trabajo", correct: false }, { text: "Si no compartes datos clasificados está bien", correct: false }], explanation: "Los honey traps buscan información operacional gradualmente. Cualquier solicitud de información laboral a extraños debe reportarse a contrainteligencia.", redFlags: ["Desconocido pregunta por misiones", "Relación construida para extraer info"], points: 200 },
  { id: 507, category: "Redes Sociales", icon: "📱", difficulty: "FÁCIL", title: "Logout en PC compartida", description: "Usas la PC compartida de la base para revisar Facebook:", content: "Te logueas en Facebook y revisas\ntus mensajes. Al terminar cierras\nla pestaña del navegador.", question: "¿Qué problema hay?", options: [{ text: "Ninguno, cerraste la pestaña", correct: false }, { text: "La sesión puede seguir activa y el próximo usuario puede acceder", correct: true }, { text: "Solo si no tienes 2FA activado", correct: false }, { text: "Solo si la PC tiene virus", correct: false }], explanation: "Cerrar la pestaña no cierra la sesión. Siempre haz logout explícito en dispositivos compartidos.", redFlags: ["Solo cerrar pestaña sin logout", "PC compartida"], points: 100 },
  { id: 508, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO", title: "Número desconocido en grupo sensible", description: "Estás en un grupo de WhatsApp:", content: "Grupo: Personal FAE Ala 11\n\nLos miembros comparten:\n- Horarios de guardia\n- Novedades del cuartel\n- Fotos del armamento\n\nUn número desconocido fue añadido al grupo.", question: "¿Qué haces?", options: [{ text: "Continúas participando, todos son del personal", correct: false }, { text: "Alertas al administrador sobre el número desconocido y reportas a seguridad", correct: true }, { text: "Dejas de participar silenciosamente", correct: false }, { text: "Le preguntas al número desconocido quién es", correct: false }], explanation: "Los grupos con información sensible deben verificar cada miembro. Un número desconocido puede ser una filtración.", redFlags: ["Número desconocido en grupo sensible", "Información operacional en WhatsApp"], points: 150 },
  { id: 509, category: "Redes Sociales", icon: "📱", difficulty: "DIFÍCIL", title: "Doxxing de datos personales", description: "Encuentras en internet tu información personal:", content: "En un foro encuentras publicado:\n- Tu nombre completo y grado\n- Tu dirección domiciliaria\n- Tu número de celular personal\n- Tu vehículo y placa\n- Fotos de tu familia", question: "¿Qué haces?", options: [{ text: "Ignoras, es información que ya es pública", correct: false }, { text: "Reportas a seguridad FAE, solicitas eliminación y cambias rutinas", correct: true }, { text: "Contactas directamente al foro para que lo eliminen", correct: false }, { text: "Publicas una respuesta en el foro", correct: false }], explanation: "El doxxing puede preceder ataques físicos o de ingeniería social. Reporta a seguridad y toma medidas de protección.", redFlags: ["Datos personales y familiares expuestos", "Información que facilita seguimiento físico"], points: 200 },
  { id: 510, category: "Redes Sociales", icon: "📱", difficulty: "FÁCIL", title: "Cadena falsa de WhatsApp", description: "Recibes este mensaje en WhatsApp:", content: "IMPORTANTE: WhatsApp cobrará\n$0.99 por mensaje desde el lunes.\nReenvía este mensaje a 10 contactos\nantes de medianoche para mantener\ntu cuenta gratuita para siempre.", question: "¿Qué haces?", options: [{ text: "Reenvías a 10 contactos por si acaso", correct: false }, { text: "Eliminas el mensaje, es una cadena falsa", correct: true }, { text: "Reenvías solo a familiares", correct: false }, { text: "Buscas información sobre el cobro", correct: false }], explanation: "Las cadenas de WhatsApp sobre cobros son siempre falsas. WhatsApp es gratuito. No reenvíes cadenas.", redFlags: ["Cadena de reenvío masivo", "Amenaza de cobro o pérdida de servicio"], points: 100 },
  { id: 511, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO", title: "Secuestro de cuenta en redes", description: "Recibes un email sobre tu Instagram:", content: "Tu cuenta de Instagram fue accedida\ndesde un dispositivo nuevo en Rusia.\nSi no eres tú, haz clic aquí para\nasegurar tu cuenta:\nhttps://instagram-security-check.net", question: "¿Qué haces?", options: [{ text: "Haces clic urgente para recuperar tu cuenta", correct: false }, { text: "Vas directamente a instagram.com para revisar la actividad", correct: true }, { text: "Respondes el email con tu contraseña para verificar", correct: false }, { text: "Descargas una app de seguridad del link", correct: false }], explanation: "Este email es phishing. Siempre ve directo al sitio oficial para revisar actividad sospechosa.", redFlags: ["Dominio diferente a instagram.com", "Urgencia por acceso extranjero"], points: 150 },
  { id: 512, category: "Redes Sociales", icon: "📱", difficulty: "DIFÍCIL", title: "OPSEC en publicaciones personales", description: "Un análisis de tus fotos en Instagram revela:", content: "Un analista puede determinar:\n- Tu rutina diaria\n- La ruta que tomas a la base\n- Los horarios en que estás fuera\n- Los nombres de tus compañeros\n- Las instalaciones donde trabajas", question: "¿Cómo aplicas OPSEC en redes?", options: [{ text: "Eliminas todas tus redes sociales", correct: false }, { text: "Revisas y ajustas lo que publicas aplicando principios de OPSEC", correct: true }, { text: "Solo publicas fotos sin personas", correct: false }, { text: "Usas seudónimo en redes sociales", correct: false }], explanation: "La OPSEC en redes implica analizar qué información puede deducirse de tus publicaciones, no solo lo que dices explícitamente.", redFlags: ["Rutinas predecibles públicas", "Información de instalaciones en fotos"], points: 200 },
  { id: 513, category: "Redes Sociales", icon: "📱", difficulty: "FÁCIL", title: "Foto con información sensible", description: "Quieres publicar en Instagram una foto tuya:", content: "La foto muestra:\n- Tu uniforme completo con insignias\n- El nombre de la operación bordado\n- Compañeros identificables\n- Equipo y armamento visible\n- Ubicación GPS activada", question: "¿Publicas la foto?", options: [{ text: "Sí, estás orgulloso de tu trabajo", correct: false }, { text: "No sin antes revisar y eliminar información sensible", correct: true }, { text: "Sí pero en cuenta privada con solo amigos", correct: false }, { text: "Sí si el ejercicio ya terminó", correct: false }], explanation: "Las fotos militares pueden revelar información de personal, equipo y operaciones. Consulta las políticas antes de publicar.", redFlags: ["Nombre de operación visible", "Equipo militar identificable", "GPS activado en foto"], points: 100 },
  { id: 514, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO", title: "Fake news sobre seguridad nacional", description: "Circula en redes esta noticia:", content: "EXCLUSIVO: Fuente interna de la FAE\nrevela que Ecuador planea operación\nmilitar contra país vecino la próxima\nsemana.\n\nEl artículo tiene logo de medio conocido\npero la URL es diferente.", question: "¿Qué haces?", options: [{ text: "Compartes si parece importante", correct: false }, { text: "Reportas a seguridad FAE y no compartes ni comentas", correct: true }, { text: "Verificas con colegas si es verdad", correct: false }, { text: "Comentas en el artículo que es falso", correct: false }], explanation: "Las fake news sobre seguridad nacional pueden tener consecuencias graves. No compartir ni comentar y reportar a autoridades.", redFlags: ["Logo de medio real en URL diferente", "Información de operaciones militares"], points: 150 },
  { id: 515, category: "Redes Sociales", icon: "📱", difficulty: "DIFÍCIL", title: "Sextorsión digital", description: "Recibes este mensaje privado:", content: "Tengo acceso a tu webcam y grabé\nvideos comprometedores.\nSi no me pagas $500 en Bitcoin\nen 48 horas, envío el video a\ntus contactos y superiores en la FAE.", question: "¿Qué haces?", options: [{ text: "Pagas para que no envíen el video", correct: false }, { text: "No pagas, reportas a seguridad FAE y a la Fiscalía", correct: true }, { text: "Respondes para negociar el precio", correct: false }, { text: "Verificas si realmente tienen acceso a tu webcam", correct: false }], explanation: "La sextorsión es casi siempre un bluff. Pagar garantiza más extorsión. Reporta inmediatamente.", redFlags: ["Extorsión con amenaza de video", "Pago en criptomonedas", "Plazo de 48 horas"], points: 200 },

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
  const [activeBlock, setActiveBlock] = useState(null);
  const chatEndRef = useRef(null);

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

  const stopTimer = () => {};
  const startTimer = () => {};


  const handleAnswer = (idx) => {
    const scenario = quizScenarios[currentIdx];
    if (!scenario || showResult) return;
    stopTimer();
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
      startTimer();
    } else {
      stopTimer();
      saveScore(score, totalPoints, activeBlock || filter);
      setScreen("results");
    }
  };

  const resetCounters = () => {
    stopTimer();
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setTotalPoints(0);
    setStreak(0);
    setBestStreak(0);
    setAnswers([]);
  };

  const resetQuiz = () => {
    resetCounters();
    setQuizScenarios([]);
    setActiveBlock(null);
  };

  const goHome = () => {
    stopTimer();
    setScreen("home");
    setQuizScenarios([]);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setTotalPoints(0);
    setStreak(0);
    setBestStreak(0);
    setAnswers([]);
    setActiveBlock(null);
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
    stopTimer();
    setQuizScenarios([]);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
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
            <button style={btn("primary")} onClick={() => { const q = buildQuiz("TODOS"); setQuizScenarios(q); resetCounters(); setFilter("TODOS"); setActiveBlock("TODOS"); setScreen("quiz"); startTimer(); }}>▶ Iniciar Entrenamiento</button>
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
            <button key={s.id} onClick={() => { const q = buildQuiz(s.category); setQuizScenarios(q); resetCounters(); setFilter(s.category); setActiveBlock(s.category); setScreen("quiz"); startTimer(); }}
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
                  setScreen("quiz");
                  startTimer();
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
            setScreen("quiz");
            startTimer();
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
              <div key={currentIdx} style={{ height: "100%", borderRadius: 4, width: "100%", background: "#4caf50", animation: "timerBar 40s linear forwards" }} />
            </div>
            <div style={{ fontSize: 11, color: C.dim, minWidth: 40, textAlign: "right" }}>⏱ 40 seg</div>
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
          <button style={btn("primary")} onClick={() => { const q = buildQuiz("TODOS"); setQuizScenarios(q); resetCounters(); setFilter("TODOS"); setActiveBlock("TODOS"); setScreen("quiz"); startTimer(); }}>▶ Jugar Ahora</button>
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
            <button style={btn("primary")} onClick={() => { const q = buildQuiz(filter); setQuizScenarios(q); resetCounters(); setScreen("quiz"); startTimer(); }}>↺ Repetir</button>
            <button style={btn("ghost")} onClick={() => { goHome(); setScreen("selector"); }}>📋 Otra Categoría</button>
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
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}} @keyframes timerBar{0%{width:100%;background:#4caf50} 50%{background:#ff9800} 80%{background:#f44336} 100%{width:0%;background:#f44336}}`}</style>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import Login from "./Login";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { supabase } from "./supabase";
const SCENARIOS = [
  // PHISHING
  {
    id: 1, category: "Phishing", icon: "🎣", difficulty: "FÁCIL",
    title: "Email bancario sospechoso",
    description: "Recibes este email en tu bandeja de entrada:",
    content: `De: soporte@bancopichincha.net
Asunto: ⚠️ URGENTE: Su cuenta será bloqueada en 24h

Estimado cliente,
Hemos detectado actividad inusual. Para evitar el 
bloqueo INMEDIATO haga clic aquí:
→ http://bancopichincha-verificacion.tk/login

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
    id: 9, category: "Phishing", icon: "🎣", difficulty: "MEDIO",
    title: "Premio falso de Amazon",
    description: "Recibes este email en tu correo:",
    content: `De: premios@amazon-ganadores.com
Asunto: 🎉 ¡Felicidades! Has ganado un iPhone 15

Estimado usuario,
Has sido seleccionado como ganador de nuestro 
sorteo mensual. Tu premio: iPhone 15 Pro (128GB).

Para reclamar tu premio GRATIS haz clic aquí:
→ http://amazon-prizes-claim.xyz/winner

Solo necesitas pagar $9.99 de envío.
¡Oferta válida por 24 horas!`,
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
    description: "Recibes este mensaje del 'departamento  TIC' del Ala 21:",
    content: `De: Tic-soporte@fae.mi1.com
Asunto: Actualización obligatoria de contraseña

Estimado amigo,
Por políticas de seguridad debe actualizar su 
contraseña antes de las 5pm de hoy.

Si no lo hace, su cuenta será desactivada.
→ https://portal-fae-update.net/password

Ingrese su contraseña actual y la nueva.
Departamento de TIC`,
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
  // CONTRASEÑAS
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
    content: `"Yo uso la misma contraseña en todos lados 
pero le agrego el nombre del sitio al final.

Por ejemplo: MiClave123_Facebook, 
MiClave123_Gmail, MiClave123_Banco.

Así es fácil recordarlas y son diferentes 
en cada sitio. ¿No es ingenioso?"`,
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
    content: `"¿Gestor de contraseñas? ¡Jamás! 
Si hackean ese programa, tienen TODAS 
mis contraseñas de golpe. 

Prefiero escribirlas en un cuaderno o 
en un archivo de Excel en mi escritorio. 
Al menos eso no se puede hackear remotamente."`,
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
  // WIFI PUBLICO
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
    explanation: "Las redes WiFi públicas son peligrosas para transacciones sensibles. Los atacantes pueden crear redes falsas (Evil Twin) o interceptar tráfico. Usa siempre datos móviles para operaciones bancarias, o una VPN confiable.",
    redFlags: ["Redes sin contraseña", "Nombres genéricos 'FREE'", "Transacciones sensibles en WiFi público", "Sin verificar autenticidad"],
    points: 150,
  },
  {
    id: 13, category: "WiFi Público", icon: "📶", difficulty: "FÁCIL",
    title: "WiFi del aeropuerto",
    description: "Estás en el aeropuerto esperando tu vuelo y ves estas redes:",
    content: `📶 Airport_Free_WiFi          (Sin contraseña)
📶 Aeropuerto_Oficial_GYE     (Sin contraseña)  
📶 AeroNet_Pasajeros          (Contraseña: en mostrador)
📶 Free_Fast_Airport          (Sin contraseña)`,
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
    content: `📶 HotelPlaza_Guest           (Contraseña: plaza2024)
📶 HotelPlaza_Guest           (Sin contraseña - más señal)

Ambas redes tienen el mismo nombre pero 
una tiene más señal y no requiere contraseña.
Tu laptop se conecta automáticamente a la 
de mayor señal.`,
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
  // INGENIERÍA SOCIAL
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
    explanation: "Microsoft, Google, tu banco y otras empresas NUNCA te llaman sin aviso para decirte que tienes un virus. Este es un scam de soporte técnico falso.",
    redFlags: ["Llamada no solicitada", "Urgencia y miedo", "Solicitud de acceso remoto", "Empresas legítimas no llaman así"],
    points: 150,
  },
  {
    id: 15, category: "Ingeniería Social", icon: "🎭", difficulty: "FÁCIL",
    title: "Técnico de mantenimiento",
    description: "Estás en la oficina y llega un hombre con uniforme:",
    content: `Un hombre con camiseta azul y credencial 
llega a tu oficina y dice:

"Buenos días, soy pasante de mantenimiento 
de sistemas. Tengo que revisar los equipos 
del piso. ¿Me puede dejar pasar? Es rápido, 
no le quitaré más de 5 minutos."

No tienes aviso previo de ninguna visita técnica.`,
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
    content: `"Hola! Soy Tnte. Corella, empecé esta semana en 
finanzas. Necesito acceder al sistema 
urgente para un reporte del director pero 
aún no me han dado mis credenciales.

¿Me prestás tu usuario por 5 minutos? 
Prometo que solo veo los reportes. 
El director está esperando y no quiero 
quedar mal en mi primera semana."`,
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
  // REDES SOCIALES
  {
    id: 5, category: "Redes Sociales", icon: "📱", difficulty: "MEDIO",
    title: "Mensaje de un 'amigo'",
    description: "Tu amigo Carlos te manda este mensaje por WhatsApp:",
    content: `Carlos 💬:
"Oye! Estoy en un apuro, perdí mi billetera 
de viaje. ¿Me puedes prestar $50 por DE UNA? 
Te los devuelvo en cuanto llegue a casa.

Es muy urgente, estoy varado. 
Por favor no le digas nada a mis padres 😬"`,
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
    content: `Nueva solicitud de amistad de:
👤 María González (perfil con foto tuya conocida)

Al revisar el perfil ves que:
- Solo tiene 3 fotos (las mismas que el perfil real)
- Se creó hace 2 semanas
- Tiene 12 amigos en común contigo
- El perfil real de María ya era tu amiga`,
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
    content: `🔥 RETO VIRAL: "10 cosas sobre mí" 🔥

Comparte estas 10 cosas para que tus amigos 
te conozcan mejor:
1. Nombre completo
2. Fecha de nacimiento
3. Ciudad donde naciste
4. Nombre de tu primera mascota
5. Colegio donde estudiaste
6. Nombre de tu mejor amigo de infancia
7. Primer carro que tuviste
8. Nombre de soltera de tu mamá
9. Tu equipo de fútbol favorito
10. Calle donde creciste`,
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
  // ACTUALIZACIONES
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
    explanation: "El 60% de las brechas de seguridad explotan vulnerabilidades con parches disponibles que no fueron instalados. Activa las actualizaciones automáticas.",
    redFlags: ["Ignorar actualizaciones", "Creer que no sirven", "Posponer indefinidamente", "Solo actualizar apps visibles"],
    points: 100,
  },
  {
    id: 19, category: "Actualizaciones", icon: "🔄", difficulty: "MEDIO",
    title: "Notificación de actualización falsa",
    description: "Mientras navegas aparece este pop-up:",
    content: `⚠️ ADVERTENCIA DE SEGURIDAD ⚠️

Su versión de Chrome está DESACTUALIZADA
y su equipo está EN RIESGO.

Haga clic en ACTUALIZAR AHORA para 
instalar la versión más reciente y 
proteger su información.

[ACTUALIZAR AHORA]    [Recordar después]`,
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
  // MALWARE
  {
    id: 7, category: "Malware", icon: "💀", difficulty: "DIFÍCIL",
    title: "Archivo adjunto del trabajo",
    description: "Recibes este email de tu jefe (o eso parece):",
    content: `De: director@fae.mi1.ec
Asunto: Revisar URGENTE - Contrato confidencial

Hola,
Necesito que revises este contrato antes de las 3pm.
Es confidencial, no lo compartas con nadie todavía.

[Contrato_Final_2024.pdf.exe] (2.3 MB)

Gracias, Jorge Zumba - Director General`,
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
    content: `En el estacionamiento de tu empresa encuentras 
un USB con una etiqueta que dice:

🏷️ "PASES 2026 - CONFIDENCIAL"

Nadie está cerca. Es un USB normal que 
cabe en cualquier computadora.`,
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
    content: `Resultados de búsqueda para "editar PDF gratis":

🔍 edit-pdf-free-download.net
   "Descarga GRATIS el mejor editor de PDF"
   
🔍 pdf-editor-pro-crack.com  
   "Adobe Acrobat Pro GRATIS - Sin pagar"
   
🔍 acrobat.adobe.com
   "Adobe Acrobat - Editor oficial de PDF"
   
🔍 ilovepdf.com
   "Herramienta online gratuita para PDF"`,
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
  // 2FA
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
    explanation: "El atacante ya tiene tu contraseña y solo necesita el código 2FA. Google, Apple, tu banco o CUALQUIER empresa NUNCA te pedirá un código de verificación por teléfono.",
    redFlags: ["Solicitud del código 2FA", "Llamada inmediata tras el SMS", "Urgencia de 'proteger tu cuenta'", "Nadie legítimo pide códigos 2FA"],
    points: 200,
  },
  {
    id: 22, category: "2FA", icon: "🔒", difficulty: "FÁCIL",
    title: "¿Qué tipo de 2FA usar?",
    description: "Vas a activar el doble factor en tu banco. Te ofrecen estas opciones:",
    content: `El banco te ofrece elegir tu método de 
doble factor de autenticación:

A) SMS al celular con código de 6 dígitos
B) Email con código de verificación  
C) App autenticadora (Google Authenticator)
D) Pregunta de seguridad (nombre mascota, etc.)`,
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
    content: `Tu celular muestra "Sin servicio" desde 
esta mañana. Llamas desde otro teléfono 
a tu número y no entra.

Luego recibes un email de tu banco:
"Se ha realizado una transferencia de $500 
desde su cuenta. Si no reconoce esta 
operación contáctenos."

Tu número sigue sin señal.`,
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
  const chatEndRef = useRef(null);

  const CATEGORIES = ["TODOS", ...Array.from(new Set(SCENARIOS.map(s => s.category)))];
  const filteredScenarios = filter === "TODOS" ? SCENARIOS : SCENARIOS.filter(s => s.category === filter);

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
  } else {
    saveScore(score, totalPoints, filter);
    setScreen("results");
  }
};

  const resetQuiz = () => {
    setCurrentIdx(0); setSelected(null); setShowResult(false);
    setScore(0); setTotalPoints(0); setStreak(0); setBestStreak(0); setAnswers([]);
  };
const saveScore = async (finalScore, finalPoints, filterUsed) => {
  const user = auth.currentUser;
  if (!user) return;
  await supabase.from("ranking").insert([{
    username: user.displayName || user.email,
    email: user.email,
    score: finalScore,
    points: finalPoints,
    category: filterUsed,
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
    resetQuiz();
    setScreen("home");
  };

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  // PALETA VERDE Y GRIS CLARO
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

  if (screen === "home") return (
    <div style={wrap}>
      <div style={cont}>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, marginBottom: 8 }}>
          <button style={btn("dim")} onClick={handleLogout}>🔓 Cerrar sesión</button>
        </div>
        <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>🛡️</div>
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
            <button style={btn("primary")} onClick={() => { resetQuiz(); setFilter("TODOS"); setScreen("quiz"); }}>▶ Iniciar Entrenamiento</button>
            <button style={btn("ghost")} onClick={() => setScreen("selector")}>📋 Elegir Categoría</button>
            <button style={btn("ghost")} onClick={() => setScreen("chat")}>🤖 Consultar IA</button>
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
            <button key={s.id} onClick={() => { resetQuiz(); setFilter(s.category); setCurrentIdx(0); setScreen("quiz"); }}
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

  if (screen === "selector") return (
    <div style={wrap}>
      <div style={cont}>
        <div style={{ paddingTop: 20, marginBottom: 20 }}><button style={btn("dim")} onClick={() => setScreen("home")}>← Volver</button></div>
        <h2 style={{ color: C.green, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Seleccionar Categoría</h2>
        <p style={{ color: C.dim, fontSize: 12, marginBottom: 20 }}>Elige el área en la que quieres entrenar</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {CATEGORIES.map(cat => {
            const s = cat === "TODOS" ? SCENARIOS : SCENARIOS.filter(x => x.category === cat);
            return (
              <button key={cat} onClick={() => { resetQuiz(); setFilter(cat); setScreen("quiz"); }}
                style={{ ...card, textAlign: "left", padding: "18px", cursor: "pointer", border: `1.5px solid ${C.border}` }}>
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
    const progress = ((currentIdx) / filteredScenarios.length) * 100;
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
            <button style={btn("dim")} onClick={() => setScreen("home")}>← Salir</button>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {streak >= 2 && <div style={{ color: "#e65100", fontSize: 12, background: "#fff3e0", border: "1px solid #ffcc80", padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>🔥 ×{streak}</div>}
              <div style={{ color: C.green, fontSize: 12, background: C.greenPale, border: `1px solid ${C.greenMid}`, padding: "4px 12px", borderRadius: 20, fontWeight: 700 }}>★ {totalPoints} pts</div>
              <div style={{ color: C.dim, fontSize: 12 }}>{currentIdx + 1}/{filteredScenarios.length}</div>
            </div>
          </div>
          <div style={{ height: 6, background: "#e0e0e0", borderRadius: 3, marginBottom: 20 }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${progress}%`, background: `linear-gradient(90deg,${C.green},${C.greenLight})`, transition: "width 0.5s ease" }} />
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
                <button style={{ ...btn("primary"), flex: 1 }} onClick={nextScenario}>{currentIdx < filteredScenarios.length - 1 ? "SIGUIENTE →" : "VER RESULTADOS →"}</button>
                <button style={btn("ghost")} onClick={() => setScreen("chat")}>🤖 IA</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
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
                <div style={{ color: C.mid, fontWeight: 700, fontSize: 14 }}>{entry.username}</div>
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
    </div>
  </div>
);
  if (screen === "results") {
    const pct = (score / filteredScenarios.length) * 100;
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
            <div style={{ fontSize: "clamp(48px,12vw,72px)", fontWeight: 900, color: C.green }}>{score}/{filteredScenarios.length}</div>
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
            <button style={btn("primary")} onClick={() => { resetQuiz(); setScreen("quiz"); }}>↺ Repetir</button>
            <button style={btn("ghost")} onClick={() => setScreen("selector")}>📋 Otra Categoría</button>
            <button style={btn("ghost")} onClick={() => setScreen("chat")}>🤖 Consultar IA</button>
            <button style={btn("ghost")} onClick={loadRanking}>🏆 Ranking</button>
            <button style={btn("dim")} onClick={() => { resetQuiz(); setScreen("home"); }}>⌂ Inicio</button>
          </div>
        </div>
      </div>
    );
  }

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

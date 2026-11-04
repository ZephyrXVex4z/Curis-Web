
/**
 * CONFIGURACIÓN DE VORTEX AI
 * 
 * ATENCIÓN SEGURIDAD: 
 * Este proyecto está diseñado para funcionar SIN backend (Frontend-Only).
 * Colocar una API Key directamente en código JavaScript estático significa que 
 * cualquier visitante web puede verla inspeccionando el código.
 * 
 * PARA PRODUCCIÓN DEBES:
 * 1. Restringir tu API Key de Gemini desde Google Cloud Console para que 
 *    SOLO acepte peticiones desde tu dominio (ej. https://curris.site).
 * 2. Establecer límites de cuota (billing alerts/hard caps) en Google Cloud.
 * 
 * No utilices la clave maestra de un proyecto corporativo sin estas restricciones.
 */

export const VORTEX_CONFIG = {
    // Reemplaza esto con tu API Key real de Google AI Studio
    API_KEY: "TU_API_KEY_AQUI", 
    MODEL: "gemini-1.5-pro",
    
    // Precios Base utilizados por el motor local de JavaScript para cotizaciones.
    // La IA solo determina los identificadores ('keys'), el precio se calcula aquí.
    PRICING: {
        types: {
            "static": { label: "Sitio Web Básico / Estático", price: 5 },
            "advanced": { label: "Sitio Web Avanzado", price: 15 },
            "ecommerce": { label: "Tienda Online / E-commerce", price: 50 },
            "custom": { label: "Desarrollo a Medida", price: 100 }
        },
        features: {
            "auth": { label: "Sistema de Usuarios", price: 15 },
            "db": { label: "Base de Datos en Tiempo Real", price: 20 },
            "payments": { label: "Pasarela de Pagos (PayPal/Stripe)", price: 25 },
            "admin": { label: "Panel Administrativo", price: 30 }
        },
        hosting: {
            "curris": { label: "Alojamiento CURRIS (.site)", price: 0 },
            "external": { label: "Dominio y Hosting Externo", price: 15 }
        }
    }
};

export const SYSTEM_INSTRUCTIONS = `Eres VorteX, el asistente inteligente de CURRIS.SITE.
Tu misión es ayudar a los visitantes a planificar, comprender y desarrollar sus proyectos web.
Eres especialista en desarrollo web, alojamiento, dominios, bases de datos, seguridad, SEO y tecnologías.

REGLAS DE INTERACCIÓN:
1. Responde en español, sé amable, técnico pero comprensible. Tu nombre es VorteX (el motor es Google Gemini).
2. Ayuda a planificar proyectos haciendo preguntas progresivas (una o dos a la vez): ¿Qué tipo de web buscas? ¿Necesitas usuarios/pagos? ¿Presupuesto?
3. NO inventes precios. Utiliza exclusivamente las referencias de CURRIS.SITE (Desde $5 para estáticas, $15-$50+ avanzadas).
4. CUANDO EL USUARIO SOLICITE UN PRESUPUESTO y tengas los datos necesarios, DEBES incluir en tu respuesta estrictamente un bloque JSON con este formato exacto dentro de marcas \`\`\`json ... \`\`\`. El sistema local lo capturará para generar la interfaz:
\`\`\`json
{
  "action": "quote",
  "type": "static" | "advanced" | "ecommerce" | "custom",
  "features": ["auth", "db", "payments", "admin"], 
  "hosting": "curris" | "external"
}
\`\`\`
Nota: En "features" solo incluye las claves en inglés (auth, db, payments, admin) que correspondan. Usa corchetes vacíos [] si no hay extras.
5. Puedes acompañar el JSON con texto explicativo amable. El bloque JSON será removido visualmente y reemplazado por una tarjeta interactiva de cotización generada por nuestro frontend.`;

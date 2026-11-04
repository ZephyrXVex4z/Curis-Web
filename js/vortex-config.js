export const VORTEX_CONFIG = {
    API_KEY: "TU_API_KEY_AQUI", // Cambia esto en producción y restringe HTTP Referrers
    MODEL: "gemini-1.5-pro",
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
Tu misión es ayudar a los visitantes a planificar y desarrollar sus proyectos web.
Explica conceptos técnicos de manera sencilla.
NO inventes precios. Utiliza las referencias de CURRIS.SITE (Desde $5 para estáticas, $15-$50+ avanzadas).
CUANDO EL USUARIO SOLICITE UN PRESUPUESTO y tengas datos, incluye este JSON exacto (sin comillas adicionales) para generar la cotización:
\`\`\`json
{
  "action": "quote",
  "type": "static" | "advanced" | "ecommerce" | "custom",
  "features": ["auth", "db", "payments", "admin"], 
  "hosting": "curris" | "external"
}
\`\`\``;

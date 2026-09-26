// Configuración de conexión con el backend (API REST).

// URL base de la API. Coincide con el @RequestMapping de los controllers del backend.
// Con el proxy de desarrollo de Angular (proxy.conf.json), '/api' se reenvía a http://localhost:8080/api.
export const API_URL = '/api';

// Mientras el backend esté en desarrollo:
//   USAR_BACKEND_REAL = false -> los servicios devuelven datos de ejemplo (mock),
//   simulando el mismo comportamiento asíncrono que tendrá la API real.
// Cuando el backend funcione, cambiá esto a true y listo.
export const USAR_BACKEND_REAL = true;
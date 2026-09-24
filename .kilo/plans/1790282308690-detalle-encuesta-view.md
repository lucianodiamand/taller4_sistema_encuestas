# Detalle de Encuesta: reemplazar modal "ver" por vista dedicada

## Contexto

En el dashboard (`encuestas-frontend/src/app/features/dashboard/`), el botón "ver" (icono `visibility`) de una encuesta abre el `Modal` genérico. Se quiere que ese botón navegue a una nueva vista dedicada `/encuestas/:id` que muestre:

- Información de la encuesta (título, descripción, cliente, estado, fecha, creador).
- Preguntas **read-only** (no editables).
- Estadísticas (totales, aprobadas/válidas, pendientes, rechazadas) — visibles para **ambos roles**.
- Solo **encuestador**: lista de sus respuestas pendientes de esa encuesta (aprobar/rechazar) y botón **Generar QR** (con el QR base64 y el enlace de un solo uso).
- El admin no ve pendientes ni QR, pero sí info + estadísticas + preguntas.

La vista pública anónima (`/responder/:token`, rellenar y enviar) queda **fuera de alcance**; se crea un componente compartido de preguntas read-only para reusarlo después.

El backend está aparte y aún no tiene endpoints de respuestas/estadísticas; todo lo que no exista se simula con mocks bajo el patrón existente `USAR_BACKEND_REAL` (ver `src/app/core/config.ts`). El backend sí tiene `POST /api/enlaces` → `EnlaceResponseDTO { urlCompleta, qrCodeBase64, ... }` (el QR se muestra con `<img [src]="'data:image/png;base64,' + qrCodeBase64" />`).

## Decisiones tomadas

- Ruta nueva protegida: `encuestas/:id` con `authGuard` (ambos roles).
- Estadísticas visibles para admin y encuestador; pendientes + QR solo encuestador.
- El mock de `respuestasPendientes` sale del Dashboard y pasa a un nuevo `RespuestaService` (una sola fuente de datos para el tab global y el detalle).
- El botón "Generar QR" del card del encuestador en el dashboard se elimina (se mueve al detalle).
- Admin conserva `modificar` (modal) y el toggle de estado en el dashboard. El detalle es solo lectura (sin toggle de estado).
- `AuthService` expone un `currentUserId` mock (admin=1, encuestador=2) para poder llamar `POST /api/enlaces` con `encuestadorId`.

## Archivos nuevos

### 1. `src/app/shared/models/estado-enlace.ts`
Enum: `PENDIENTE = 'PENDIENTE'`, `RESPONDIDO = 'RESPONDIDO'` (espejo de `EstadoEnlace.java`).

### 2. `src/app/shared/models/enlace-interface.ts`
```ts
export type EnlaceRequest = { encuestaId: number; encuestadorId: number };
export interface Enlace {
  id: number;
  token: string;
  estado: EstadoEnlace;
  fechaCreacion: string;
  encuestaId: number;
  encuestaTitulo: string;
  urlCompleta: string;
  qrCodeBase64?: string | null;
}
```

### 3. `src/app/shared/models/estadisticas-encuesta.ts`
```ts
export interface EstadisticasEncuesta {
  encuestaId: number;
  totalRespuestas: number;
  pendientes: number;
  aprobadas: number;   // "válidas"
  rechazadas: number;
}
```

### 4. `src/app/core/services/respuesta.ts` — `RespuestaService`
Métodos (todos devuelven `Observable`, patrón mock + rama real igual que `cliente.ts`):
- `obtenerPendientes(): Observable<RespuestaEncuesta[]>` — mock: el listado actual del dashboard (ids 501/502, `encuesta_id: 1`) + algunos para `encuesta_id: 2`.
- `obtenerPendientesDeEncuesta(encuestaId: number): Observable<RespuestaEncuesta[]>` — mock: filtra por `encuesta_id`.
- `obtenerEstadisticas(encuestaId: number): Observable<EstadisticasEncuesta>` — mock coherente (ej. para encuesta 1: total 5, pendientes 2, aprobadas 2, rechazadas 1).
- `validar(id: number, estado: 'aprobada' | 'rechazada'): Observable<void>` — mock: quita del listado pendiente; real: endpoint backend a confirmar (dejar TODO comentado igual que otros servicios).

### 5. `src/app/core/services/enlace.ts` — `EnlaceService`
- `generar(encuestaId: number): Observable<Enlace>` — inyecta `AuthService` para `encuestadorId`.
  - Real (`USAR_BACKEND_REAL`): `POST ${API_URL}/enlaces` con body `{ encuestaId, encuestadorId }`.
  - Mock: `of({ id: 9001, token: crypto.randomUUID(), estado: PENDIENTE, fechaCreacion: new Date().toISOString(), encuestaId, encuestaTitulo: '...', urlCompleta: 'http://localhost:4200/responder/' + token, qrCodeBase64: '' })`. Con `qrCodeBase64` vacío, la vista muestra un placeholder + el enlace.

### 6. `src/app/shared/components/lista-preguntas/` (lista-preguntas.ts/.html/.css)
Componente standalone con `@Input() preguntas: Pregunta[]`. Render read-only de cada pregunta: número/orden, texto, badge con `TipoPregunta`, y opciones (si `opciones.length > 0`) como lista. Sin lógica de edición; pensado para reusarse en la futura vista pública (ahí se agregaría modo editable). Dependencias mínimas (CommonModule + CSS propio; usar `MatChip`/`MatIcon` solo si se prefiere, respetando el estilo Material del proyecto).

### 7. `src/app/features/encuesta/detalle-encuesta/` (detalle-encuesta.ts/.html/.css)
`@Component` standalone, lazy-loaded. Estructura:
- **ts**: inyecta `AuthService`, `EncuestaService`, `RespuestaService`, `EnlaceService`, `Router`. Lee `:id` de la ruta (`route.snapshot.params` o el nuevo `route.params.get`). Carga `encuesta` por id, `estadisticas` y (si encuestador) `pendientesDeEncuesta`. Expone `rolActual`, `enlaceGenerado`, `generarQR()`, `validarRespuesta()`, `volver()`. Guarda "encuesta no encontrada" en un signal para el template.
- **html** (secciones):
  1. Header: botón "Volver al panel" + título + badge de estado + botón "Generar QR" (solo encuestador y solo si `estado === ACTIVA`; si está cerrada, deshabilitado con tooltip por RN01).
  2. Info de la encuesta: descripción, cliente, creador, fecha de creación (mismo estilo etiqueta/valor que `camposVer` del modal).
  3. Estadísticas (ambos roles): tiles con total, aprobadas (válidas), pendientes, rechazadas.
  4. Preguntas (ambos roles): `<app-lista-preguntas [preguntas]="encuesta.preguntas">`.
  5. Encuestador: listado "Respuestas pendientes de esta encuesta" (código + fecha + botones aprobar/rechazar, reutilizando el estilo de card del dashboard) y sección QR (imagen `data:image/png;base64` cuando `qrCodeBase64` existe, placeholder con icono `qr_code` + `urlCompleta` copiable con `navigator.clipboard`).
- **css**: reusar estilos de `dashboard.css` (`.list-grid`, `.card-item`) y agregar tiles de estadísticas y layout de detalle.

## Archivos a modificar

### `src/app/app.routes.ts`
Agregar ruta protegida (después de `dashboard`):
```ts
{
  path: 'encuestas/:id',
  canActivate: [authGuard],
  loadComponent: () => import('./features/encuesta/detalle-encuesta/detalle-encuesta').then(m => m.DetalleEncuesta)
}
```

### `src/app/core/services/auth.ts`
- Agregar `currentUserId = signal<number | null>(Number(localStorage.getItem('userId') ?? null))`.
- En `setSession(token, role, userId)`: guardar `localStorage.setItem('userId', String(userId))`; login admin → userId 1, encuestador → userId 2.
- En `logout()`: `removeItem('userId')` y `currentUserId.set(null)`.
- Ajustar `login()` para pasar el userId correspondiente.

### `src/app/core/services/encuesta.ts`
- Agregar `obtenerPorId(id: number): Observable<Encuesta | undefined>`:
  - Mock: `of(this.mockEncuestas.find(e => e.id === id))`.
  - Real: `GET ${API_URL}/encuestas/{id}` con comentario "endpoint a confirmar en backend" (el detalle funciona con mock mientras tanto).

### `src/app/features/dashboard/dashboard.ts`
- Inyectar `Router` y `RespuestaService`.
- Quitar el signal local `respuestasPendientes`; el tab usa `respuestaService.obtenerPendientes()`.
- `validarRespuesta` delega en `respuestaService.validar(...)` y recarga el listado.
- `abrirModal` deja de usarse para `ver` en `Encuesta` (se reemplaza por navegación); sigue igual para el resto (Clientes, Encuestadores, Respuesta).
- Quitar `generarQR(idEncuesta)` (se mueve al detalle).

### `src/app/features/dashboard/dashboard.html`
- Botón `visibility` de encuesta (ambos bloques ADMIN y ENCUESTADOR): `(click)="router.navigate(['/encuestas', enc.id])"` (o método `verEncuesta(enc)` en el ts; preferir método para consistencia).
- Encuestador: eliminar el botón "Generar QR" del card.

## Flujo y casos borde

- `GET encuesta no encontrada` (id inválido o no existe en el mock): mostrar mensaje "Encuesta no encontrada" + botón volver.
- `Generar QR` en encuesta `CERRADA`: botón deshabilitado (RN01, el backend también lo rechaza).
- Pendientes "propias del encuestador": en el mock se filtran por `encuesta_id`; cuando exista backend, se documenta que el endpoint traerá solo las del encuestador logueado.
- Recarga directa de `/encuestas/:id` funciona (la vista carga por id, no depende del estado del dashboard).

## Validación

- `npm run build` (o `ng build`) desde `encuestas-frontend` debe compilar sin errores.
- `npm run test` (vitest): no romper `auth.spec.ts`.
- Manual (mock, `ng serve`): login admin/1234 → tab Encuestas → "ver" navega al detalle (info + estadísticas + preguntas, sin pendientes ni QR). Login encuestador/1234 → "ver" navega al detalle (info + estadísticas + preguntas + pendientes de la encuesta + Generar QR que muestra el enlace mock). Volver regresa al dashboard.

## Riesgos / notas

- Estadísticas y pendientes son mock (el backend no expone endpoints aún); el patrón `USAR_BACKEND_REAL` deja los métodos listos para conectarse después.
- El QR real viene del backend como base64; en modo mock se muestra placeholder + URL.
- La vista pública anónima queda fuera de alcance; `ListaPreguntas` se diseñó para reusarse (modo editable después).
- No tocar el `Modal` para las demás entidades (Clientes, Encuestadores, Respuesta) ni el flujo de crear/modificar/eliminar.
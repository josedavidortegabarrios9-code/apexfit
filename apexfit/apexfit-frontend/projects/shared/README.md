# 📦 ApexFit — Librería Shared (`projects/shared`)

Librería interna de utilidades, componentes compartidos, seguridad y diseño visual común para las aplicaciones `app-usuarios` y `panel-administrativo` del monorepositorio **ApexFit**.

---

## 🧩 Contenido y Módulos Exportados

### 1. 🔐 Seguridad y Autenticación (`lib/auth/`)
- **`AuthService`:** Manejo centralizado del estado de sesión con Signals de Angular, almacenamiento del token JWT y decodificación de roles.
- **`AuthInterceptor`:** Interceptor HTTP funcional que inyecta automáticamente la cabecera `Authorization: Bearer <token>` en todas las peticiones a la API.
- **Guards de Enrutamiento:**
  - `accessGuard`: Protege rutas privadas requiriendo sesión activa.
  - `guestGuard`: Redirige usuarios ya autenticados lejos de páginas públicas como login o registro.
  - `roleGuard`: Restringe rutas a roles autorizados (`ROLE_CLIENTE`, `ROLE_ENTRENADOR`, `ROLE_ADMINISTRADOR`).
- **Transferencia de Sesión (`session-transfer.ts`):** Mecanismo de handoff mediante token efímero para transferir la sesión entre `app-usuarios` (puerto 4200) y `panel-administrativo` (puerto 4201).

### 2. 🤖 Asistente Virtual Inteligente (`lib/chat/`)
- **`ChatBotComponent` (`<lib-chatbot />`):** Componente flotante interactivo (FAB) con panel modal de conversación.
- **`ChatService`:** Servicio reactivo que gestiona el historial de mensajes, indicador de escritura ("pensando...") y comunicación con el backend (`POST /api/v1/chat`).
- **`chat.models.ts`:** DTOs e interfaces de mensajes, peticiones y respuestas estructuradas.

### 3. 🔔 Campana de Notificaciones (`lib/notificaciones/`)
- **`Campana` (`<lib-campana />`):** Menú desplegable con conteo de notificaciones sin leer, listado por tipo, marcado de lectura y navegación directa.
- **`NotificacionesService`:** Consulta reactiva y sincronización periódica con el backend.

### 4. 👤 Perfil y Cuenta (`lib/cuenta/`)
- **`MiCuenta` (`<lib-mi-cuenta />`):** Vista de gestión de datos personales y actualización de contraseña.
- **`CuentaService`:** Consumo de endpoints de perfil y cambio de credenciales.

### 5. 🎨 Sistema de Diseño y Tema (`styles/_theme.scss`)
- Variables CSS globales de color, tipografía, bordes y radios (`--af-red`, `--af-surface`, `--af-border`, etc.).
- Clases utilitarias (`.af-btn`, `.af-card`, `.af-tag`, `.field-error`).

---

## 🧪 Pruebas Unitarias

Para ejecutar las pruebas automatizadas de la librería con Vitest:

```bash
npx ng test shared --watch=false
```

---

## 🛠️ Compilación

```bash
npx ng build shared
```

El artefacto compilado se genera en `dist/shared`.

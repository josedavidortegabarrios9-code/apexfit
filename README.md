# 🏋️ ApexFit — Plataforma Integral de Gestión Fitness

> Sistema Fullstack para administración de centros de entrenamiento, control de membresías, rutinas personalizadas, seguimiento antropométrico, control de asistencias con lógica toggle inteligente y asistente virtual impulsado por Inteligencia Artificial (Google Gemini).

---

## 📁 Estructura del Monorepositorio

El repositorio está organizado en arquitectura modular:

```text
Electiva/
└── apexfit/
    ├── apexfit-backend/        # API REST desarrollada en Spring Boot / Java 17
    │   ├── src/                # Controladores, Servicios, Seguridad JWT, Entidades JPA
    │   ├── pom.xml             # Dependencias Maven (Spring Security, JPA, Flyway, JJWT)
    │   ├── DOCUMENTACION_BACKEND.md # Guía exhaustiva de arquitectura, base de datos y MER
    │   ├── DOCUMENTACION_API.md     # Catálogo completo de endpoints y esquemas JSON
    │   └── README.md           # Guía de configuración y arranque del backend
    │
    └── apexfit-frontend/       # Workspace Angular 22 (Multi-App SPA)
        ├── projects/
        │   ├── app-usuarios/           # Portal clientes (Hoy, Rutina, Mi QR, Asistencia, Progreso, Mi Coach, Chatbot)
        │   ├── panel-administrativo/   # Panel para Administrador y Entrenador con Chatbot integrado
        │   └── shared/                 # Librería compartida (Guards, Interceptor JWT, Chatbot IA, Campana, Modelos)
        ├── package.json        # Dependencias y scripts NPM
        └── README.md           # Guía de instalación y ejecución del frontend
```

---

## 🚀 Arquitectura y Módulos del Sistema

### 1. Autenticación y Seguridad (RBAC)
- Autenticación **Stateless** con tokens **JWT (HMAC-SHA256)** y 24 horas de expiración.
- Control de acceso basado en roles: `ROLE_ADMINISTRADOR`, `ROLE_ENTRENADOR` y `ROLE_CLIENTE`.
- Recuperación de contraseña en 2 pasos con tokens temporales de 15 minutos (`/solicitar-recuperacion` y `/resetear-password`).
- Redirección automática según rol: los clientes acceden a `app-usuarios`, mientras administradores y entrenadores son dirigidos a `panel-administrativo`.

### 2. Control de Asistencias Inteligente (Toggle QR y Duración)
- **Registro Toggle por QR (`POST /api/v1/asistencias/escanear-qr`):**
  - **1er escaneo del día:** Registra la hora de entrada (`horaEntrada`).
  - **2do escaneo del día:** Detecta la visita abierta y registra automáticamente la hora de salida (`horaSalida`).
- **Salida Manual (`PATCH /api/v1/asistencias/{id}/salida`):** Botón directo en la aplicación para registrar la salida sin necesidad de volver a escanear.
- **Cálculo de Permanencia:** El historial calcula y muestra el tiempo exacto transcurrido en el gimnasio (horas y minutos), destacando en tiempo real las sesiones activas ("En el gym").

### 3. Planes y Membresías
- Gestión y seguimiento del estado de suscripciones (`activa`, `vencida`, `cancelada`).
- Notificaciones y alertas automáticas de vencimiento próximo e inactividad.

### 4. Rutinas, Ejercicios y Modo Guiado
- Catálogo de ejercicios clasificado por grupos musculares y dificultad, con demostraciones visuales.
- Planificación semanal con series, repeticiones, descansos y notas del entrenador.
- **Modo Guiado:** Registro y seguimiento del avance diario de sesiones de entrenamiento por ejercicio (`completado`, `aplazado`, `pendiente`), sincronizable con el backend vía upsert diario (`PUT /api/v1/sesiones-entrenamiento/hoy`).

### 5. Mi Coach (Asignación Directa de Entrenador)
- Nueva sección en la aplicación de clientes (`/mi-entrenador` y pestaña **Coach** en barra inferior).
- Consulta en tiempo real (`GET /api/v1/mi-entrenador`) del preparador físico activo asignado por la administración.
- Tarjeta de contacto interactiva con correo (`mailto:`) y teléfono directo (`tel:`) para resolución de dudas sobre rutinas o planes.

### 6. Asistente Virtual Inteligente (Google Gemini AI)
- Chatbot flotante interactivo (`<lib-chatbot />`) disponible en la app de clientes y en el panel administrativo.
- Impulsado por el modelo de lenguaje **Google Gemini 3.5 Flash Lite**.
- **Inyección Transaccional de Contexto:** `ChatContextService` consulta en tiempo real el nombre, correo, rol, plan de membresía, fecha de expiración y días restantes del usuario en sesión, respondiendo de forma personalizada y sin pedir identificación manual.
- Respuestas en español, en texto plano natural y en tono motivador.

### 7. Seguimiento Antropométrico y Progreso
- Registro periódico de métricas físicas: peso, altura y cálculo automático de IMC.
- Historial de medidas anatómicas (pecho, cintura, bíceps, etc.) y comparativa visual.

### 8. Dashboard y Analítica
- Resumen en tiempo real para administración: usuarios activos, porcentaje de retención, aforo del día, concurrencia horaria y distribución de accesos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Backend** | Java 17, Spring Boot, Spring Security 6, Spring Data JPA, Hibernate, Flyway Migration, MySQL 8 / AWS RDS. |
| **Inteligencia Artificial** | Google Gemini API (`gemini-3.5-flash-lite`), REST Client en Spring Boot. |
| **Frontend** | Angular 22, TypeScript, RxJS, HTML5, SCSS / Custom CSS Variables, QR Code Generator. |
| **Testing Frontend** | Vitest (con JSDOM). |
| **Testing API** | JUnit 5, Mockito, Spring Boot Test, Postman / Newman. |
| **Infraestructura / Nube** | AWS RDS (MySQL), GitHub Actions CI/CD. |

---

## ⚡ Guía Rápida de Inicio Local

### 1. Prerrequisitos
- **Java 17 JDK** instalado y en el `PATH`.
- **Node.js 22.x** o superior y **npm**.
- **MySQL Server** (local) o acceso a instancia en la nube (AWS RDS).
- (Opcional) **API Key de Google Gemini** para habilitar las respuestas del Asistente Virtual.

---

### 2. Levantar el Backend (Spring Boot)

Entra en el directorio del backend:
```bash
cd apexfit/apexfit-backend
```

**Modo Desarrollo (MySQL Local en `localhost:3306`):**
```bash
./mvnw spring-boot:run
```

Para habilitar el Asistente Virtual con IA en local:
```powershell
$env:GEMINI_API_KEY="tu_api_key_de_gemini"
./mvnw spring-boot:run
```

**Modo Producción (AWS RDS):**
```powershell
$env:APP_PROFILE="prod"
$env:RDS_HOSTNAME="apexfit-mysql.cxxxxxx.us-east-1.rds.amazonaws.com"
$env:RDS_PORT="3306"
$env:RDS_DB_NAME="apexfit"
$env:RDS_USERNAME="admin"
$env:RDS_PASSWORD="TuPasswordSeguro"
$env:JWT_SECRET="ClaveSecretaDeAlMenos32BytesApexFitProdKey"
./mvnw spring-boot:run
```

> La API iniciará en: `http://localhost:8080/api/v1`

---

### 3. Levantar el Frontend (Angular)

Entra en el directorio del frontend:
```bash
cd apexfit/apexfit-frontend
npm ci
```

El frontend está dividido en dos aplicaciones que pueden ejecutarse simultáneamente:

```bash
# Terminal 1: Portal para Clientes (con Chatbot y Mi Coach)
npm run start:usuarios    # 🌐 http://localhost:4200

# Terminal 2: Panel Administrativo y Entrenadores (con Chatbot y Métricas)
npm run start:panel       # 🌐 http://localhost:4201
```

---

### 4. Ejecución de Pruebas

#### Pruebas del Frontend (Vitest):
```bash
cd apexfit/apexfit-frontend
npx ng test app-usuarios --watch=false
npx ng test panel-administrativo --watch=false
npx ng test shared --watch=false
```

#### Pruebas del Backend (JUnit 5 / Maven):
```bash
cd apexfit/apexfit-backend
./mvnw test
```

---

## 🔑 Credenciales de Prueba (Entorno de Desarrollo)

Para probar los diferentes roles y flujos del sistema:

| Rol | Correo | Contraseña | Destino |
|---|---|---|---|
| **Administrador** | `admin@apexfit.com` | `admin123` | `http://localhost:4201` |
| **Entrenador** | `pedro.entrenador@apexfit.com` | `entrenador123` | `http://localhost:4201` |
| **Cliente** | `cliente@apexfit.test` | `Prueba123` | `http://localhost:4200` |
| **Cliente** | `carlos@apexfit.com` | `12345` | `http://localhost:4200` |

*Nota: También existen cuentas mock en base de pruebas: `administrador@apexfit.test`, `entrenador@apexfit.test`, con clave `Prueba123`.*

---

## 📚 Enlaces de Documentación

- 📘 [Documentación Arquitectónica del Backend](apexfit/apexfit-backend/DOCUMENTACION_BACKEND.md)
- 📖 [Catálogo de Endpoints REST de la API](apexfit/apexfit-backend/DOCUMENTACION_API.md)
- 💻 [Guía Específica del Frontend](apexfit/apexfit-frontend/README.md)
- ⚙️ [Guía Específica del Backend](apexfit/apexfit-backend/README.md)
- 📦 [Documentación de la Librería Shared](apexfit/apexfit-frontend/projects/shared/README.md)

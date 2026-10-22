# 🏋️ ApexFit — Plataforma Integral de Gestión Fitness

> Sistema Fullstack para administración de centros de entrenamiento, control de membresías, rutinas personalizadas, seguimiento antropométrico y control de asistencias mediante código QR.

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
        │   ├── app-usuarios/           # Portal clientes (Rutinas, QR, Progreso, Asistencias)
        │   ├── panel-administrativo/   # Panel para Administrador y Entrenador
        │   └── shared/                 # Librería compartida (Guards, Interceptor JWT, Modelos)
        ├── package.json        # Dependencias y scripts NPM
        └── README.md           # Guía de instalación y ejecución del frontend
```

---

## 🚀 Arquitectura y Módulos del Sistema

### 1. Autenticación y Seguridad (RBAC)
- Autenticación **Stateless** con tokens **JWT (HMAC-SHA256)** y 24 horas de expiración.
- Control de acceso basado en roles: `ROLE_ADMINISTRADOR`, `ROLE_ENTRENADOR` y `ROLE_CLIENTE`.
- Recuperación de contraseña en 2 pasos con tokens temporales de 15 minutos (`/solicitar-recuperacion` y `/resetear-password`).
- Redirección automática según rol: los clientes acceden al portal `app-usuarios`, mientras administradores y entrenadores son redirigidos al `panel-administrativo`.

### 2. Control de Asistencias Inteligente
- Registro instantáneo mediante escaneo de códigos QR dinámicos (`/escanear-qr`) y registro manual asistido.
- Auditoría de entradas y prevención de duplicados diarios.

### 3. Planes y Membresías
- Gestión y seguimiento del estado de suscripciones (`activa`, `vencida`, `cancelada`).
- Notificaciones y alertas automáticas de vencimiento.

### 4. Rutinas y Catálogo de Ejercicios
- Catálogo de ejercicios clasificado por grupos musculares y dificultad, con URLs a videos demostrativos.
- Planificación semanal con series, repeticiones, descansos y notas del entrenador.

### 5. Seguimiento Antropométrico y Progreso
- Registro periódico de métricas físicas: peso, altura, cálculo automático de IMC.
- Historial de medidas corporales (pecho, cintura, cadera, bíceps, muslos) y evolución en el tiempo.

### 6. Dashboard y Analítica
- Resumen en tiempo real para administración: usuarios activos, porcentaje de retención, concurrencia por día/horario y distribución de accesos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Backend** | Java 17, Spring Boot, Spring Security 6, Spring Data JPA, Hibernate, Flyway Migration, MySQL 8 / AWS RDS. |
| **Frontend** | Angular 22, TypeScript, RxJS, QR Code Generator, HTML5, CSS3 / Custom Themes. |
| **Testing Frontend** | Vitest (con JSDOM). |
| **Testing API** | JUnit 5, Spring Boot Test. |
| **Infraestructura / Nube** | AWS RDS (MySQL), GitHub Actions CI/CD. |

---

## ⚡ Guía Rápida de Inicio Local

### 1. Prerrequisitos
- **Java 17 JDK** instalado y en el `PATH`.
- **Node.js 22.x** o superior y **npm**.
- **MySQL Server** (local) o acceso a instancia en la nube (AWS RDS).

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

**Modo Producción (AWS RDS):**
```powershell
$env:APP_PROFILE="prod"
$env:RDS_HOSTNAME="tu-instancia.rds.amazonaws.com"
$env:RDS_PORT="3306"
$env:RDS_DB_NAME="apexfit"
$env:RDS_USERNAME="admin"
$env:RDS_PASSWORD="tu_password"
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
# Terminal 1: Portal para Clientes
npm run start:usuarios    # 🌐 http://localhost:4200

# Terminal 2: Panel Administrativo y Entrenadores
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

---

## 🔑 Credenciales de Prueba (Entorno de Desarrollo)

Para probar los diferentes roles y flujos del sistema:

| Rol | Correo | Contraseña | Destino |
|---|---|---|---|
| **Administrador** | `admin@apexfit.com` | `admin123` | `http://localhost:4201` |
| **Entrenador** | `pedro.entrenador@apexfit.com` | `entrenador123` | `http://localhost:4201` |
| **Cliente** | `cliente@apexfit.test` | `Prueba123` | `http://localhost:4200` |
| **Cliente** | `carlos@apexfit.com` | `12345` | `http://localhost:4200` |

*Nota: También existen cuentas mock en base de pruebas: `administrador@apexfit.test`, `entrenador@apexfit.test`,  con clave `Prueba123`.*

---

## 📚 Enlaces de Documentación

- 📘 [Documentación Arquitectónica del Backend](apexfit/apexfit-backend/DOCUMENTACION_BACKEND.md)
- 📖 [Catálogo de Endpoints REST de la API](apexfit/apexfit-backend/DOCUMENTACION_API.md)
- 💻 [Guía Específica del Frontend](apexfit/apexfit-frontend/README.md)
- ⚙️ [Guía Específica del Backend](apexfit/apexfit-backend/README.md)

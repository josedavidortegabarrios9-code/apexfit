# ApexFit - Backend

Backend en Spring Boot para el sistema de gestión de gimnasios ApexFit.

## Requisitos
- Java 17
- MySQL Server (Local o AWS RDS)
- (Opcional) Clave de API de Google Gemini para el asistente virtual con IA

## Configuración y Ejecución

El proyecto utiliza variables de entorno para conectarse a la base de datos y a servicios externos.
Por defecto, usa el perfil `dev` (`application-dev.yml`) que apunta a localhost.

### 1. Base de datos local
Asegúrate de tener un servidor MySQL corriendo localmente.
Crea una base de datos vacía llamada `apexfit`. (Flyway se encargará de crear las tablas y migraciones automáticamente).

### 2. Variables de entorno

#### Variables de Base de Datos (Opcional si usas root/root):
- `DB_HOST`: Host de la base de datos local (por defecto `localhost`)
- `DB_PORT`: Puerto de MySQL (por defecto `3306`)
- `DB_NAME`: Nombre de la base de datos (por defecto `apexfit`)
- `DB_USER`: Usuario de MySQL (por defecto `root`)
- `DB_PASS`: Contraseña de MySQL (por defecto `root`)

#### Asistente Virtual IA (Gemini AI):
- `GEMINI_API_KEY`: API Key de Google Gemini (Google AI Studio). Requerida para que el chatbot interactúe con el modelo `gemini-3.5-flash-lite`. Si no se configura, el endpoint `/api/v1/chat` responde un mensaje informativo indicando que la clave no ha sido configurada sin romper la aplicación.

### 3. Ejecutar el proyecto
No necesitas instalar Maven, el proyecto incluye el wrapper `mvnw`.
Ejecuta en la terminal (estando dentro de la carpeta `apexfit-backend`):
```bash
./mvnw spring-boot:run
```

Si deseas habilitar el asistente con IA en local:
```powershell
$env:GEMINI_API_KEY="AIzaSy..."
./mvnw spring-boot:run
```

---

## Documentación de la API (Endpoints y Seguridad RBAC)
El proyecto cuenta con documentación detallada de todos los endpoints, esquemas de petición y respuestas:
- 📖 **Explicación Completa del Backend:** Ver [`DOCUMENTACION_BACKEND.md`](DOCUMENTACION_BACKEND.md) para el desglose detallado de arquitectura, servicios, lógica de negocio y base de datos.
- 📋 **Documentación de la API (Markdown):** Ver [`DOCUMENTACION_API.md`](DOCUMENTACION_API.md).

### Módulos y Controladores Disponibles:
- `POST /api/v1/auth/login`, `POST /api/v1/auth/register` (Autenticación JWT)
- `/api/v1/usuarios` (CRUD, búsqueda por correo, `/perfil`, `/cambiar-password`)
- `/api/v1/ejercicios` (CRUD, filtros por grupo muscular y dificultad)
- `/api/v1/rutinas` (CRUD, rutinas por cliente)
- `/api/v1/rutina-ejercicios` (Asociación series/repeticiones)
- `/api/v1/sesiones-entrenamiento` (Avance diario, upsert de hoy, historial por cliente)
- `/api/v1/progresos` (Métricas físicas, peso, altura, IMC)
- `/api/v1/progresos-medidas` (Medidas corporales individuales)
- `/api/v1/membresias` (CRUD y estado de suscripción)
- `/api/v1/asistencias` (Registro con toggle QR entrada/salida, auditoría y `PATCH /{id}/salida`)
- `/api/v1/alertas` (Alertas preventivas)
- `/api/v1/notificaciones` (Campana de notificaciones, filtros y lecturas)
- `/api/v1/entrenador-cliente` (Vinculación asesor-cliente)
- `/api/v1/mi-entrenador` (Consulta del entrenador asignado al cliente autenticado)
- `/api/v1/chat` (Asistente virtual conversacional con Google Gemini AI y contexto de usuario)
- `/api/v1/configuracion` (Configuración general de límites del gimnasio)
- `/api/v1/dashboard` (Métricas en tiempo real de aforo y socios activos)

---

## Despliegue en Producción (Perfil `prod` / AWS RDS / Render)
Para conectarte a una base de datos en la nube (AWS RDS) o servicios como Render:

Variables requeridas para producción:
- `APP_PROFILE=prod`
- `RDS_HOSTNAME`: Endpoint de AWS RDS (o host remoto)
- `RDS_PORT`: Puerto (por defecto `3306`)
- `RDS_DB_NAME`: Nombre de la base de datos
- `RDS_USERNAME`: Usuario administrador de la BD
- `RDS_PASSWORD`: Contraseña de la BD
- `JWT_SECRET`: Clave secreta robusta de al menos 32 caracteres para firmar los tokens JWT
- `GEMINI_API_KEY`: API Key de Google Gemini para el asistente virtual

Ejemplo de ejecución con PowerShell:
```powershell
$env:APP_PROFILE="prod"
$env:RDS_HOSTNAME="apexfit-mysql.cxxxxxx.us-east-1.rds.amazonaws.com"
$env:RDS_PORT="3306"
$env:RDS_DB_NAME="apexfit"
$env:RDS_USERNAME="admin"
$env:RDS_PASSWORD="TuPasswordSeguro"
$env:JWT_SECRET="ClaveSecretaDeAlMenos32BytesApexFitProdKey"
$env:GEMINI_API_KEY="tu_api_key_de_gemini"
./mvnw spring-boot:run
```

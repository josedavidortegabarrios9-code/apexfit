# 📘 Documentación Integral del Backend — ApexFit API

> **Sistema de Gestión Integral para Gimnasios y Centros de Entrenamiento Deportivo**  
> **Framework:** Spring Boot 4.x / Java 17  
> **Seguridad:** Spring Security 6 & JWT (Stateless) con RBAC  
> **Inteligencia Artificial:** Google Gemini AI (Modelo `gemini-3.5-flash-lite`)  
> **Persistencia:** Spring Data JPA / Hibernate & MySQL (Local y AWS RDS)  
> **Migraciones:** Flyway DB Migration  

---

## 📑 Tabla de Contenidos
1. [Visión General y Propósito del Sistema](#1-visión-general-y-propósito-del-sistema)
2. [Arquitectura de Software (Layered Architecture)](#2-arquitectura-de-software-layered-architecture)
3. [Stack Tecnológico y Dependencias](#3-stack-tecnológico-y-dependencias)
4. [Modelo de Base de Datos y Persistencia](#4-modelo-de-base-de-datos-y-persistencia)
5. [Seguridad, Autenticación y Autorización (RBAC)](#5-seguridad-autenticación-y-autorización-rbac)
6. [Catálogo Detallado de Módulos y Lógica de Negocio](#6-catálogo-detallado-de-módulos-y-lógica-de-negocio)
7. [Manejo Centralizado de Excepciones y Validaciones](#7-manejo-centralizado-de-excepciones-y-validaciones)
8. [Configuración de Entornos y Despliegue](#8-configuración-de-entornos-y-despliegue)
9. [Estrategia de Pruebas Automatizadas (Postman / Newman)](#9-estrategia-de-pruebas-automatizadas-postman--newman)

---

## 1. Visión General y Propósito del Sistema

**ApexFit Backend** es una API RESTful desarrollada con **Spring Boot** y **Java 17** que centraliza y automatiza toda la operativa comercial, deportiva y administrativa de un gimnasio moderno.

### Objetivos Principales:
- **Gestión Integral de Usuarios:** Administración de tres tipos de actores clave (Administradores, Entrenadores y Clientes).
- **Control de Acceso y Asistencias Inteligente:** Registro rápido y validado mediante **códigos QR** dinámicos con lógica toggle (Entrada / Salida automática) y cálculo de permanencia.
- **Entrenamiento Personalizado y Guiado:** Planificación de rutinas, catálogo de ejercicios clasificados por grupos musculares y dificultad, asignación de preparadores físicos y seguimiento del avance diario de sesiones.
- **Control Financiero y Membresías:** Seguimiento del ciclo de vida de planes de membresía (activa, vencida, cancelada).
- **Seguimiento Antropométrico:** Registro de evolución física (peso, altura, cálculo de IMC) y medidas corporales detalladas en centímetros.
- **Asistente Virtual con IA:** Chatbot interactivo integrado con **Google Gemini AI**, capaz de responder consultas contextualizadas sobre la membresía, días restantes, rutinas y datos de contacto de entrenadores.
- **Inteligencia de Negocio:** Tablero de control (`Dashboard`) en tiempo real con estadísticas de concurrencia y miembros activos.

---

## 2. Arquitectura de Software (Layered Architecture)

El backend sigue rigurosamente el **patrón arquitectónico en capas (Layered Architecture)**, asegurando alta cohesión, bajo acoplamiento y separación de responsabilidades:

```
[ Petición HTTP / Cliente Web / Móvil ]
                 │
                 ▼
      ┌─────────────────────┐
      │  Security Filter    │ ◄── AuthTokenFilter (Valida JWT en cabecera)
      └──────────┬──────────┘
                 │
                 ▼
      ┌─────────────────────┐
      │  Controller Layer   │ ◄── Rutas REST, @PreAuthorize, DTOs de entrada/salida
      └──────────┬──────────┘
                 │
                 ▼
      ┌─────────────────────┐
      │    Service Layer    │ ◄── Lógica de negocio, @Transactional, llamadas a Gemini
      └──────────┬──────────┘
                 │
                 ▼
      ┌─────────────────────┐
      │  Repository Layer   │ ◄── Spring Data JPA / Queries derivadas
      └──────────┬──────────┘
                 │
                 ▼
      ┌─────────────────────┐
      │  Database (MySQL)   │ ◄── Tablas relacionales con Flyway Migrations
      └─────────────────────┘
```

### Componentes de Cada Capa:
1. **Capa de Controladores (`com.apexfit.backend.controller`):**
   - Expone los endpoints HTTP bajo la convención RESTful `/api/v1/*`.
   - Aplica validaciones sintácticas con Bean Validation (`@Valid`).
   - Aplica seguridad declarativa mediante `@PreAuthorize("hasRole(...)")`.
2. **Capa de Servicios (`com.apexfit.backend.service`):**
   - Orquesta la lógica del negocio.
   - Maneja la demarcación de transacciones con `@Transactional(readOnly = true)` para lecturas eficientes y `@Transactional` para mutaciones de datos.
   - `ChatContextService`: Servicio transaccional que construye el contexto del usuario autenticado (nombre, membresía activa y días restantes) para el bot sin disparar `LazyInitializationException`.
   - `ClaudeService`: Servicio cliente REST que consume la API de **Google Gemini AI** (`gemini-3.5-flash-lite`).
3. **Capa de Repositorios (`com.apexfit.backend.repository`):**
   - Interfaces que extienden `JpaRepository<Entity, ID>`.
   - Consultas derivadas y queries JPQL optimizadas.
4. **Capa de Entidades (`com.apexfit.backend.entity`):**
   - Clases anotadas con JPA/Hibernate que mapean directamente las tablas de MySQL.
5. **Capa de Transferencia de Datos (`com.apexfit.backend.dto`):**
   - DTOs que desacoplan el modelo interno de la base de datos de los contratos expuestos a la API.

---

## 3. Stack Tecnológico y Dependencias

Definidas en el archivo `pom.xml`:

| Tecnología / Dependencia | Versión | Rol en el Proyecto |
|---|---|---|
| **Java** | 17 LTS | Lenguaje de programación principal |
| **Spring Boot Starter Parent** | 4.1.1 | Framework base de la aplicación |
| **Spring Boot Starter WebMvc** | — | Soporte para controladores REST y APIs JSON |
| **Spring Boot Starter Security** | — | Motor de autenticación y autorización |
| **Spring Boot Starter Data JPA** | — | ORM y abstracción de persistencia relacional con Hibernate |
| **Spring Boot Starter Validation** | — | Validaciones declarativas (`@NotBlank`, `@Email`, `@Min`, etc.) |
| **JJWT (`io.jsonwebtoken`)** | 0.11.5 | Generación, firma digital HMAC-SHA256 y parseo de tokens JWT |
| **Google Gemini API** | `gemini-3.5-flash-lite` | Modelo de lenguaje natural para el Asistente Virtual |
| **MySQL Connector/J** | 9.x | Driver JDBC para comunicación con base de datos MySQL |
| **Flyway Core & MySQL** | — | Versionamiento y migración automática del esquema DDL |
| **Project Lombok** | — | Generación de getters, setters, constructores y builders |

---

## 4. Modelo de Base de Datos y Persistencia

El esquema relacional cuenta con tablas versionadas mediante **Flyway Migrations** ubicadas en `src/main/resources/db/migration/`:
- `V1__Initial_schema.sql`: Esquema inicial, tablas de usuarios, membresías, rutinas, asistencias, etc.
- `V2__add_indexes.sql`: Índices estratégicos en columnas de alta consulta.
- `V3__sesiones_entrenamiento.sql`: Tablas `sesion_entrenamiento` y `sesion_ejercicio` para seguimiento del modo guiado de rutinas.

---

## 5. Seguridad, Autenticación y Autorización (RBAC)

La seguridad está implementada en `com.apexfit.backend.security` y configurada en `WebSecurityConfig.java`:

### 5.1. Arquitectura Stateless con JWT
- **Sesión Sin Estado (`SessionCreationPolicy.STATELESS`):** Toda la identidad del usuario viaja en el token en cada petición.
- **Filtro de Interceptación (`AuthTokenFilter`):** Intercepta cada solicitud entrante, extrae el encabezado `Authorization: Bearer <token>`, valida la firma digital y establece la autenticación en el `SecurityContextHolder`.

### 5.2. Modelo RBAC (Role-Based Access Control)
- `ROLE_ADMINISTRADOR`: Acceso integral.
- `ROLE_ENTRENADOR`: Gestión deportiva y seguimiento de atletas.
- `ROLE_CLIENTE`: Acceso a sus rutinas, asistencias, medidas y chatbot.

### 5.3. Matriz de Autorización por Controlador

| Módulo / Controlador | Roles Permitidos de Lectura (`GET`) | Roles Permitidos de Escritura (`POST`, `PUT`, `PATCH`, `DELETE`) |
|---|---|---|
| **`/api/v1/auth/**`** | Público (todos) | Público (todos) |
| **`/api/v1/usuarios`** | `ADMINISTRADOR`, `ENTRENADOR` (todos); Cualquier rol autenticado (`/perfil`, `/cambiar-password`) | Crear / Borrar: `ADMINISTRADOR`. Actualizar: Todos sobre su perfil |
| **`/api/v1/dashboard/**`** | `ADMINISTRADOR`, `ENTRENADOR` | *No aplica (sólo consulta)* |
| **`/api/v1/membresias`** | `ADMINISTRADOR`, `ENTRENADOR`, `CLIENTE` (sólo propias) | Crear: `ADMINISTRADOR`, `ENTRENADOR`. Modificar/Borrar: `ADMINISTRADOR` |
| **`/api/v1/asistencias`** | `ADMINISTRADOR`, `ENTRENADOR`, `CLIENTE` (propias) | Registrar asistencia (manual / QR toggle): `CLIENTE`, `ADMINISTRADOR`, `ENTRENADOR`. `PATCH /{id}/salida`: `CLIENTE`, `ADMINISTRADOR`. Modificar/Borrar: `ADMINISTRADOR` |
| **`/api/v1/ejercicios`** | `CLIENTE`, `ENTRENADOR`, `ADMINISTRADOR` | Crear / Modificar / Borrar: `ENTRENADOR`, `ADMINISTRADOR` |
| **`/api/v1/rutinas`** | `CLIENTE` (propias), `ENTRENADOR`, `ADMINISTRADOR` | Crear / Modificar / Borrar: `ENTRENADOR`, `ADMINISTRADOR` |
| **`/api/v1/rutina-ejercicios`** | `CLIENTE`, `ENTRENADOR`, `ADMINISTRADOR` | `ENTRENADOR`, `ADMINISTRADOR` |
| **`/api/v1/sesiones-entrenamiento`**| `CLIENTE` (propias), `ENTRENADOR` (asignadas), `ADMINISTRADOR` | `PUT /hoy`: `CLIENTE` |
| **`/api/v1/progresos`** | `CLIENTE` (propios), `ENTRENADOR`, `ADMINISTRADOR` | Crear/Editar: `CLIENTE`, `ENTRENADOR`, `ADMINISTRADOR`. Borrar: `ADMINISTRADOR`, `ENTRENADOR` |
| **`/api/v1/alertas`** | `CLIENTE` (propias), `ENTRENADOR`, `ADMINISTRADOR` | Crear/Editar: `ENTRENADOR`, `ADMINISTRADOR`. Borrar: `ADMINISTRADOR` |
| **`/api/v1/entrenador-cliente`** | Consultas: `ADMINISTRADOR`, `ENTRENADOR`, `CLIENTE` | Asignar / Desasignar: `ADMINISTRADOR` |
| **`/api/v1/mi-entrenador`** | `CLIENTE`, `ADMINISTRADOR` | *No aplica (sólo lectura)* |
| **`/api/v1/chat`** | `CLIENTE`, `ENTRENADOR`, `ADMINISTRADOR` | `POST`: Enviar consulta al Asistente Virtual |

---

## 6. Catálogo Detallado de Módulos y Lógica de Negocio

### 6.1. Módulo de Autenticación (`AuthController`)
- **`POST /api/v1/auth/login`**: Valida credenciales contra la BD con BCrypt. Devuelve el JWT, ID de usuario, correo y roles.
- **`POST /api/v1/auth/register`**: Autoregistro con contraseña codificada y rol `cliente` por defecto.
- **`POST /api/v1/auth/solicitar-recuperacion`**: Genera un token temporal de 15 minutos firmado criptográficamente.
- **`POST /api/v1/auth/resetear-password`**: Restablece la contraseña validando el token de recuperación.

### 6.2. Módulo de Usuarios (`UsuarioController` y `UsuarioService`)
- Paginación nativa con `Pageable`.
- Borrado lógico (*Soft Delete*) cambiando el estado a `'inactivo'`.
- Cambio de contraseña validando la clave previa.
- Endpoint `/perfil` resolviendo la identidad a partir del token JWT.

### 6.3. Módulo de Asistencias Inteligentes (`AsistenciaController` y `AsistenciaService`)
- **Lógica Toggle Inteligente por QR (`POST /api/v1/asistencias/escanear-qr`):**
  1. Si el usuario escanea su QR por primera vez en el día: se registra una nueva fila con `fecha = hoy`, `horaEntrada = ahora`, `metodoRegistro = 'QR'`.
  2. Si el usuario escanea su QR nuevamente en el mismo día y tiene una asistencia abierta (sin `horaSalida`): el sistema detecta la entrada activa y registra automáticamente la `horaSalida = ahora`.
- **Salida Manual (`PATCH /api/v1/asistencias/{id}/salida`):** Permite al cliente registrar su hora de salida desde la aplicación con un solo toque.
- **Cálculo de Tiempo de Permanencia:** Permite calcular la duración exacta de la visita en horas y minutos.

### 6.4. Módulo de Dashboard y KPIs (`DashboardController` y `DashboardService`)
Calcula en una sola llamada agregada (`GET /api/v1/dashboard/resumen`):
- Total de usuarios registrados, clientes activos y entrenadores disponibles.
- Membresías activas y aforo/concurrencia del día.
- Total de ejercicios y rutinas creadas.

### 6.5. Módulo de Rutinas y Ejercicios
- `EjercicioService`: Filtrado por grupo muscular y nivel de dificultad.
- `RutinaService` y `RutinaEjercicioService`: Asociación de series, repeticiones y descansos asignados a clientes por entrenadores.

### 6.6. Módulo de Progreso Antropométrico
- Pesajes periódicos, altura, cálculo automático de IMC y medidas corporales en cascada.

### 6.7. Módulo de Membresías y Alertas
- Seguimiento de vigencia, fechas de inicio y fin, tipos de planes y alertas automáticas por inactividad o expiración.

### 6.8. Módulo de Sesiones de Entrenamiento (`SesionEntrenamientoService`)
- Upsert diario de avance (`PUT /hoy`): Sincroniza el avance de los ejercicios marcados como completados, aplazados o pendientes en el modo guiado.

### 6.9. Módulo de Asignación y Consulta de Entrenador (`MiEntrenadorController`)
- **`GET /api/v1/mi-entrenador`**: Resuelve el ID del cliente autenticado a partir del JWT y consulta en la tabla `entrenador_cliente` la asignación activa más reciente. Devuelve un `EntrenadorInfoDto` con el nombre completo, correo y teléfono del entrenador para facilitar el contacto directo. Si no tiene asignación, responde con `204 No Content`.

### 6.10. Módulo de Asistente Virtual con IA (`ChatController`, `ClaudeService`, `ChatContextService`)
- **`POST /api/v1/chat`**: Asistente virtual interactivo basado en el modelo **Google Gemini 3.5 Flash Lite**.
- **Inyección Transaccional de Contexto (`ChatContextService`):**
  - Corre bajo `@Transactional(readOnly = true)` para evitar excepciones `LazyInitializationException` al acceder a entidades LAZY (como `Rol`).
  - Consulta en tiempo real: nombre del usuario, correo, rol, estado de cuenta, tipo de membresía, fecha de vencimiento y cálculo de días restantes.
  - Inyecta estos datos reales directamente en el contexto conversacional del modelo.
- **Reglas del Modelo:** Respuestas en tono motivador, en español, en texto plano natural (sin Markdown crudo) y con estricta prohibición de solicitar credenciales o datos personales ya conocidos por la sesión.

---

## 7. Manejo Centralizado de Excepciones y Validaciones

Anotado con `@ControllerAdvice`, la clase `GlobalExceptionHandler.java` intercepta todos los errores producidos en los controladores y devuelve un esquema JSON unificado `ErrorResponse`:

```json
{
  "timestamp": "2026-10-19T18:45:00",
  "status": 400,
  "error": "Validation Error",
  "message": "Uno o más campos tienen errores de validación",
  "validationErrors": {
    "correo": "El formato del correo es inválido",
    "contrasena": "La contraseña debe tener al menos 6 caracteres"
  }
}
```

---

## 8. Configuración de Entornos y Despliegue

### 8.1. Tabla Completa de Variables de Entorno

| Variable | Perfil | Descripción | Valor por Defecto |
|---|---|---|---|
| `APP_PROFILE` | Ambos | Perfil de ejecución de Spring Boot (`dev` o `prod`) | `dev` |
| `DB_HOST` | `dev` | Host de base de datos MySQL local | `localhost` |
| `DB_PORT` | `dev` | Puerto de MySQL local | `3306` |
| `DB_NAME` | `dev` | Nombre de base de datos | `apexfit` |
| `DB_USER` | `dev` | Usuario de MySQL | `root` |
| `DB_PASS` | `dev` | Contraseña de MySQL | `root` |
| `RDS_HOSTNAME` | `prod` | Host o endpoint de AWS RDS / MySQL remoto | Obligatorio en prod |
| `RDS_PORT` | `prod` | Puerto del host remoto | `3306` |
| `RDS_DB_NAME` | `prod` | Nombre de la base de datos | Obligatorio en prod |
| `RDS_USERNAME` | `prod` | Usuario de base de datos | Obligatorio en prod |
| `RDS_PASSWORD` | `prod` | Contraseña de base de datos | Obligatorio en prod |
| `JWT_SECRET` | `prod` | Clave simétrica de firma JWT (mínimo 32 caracteres) | `ApexFitSecretKeyMustBeAtLeast...` |
| `GEMINI_API_KEY` | Ambos | API Key de Google Gemini (Google AI Studio) | Vacía (informa si falta) |

### 8.2. Comandos de Ejecución

**En Desarrollo Local:**
```powershell
$env:GEMINI_API_KEY="AIzaSy..."
./mvnw spring-boot:run
```

**En Producción (AWS RDS / Cloud):**
```powershell
$env:APP_PROFILE="prod"
$env:RDS_HOSTNAME="apexfit-mysql.cxxxxxx.us-east-1.rds.amazonaws.com"
$env:RDS_DB_NAME="apexfit"
$env:RDS_USERNAME="admin"
$env:RDS_PASSWORD="TuPasswordSeguro"
$env:JWT_SECRET="ClaveSecretaDeAlMenos32BytesApexFitProdKey"
$env:GEMINI_API_KEY="AIzaSy..."
./mvnw spring-boot:run
```

---

## 9. Estrategia de Pruebas Automatizadas (Postman / Newman / JUnit)

- **Tests Unitarios de Controladores y Servicios:** Incluyen cobertura con Mockito y JUnit 5 (como `ChatControllerTest`).
- **Colección Postman:** [`postman/collections/ApexFit_JWT_Security.postman_collection.json`](../../postman/collections/ApexFit_JWT_Security.postman_collection.json).
- **Cobertura:** 47 pruebas automatizadas que validan generación de JWT, RBAC, flujos de asistencia y auditoría de endpoints.
- **Ejecución vía CLI (Newman):**
  ```powershell
  .\run_postman_tests.ps1
  ```

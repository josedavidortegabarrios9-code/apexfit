# 🏋️ ApexFit — Plataforma Integral de Gestión Fitness

> Sistema Fullstack para administración de centros de entrenamiento, control de membresías, rutinas personalizadas, seguimiento antropométrico y control de asistencias mediante código QR.

---

## 📁 Estructura del Proyecto

El repositorio está organizado en arquitectura modular:

```text
apexfit/
├── apexfit-backend/        # API REST desarrollada en Spring Boot 4.x / Java 17
│   ├── src/                # Código fuente Java (Controladores, Servicios, Seguridad JWT, Entidades)
│   ├── pom.xml             # Dependencias Maven (Spring Security, JPA, Flyway, JJWT)
│   ├── DOCUMENTACION_BACKEND.md # Guía exhaustiva de arquitectura, base de datos y diseño
│   └── DOCUMENTACION_API.md     # Catálogo completo de endpoints y esquemas JSON
│
└── apexfit-frontend/       # Aplicación Web SPA desarrollada en Angular 17+ (preparada localmente)
    ├── src/                # Componentes, vistas, servicios y guardas de autenticación
    ├── angular.json        # Configuración del workspace Angular
    └── package.json        # Dependencias NPM
```

---

## 🚀 Módulos del Sistema

1. **Autenticación y Seguridad (RBAC):**
   - Autenticación **Stateless** con tokens **JWT (HMAC-SHA256)** y 24 horas de vigencia.
   - Control de acceso basado en roles: `ROLE_ADMINISTRADOR`, `ROLE_ENTRENADOR` y `ROLE_CLIENTE`.
   - Recuperación de contraseña en 2 pasos con tokens temporales de 15 minutos (`/solicitar-recuperacion` y `/resetear-password`).
2. **Control de Asistencias Inteligente:**
   - Registro instantáneo mediante escaneo de códigos QR dinámicos (`/escanear-qr`) y registro manual.
3. **Planes y Membresías:**
   - Seguimiento del estado de suscripciones (`activa`, `vencida`, `cancelada`) y alertas de vencimiento.
4. **Rutinas y Catálogo de Ejercicios:**
   - Catálogo clasificado por grupos musculares y dificultad con videos demostrativos.
   - Planificación semanal con series, repeticiones y tiempos de descanso.
5. **Seguimiento Antropométrico y Progreso:**
   - Métricas de peso, altura, IMC y medidas corporales en centímetros.
6. **Dashboard y Analítica:**
   - Resumen administrativo de usuarios activos, concurrencia diaria y desglose de entradas por método.

---

## 🛠️ Tecnologías Principales

- **Backend:** Java 17, Spring Boot, Spring Security 6, Spring Data JPA, Hibernate, Flyway Migration, MySQL.
- **Frontend:** Angular 17+, TypeScript, HTML5, CSS3.
- **Testing & API Docs:** Postman Collection con 47 tests automatizados y documentación Markdown integral.

---

## 📖 Documentación Detallada

Para más información técnica, consulta los siguientes documentos dentro de `apexfit/apexfit-backend/`:
- [Explicación Completa del Backend (Arquitectura y MER)](apexfit/apexfit-backend/DOCUMENTACION_BACKEND.md)
- [Catálogo de Endpoints de la API REST](apexfit/apexfit-backend/DOCUMENTACION_API.md)

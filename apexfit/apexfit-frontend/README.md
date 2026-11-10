# ApexFit — Frontend

ApexFit es un sistema web integral de gestión para gimnasios y centros de entrenamiento deportivo. Este repositorio contiene el **frontend** monorepo desarrollado con **Angular 22**, compuesto por dos aplicaciones SPA independientes y una librería compartida (`shared`).

## 📱 Proyectos en el Workspace

| Proyecto | Para quién | Puerto | Funcionalidades Principales |
|---|---|---|---|
| `app-usuarios` | Clientes | `4200` | • **Hoy:** Resumen de entrenamiento del día y estado de membresía.<br>• **Rutina:** Modo guiado con seguimiento de avance diario.<br>• **Mi QR:** Código QR para registro de entrada/salida.<br>• **Asistencia:** Historial cronológico con tiempo de permanencia y botón de registro de salida.<br>• **Progreso:** Registro periódico de peso, altura y medidas anatómicas.<br>• **Coach:** Consulta de datos de contacto directo de su entrenador asignado.<br>• **Asistente Virtual (IA):** Chatbot flotante interactivo con Google Gemini.<br>• **Login y Registro único.** |
| `panel-administrativo` | Administrador y Entrenadores | `4201` | • **Resumen:** Métricas de aforo, concurrencia y clientes activos.<br>• **Asistencia:** Auditoría de accesos y registros del día.<br>• **Inactividad:** Detección de miembros en riesgo de deserción.<br>• **Usuarios & Membresías:** Alta, baja lógica y control de planes.<br>• **Asignaciones & Mis Clientes:** Gestión de asesorías deportivas.<br>• **Ejercicios & Rutinas:** Catálogo y creador semanal de entrenamientos.<br>• **Asistente Virtual (IA):** Soporte inteligente para consultas rápidas. |
| `shared` | Librería interna | — | Autenticación, interceptor JWT, guards (`accessGuard`, `guestGuard`), componente `Campana` de notificaciones, componente flotante `ChatBotComponent` (`<lib-chatbot />`), página `MiCuenta` y variables de diseño CSS (`_theme.scss`). |

---

## 🚀 Instalación y Requisitos

- **Node.js:** Versión 22.x o 24.x LTS.
- **npm:** 10.x o superior.

```bash
cd apexfit-frontend
npm ci
```

---

## 💻 Cómo Ejecutar Localmente

Asegúrate de tener el backend de Spring Boot corriendo en el puerto `8080`. En dos terminales independientes:

```bash
# Terminal 1: Aplicación para Clientes
npm run start:usuarios   # 🌐 http://localhost:4200

# Terminal 2: Panel Administrativo y Entrenadores
npm run start:panel      # 🌐 http://localhost:4201
```

> **Nota de Navegación y Proxy:** En desarrollo, el archivo `proxy.conf.json` redirige las peticiones `/api` al backend (`http://localhost:8080`). Al iniciar sesión en `http://localhost:4200`, el sistema redirige automáticamente al usuario según su rol (`CLIENTE` se queda en el portal de usuarios, mientras que `ADMINISTRADOR` y `ENTRENADOR` son transferidos con su token de sesión al panel en el puerto `4201`).

---

## 🧪 Pruebas Automatizadas

El proyecto utiliza **Vitest** con entorno **jsdom** para pruebas unitarias rápidas sin requerir navegador:

```bash
# Ejecutar suite de pruebas de cada proyecto
npx ng test app-usuarios --watch=false
npx ng test panel-administrativo --watch=false
npx ng test shared --watch=false
```

---

## 📦 Compilación para Producción

```bash
npx ng build app-usuarios --configuration production
npx ng build panel-administrativo --configuration production
```

Los artefactos listos para servir se generan en `dist/app-usuarios/browser` y `dist/panel-administrativo/browser`.

---

## 🔑 Cuentas de Prueba para Desarrollo

| Rol | Correo | Contraseña | Destino |
| --- | --- | --- | --- |
| **Administrador** | `admin@apexfit.com` | `admin123` | Panel (`:4201`) |
| **Entrenador** | `pedro.entrenador@apexfit.com` | `entrenador123` | Panel (`:4201`) |
| **Cliente** | `cliente@apexfit.test` | `Prueba123` | App Clientes (`:4200`) |
| **Cliente** | `carlos@apexfit.com` | `12345` | App Clientes (`:4200`) |

---

## 🤖 Integración del Asistente Virtual (Chatbot IA)

Ambas aplicaciones (`app-usuarios` y `panel-administrativo`) incorporan el componente `<lib-chatbot />` exportado por la librería `shared`:
- Se presenta como un botón de acción flotante (FAB) accesible desde cualquier vista.
- La barra de navegación inferior en dispositivos móviles cuenta con `position: fixed` y un espaciador de seguridad (`padding-bottom: 70px`) para asegurar visibilidad ergonómica permanente.
- Envía las consultas a `POST /api/v1/chat`, donde el backend utiliza Google Gemini AI con el contexto de la sesión activa del usuario.

# Virtual Pet 🐾

**"Virtual Pet nunca defraudará a su mascota"**

Virtual Pet es una tienda para mascotas 100% digital, orientada a brindar servicio sin locales físicos y con alcance exclusivo a la ciudad de Mar del Plata. El ecommerce ofrece todo tipo de productos, desde alimentos para peces hasta cuchas para perros.

## Objetivos de Negocio
- **Experiencia de Usuario:** Contar con un ecommerce intuitivo, veloz y con excelente UX.
- **Logística Eficiente:** Garantizar entregas rápidas y seguras utilizando equipo propio o vía courier contratado.
- **Seguridad:** Proveer al cliente una experiencia segura, confiable y libre de fraudes.
- **Arquitectura Eficiente:** Mantener una arquitectura simple y de bajo costo operativo.

## Funcionalidades Principales
- **Clientes (Storefront):** Consulta detallada de productos, gestión de carrito, realización de pedidos y seguimiento de envíos.
- **Empleados (Backoffice):** Gestión básica de pedidos por parte del equipo de depósito para su preparación y despacho.

## Estado Actual del Desarrollo
El proyecto se encuentra en fase de desarrollo activo. Actualmente contamos con:
- **Frontend (`apps/web`):** Aplicación construida con **Next.js** (React, TypeScript). Rutas principales de catálogo, carrito, checkout, registro de usuarios y perfiles listas (algunas consumiendo servicios mockeados temporalmente).
- **Backend (`apps/backend`):** API REST robusta construida con **Spring Boot 3 (Java 21)**. Incluye autenticación segura mediante **JWT**, persistencia con **Spring Data JPA** y control de versionado de esquemas automatizado con **Flyway**.
- **Base de Datos:** Esquemas relacionales diseñados e implementados en **PostgreSQL** (`auth`, `catalog`, etc.).
- **Infraestructura Local:** Entorno de desarrollo 100% Dockerizado. Mediante `docker-compose` se orquestan en conjunto la base de datos PostgreSQL, Redis y la API de Spring Boot.

## Próximos Pasos (Arquitectura Cloud)
Para alcanzar el objetivo de una arquitectura de producción escalable, falta finalizar la integración con los siguientes servicios (orientado a **AWS**):
- **Bases de datos y caché en la nube** (e.g., RDS para PostgreSQL y ElastiCache para Redis).
- **Almacenamiento Estático (Amazon S3):** Para el alojamiento de imágenes de productos y assets del ecommerce.
- Refinamiento de la arquitectura de despliegue y servicios de envío de emails/notificaciones.

---

## 💻 Guía para Entorno de Desarrollo (Local)

Para levantar el proyecto localmente, es indispensable tener instalado **Docker Desktop** y **Node.js**.

### 1. Levantar Servicios y Backend
En la raíz del proyecto, ejecutá:
```bash
docker-compose up -d --build
```
*Esto levantará automáticamente PostgreSQL (ejecutando las migraciones de Flyway), Redis y la API de Spring Boot en `http://localhost:8080`.*

### 2. Levantar Frontend
En otra terminal, navegá a la carpeta web y arrancá Next.js:
```bash
cd apps/web
npm install
npm run dev
```
*El ecommerce estará disponible en `http://localhost:3000`.*

# To-Do List: Virtual Pet

Listado de tareas pendientes para finalizar la implementación de la arquitectura y los requerimientos de negocio, basado en el contexto del proyecto.

## Deuda Técnica (Prioridad Alta)
- [ ] **Refactorizar Entidad de Usuario (Auth):** Actualizar `UserEntity.java` y `AuthService.java` para que coincidan con los scripts finales de la base de datos PostgreSQL (`V1.0__init_schema_auth.sql`). Las propiedades de nombre y domicilio deben guardarse correctamente en las tablas `customers` y `addresses`, eliminando la dependencia temporal de `ddl-auto=update` que ensucia la tabla de `users`.

## Frontend (Next.js)

### Storefront (Marketplace)
- [ ] **Mi Cuenta (Seguimiento):** Desarrollar y conectar las interfaces del historial de compras y visualización del estado logístico del envío para los clientes.
- [x] *Pasarela de Pagos:* Integración real pospuesta. Se mantendrá la validación a través de la pasarela simulada (`/checkout/mock`).

### Backoffice (Operarios)
- [ ] **Estructura `/manager`:** Crear el grupo de rutas en Next.js bajo el path `/manager` para aislar todas las vistas administrativas.
- [ ] **Autenticación Independiente:** Implementar un portal de login en `/manager/login` exclusivo para el personal. El sistema debe validar credenciales específicas de empleados (quienes están en tablas separadas de los clientes) y exigir el rol `ROLE_EMPLEADO`.
- [ ] **Dashboard Logístico:**
  - Crear una tabla/listado en tiempo real de pedidos con estado "pagado" listos para armar.
  - Añadir botones de acción para avanzar el ciclo logístico ("Preparar", "En camino", "Entregado").

## Backend (Spring Boot 3)

### Infraestructura y Datos
- [ ] **Módulo de Carrito (Redis):** 
  - Implementar un `CartService` que utilice Spring Data Redis para persistir el estado de los carritos en la memoria RAM, configurando políticas de expiración automática (TTL).
- [ ] **Integración Amazon S3:** 
  - Desarrollar el adaptador SDK de AWS S3 y los endpoints correspondientes para la carga y lectura de las imágenes del catálogo.

### Lógica de Negocio
- [ ] **Módulo de Pedidos (Checkout Transaccional):** 
  - Crear lógica transaccional estricta que reciba el carrito desde Redis, aplique la validación y el descuento concurrente de stock (usando locks para evitar cualquier sobreventa), y guarde la orden de compra en la base de datos.
- [ ] **Módulo de Logística (Backoffice):** 
  - Exponer endpoints seguros que permitan al personal del depósito listar los pedidos y actualizar sus estados logísticos de envío.

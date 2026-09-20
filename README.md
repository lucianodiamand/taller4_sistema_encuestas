# Taller 4 - Sistema de Encuestas

## 1. Descripción General

Sistema de encuestas personalizadas desarrollado para una empresa encuestadora. La aplicación permite crear y administrar encuestas destinadas a diferentes clientes, garantizando el anonimato de los encuestados y el control del proceso de validación de respuestas.

El sistema se compone de:

- *Backend: API REST desarrollada en **Java Spring Boot, con persistencia mediante **JPA/Hibernate (ORM)* y seguridad basada en *JWT*.
- *Frontend: Aplicación **Angular* con vistas diferenciadas según el rol del usuario autenticado.

## 2. Modelo de Negocio

La empresa encuestadora necesita generar diferentes encuestas adaptadas a las necesidades de cada cliente. Estas encuestas son respondidas por usuarios anónimos y cada encuestado podrá completarlas una única vez.

El acceso a la encuesta se realiza a través de un *enlace de un solo uso* proporcionado por un encuestador. Una vez respondida la encuesta, la respuesta vuelve al encuestador, quien podrá **aprobarla o rechazarla* en caso de detectar contenido no válido o spam.

## 3. Objetivo

Brindar una solución integral para la gestión de encuestas, facilitando la recolección de información confiable y preservando la privacidad de los participantes.

## 4. Roles del Sistema

El sistema define *2 tipos de usuarios registrados* (los encuestados NO se registran, acceden de forma anónima mediante el enlace):

### 4.1 Administrador
- Gestiona usuarios del sistema (alta, baja, modificación de encuestadores).
- Gestiona clientes (empresas/personas para quienes se crean las encuestas).
- Tiene visibilidad total sobre todas las encuestas del sistema.
- Puede ver reportes/estadísticas globales.
- Crea, puede cambiar de estado (activa → cerrada y viceversa) gestiona sus propias encuestas (preguntas, opciones, configuración).
- Asocia encuestas a un cliente.

### 4.2 Encuestador
- Genera enlaces de un solo uso (con fecha/hora de expiración) y sus respectivos códigos QR.
- Puede ver sus propias estádisticas sobre las encuestas respondidas.
- Revisa las respuestas recibidas: *aprueba o rechaza* cada una.

## 5. Modelo de Entidades (propuesta – 8 entidades)

| # | Entidad | Descripción |
|---|---------|-------------|
| 1 | *Usuario* | Administradores y encuestadores. Contiene credenciales, rol, datos de contacto. |
| 2 | *Encuestador* | Genera QR de las encuestas, filtra respuestas y las valida. |
| 3 | *Cliente* | Empresa o persona para la cual se crea una encuesta. |
| 4 | *Encuesta* | Contenedor de preguntas, asociada a un cliente y a un encuestador (usuario, creador). Tiene estado (activa, cerrada). |
| 5 | *RespuestaEncuesta* | Respuesta completa enviada por un encuestado anónimo a través de un enlace. Tiene estado de validación (pendiente, aprobada, rechazada). |

### Relaciones principales
- Una Encuesta tiene un Usuario (el creador).
- Un Cliente tiene un Usuario (el creador).
- Un Encuestador tiene un Usuario.
- Un Encuestador puede tener ninguna o muchas RespuestaEncuesta.
- Un Cliente puede tener ninguna o muchas Encuesta.
- Una Encuesta tiene un Cliente.
- Una Encuesta puede tener ninguna o muchas RespuestaEncuesta.
- Una RespuestaEncuesta tiene un Encuestador.
- Una RespuestaEncuesta tiene una Encuesta.

## 6. Requerimientos Funcionales

### Gestión de usuarios y autenticación
- RF01: El sistema debe permitir el login mediante usuario/contraseña, generando un token JWT.
- RF02: El sistema debe validar el token JWT en cada request a endpoints protegidos.
- RF03: El administrador debe poder crear, editar, desactivar y listar usuarios encuestadores.

### Gestión de clientes
- RF04: El administrador debe poder crear, editar, listar y eliminar clientes.

### Gestión de encuestas
- RF05: El administrador debe poder crear una encuesta asociada a un cliente, definiendo preguntas y tipo de cada una.
- RF06: El administrador debe poder editar/eliminar preguntas.
- RF07: El administrador debe poder cambiar el estado de la encuesta (activa → cerrada).

### Enlaces y acceso anónimo
- RF08: El sistema (encuestador) debe generar un enlace único (token) por cada encuestado.
- RF09: El sistema debe generar un código QR asociado a cada enlace.
- RF10: Al acceder al enlace, el sistema debe validar que no haya sido utilizado.
- RF11: Un enlace ya utilizado no debe permitir volver a responder la encuesta (garantiza respuesta única).

### Respuestas
- RF12: El encuestado debe poder completar y enviar la encuesta de forma anónima (sin necesidad de login).
- RF13: Al enviar la respuesta, el enlace debe marcarse como "respondido" y quedar inhabilitado.
- RF14: El encuestador debe poder visualizar las respuestas pendientes de validación.
- RF15: El encuestador debe poder aprobar o rechazar cada respuesta.

### Reportes
- RF16: El administrador debe poder exportar los resultados (respuestas aprobadas) de una encuesta a un archivo CSV.
- RF17: El sistema debe mostrar estadísticas básicas por encuesta (cantidad de enlaces generados, respondidos, aprobados, rechazados).

## 7. Requerimientos No Funcionales

- RNF01: *Seguridad*: autenticación y autorización basadas en JWT, con control de acceso por rol (RBAC) tanto en backend (@PreAuthorize/@Secured) como en frontend (guards de rutas Angular).
- RNF02: *Persistencia*: uso de ORM (JPA/Hibernate) sobre una base de datos relacional (MySQL/PostgreSQL/H2 para desarrollo).
- RNF03: *Arquitectura*: API REST documentada (se recomienda Swagger/OpenAPI).
- RNF04: *Anonimato*: no debe registrarse ningún dato identificatorio del encuestado (ni IP, ni nombre, ni email) al guardar la respuesta.
- RNF05: *Usabilidad*: la interfaz de respuesta a la encuesta (vista pública, sin login) debe ser simple y responsive, dado que se accede mayormente desde celular vía QR.
- RNF06: *Validaciones*: tanto en frontend.
- RNF07: *Manejo de errores*: respuestas HTTP y mensajes claros ante enlaces expirados, ya utilizados, o inexistentes.

## 8. Reglas de Negocio

- RN01: No se pueden generar enlaces para una encuesta que no esté "activa".
- RN02: Un enlace a una encuesta expirada (activa → cerrada) no puede ser respondido, aunque el encuestado tenga la URL.
- RN03: Solo el encuestador dueño de la encuesta puede aprobar/rechazar sus respuestas.
- RN04: Una respuesta rechazada si se contabiliza en las estadísticas pero no se incluye en la exportación a Excel.

## 9. Ciclo de Vida de una Encuesta (flujo resumido)

1. Administrador crea la *Encuesta* para un *Cliente, con sus **Preguntas*.
2. Encuestador publica la encuesta.
3. Por cada encuestado, el sistema genera una *RespuestaEncuesta*.
4. El encuestado accede al enlace → completa la encuesta → se completa una *RespuestaEncuesta*.
5. El enlace queda marcado como "respondido" (no reutilizable).
6. El encuestador revisa la respuesta → *aprueba* o *rechaza*.
7. El Administrador exporta a Excel las respuestas aprobadas cuando lo necesite.

## 10. Tecnologías a Utilizar

- *Backend*: Java + Spring Boot (Spring Web, Spring Security, Spring Data JPA)
- *Autenticación*: JWT (jjwt o spring-security-oauth2-resource-server)
- *ORM / Base de datos*: Hibernate + PostgreSQL / MySQL (H2 para testing)
- *Frontend*: Angular (standalone components o módulos, Angular Router con guards, Reactive Forms)
- *Generación de QR*: librería tipo zxing (backend) o angularx-qrcode (frontend)
- *Exportación a Excel*: Apache POI
- *Documentación de API*: Swagger / OpenAPI

## 11. Alcance del Trabajo Práctico

### Incluido (obligatorio)
- CRUD completo de Usuarios, Clientes y Encuestas.
- Autenticación JWT con 2 roles.
- Flujo completo de enlace único → respuesta anónima → validación.
- Generación de QR.
- Exportación a CSV.
- Frontend Angular consumiendo la API, con vistas diferenciadas por rol y una vista pública para responder la encuesta.

## 12. Criterios de Aceptación (sugeridos para la entrega)

- [ ] El sistema permite login y devuelve un JWT válido.
- [ ] Un administrador puede gestionar usuarios encuestadores.
- [ ] Un administrador puede crear una encuesta completa con preguntas de al menos 2 tipos distintos.
- [ ] Se puede generar un enlace de encuesta y su QR correspondiente.
- [ ] Un usuario anónimo puede responder la encuesta a través del enlace, sin loguearse.
- [ ] El enlace no puede reutilizarse una vez respondido ni una vez expirado.
- [ ] El encuestador puede aprobar/rechazar respuestas.
- [ ] Se puede exportar a CSV el listado de respuestas aprobadas de una encuesta.
- [ ] Las rutas del frontend están protegidas según el rol del usuario logueado.

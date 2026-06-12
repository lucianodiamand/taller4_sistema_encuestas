# Taller 4 - Sistema de Encuestas

## Descripción

Sistema de encuestas personalizadas desarrollado para una empresa encuestadora. La aplicación permite crear y administrar encuestas destinadas a diferentes clientes, garantizando el anonimato de los encuestados y el control del proceso de validación de respuestas.

## Modelo de Negocio

La empresa encuestadora necesita generar diferentes encuestas adaptadas a las necesidades de cada cliente. Estas encuestas son respondidas por usuarios anónimos y cada encuestado podrá completarlas una única vez.

El acceso a la encuesta se realiza a través de un enlace de un solo uso proporcionado por un encuestador. Dicho enlace posee una fecha y hora de expiración. Una vez respondida la encuesta, la respuesta vuelve al encuestador, quien podrá aprobarla o rechazarla en caso de detectar contenido no válido o spam. Si la encuesta no es respondida dentro del plazo establecido, el sistema notificará al encuestador correspondiente.

## Funcionalidades Principales

* 📋 Creación y gestión de encuestas personalizadas.
* 🔗 Generación de enlaces de un único uso con tiempo de expiración.
* 👤 Respuestas completamente anónimas.
* ✅ Validación de respuestas por parte del encuestador.
* 🚫 Rechazo de respuestas consideradas spam o inválidas.
* 🔔 Notificaciones cuando una encuesta no es respondida.
* 📱 Generación de códigos QR para acceder rápidamente a las encuestas.
* 🔐 Gestión de privilegios y roles de usuario (2 tipos de usuarios).
* 📊 Exportación de resultados a archivos Excel.

## Objetivo

Brindar una solución integral para la gestión de encuestas, facilitando la recolección de información confiable y preservando la privacidad de los participantes.

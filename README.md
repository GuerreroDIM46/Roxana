# **Descripción de la Aplicación**

Esta aplicación móvil está diseñada para automatizar tareas logísticas, permitiendo la **validación de artículos** a través del escaneo de **códigos de barras**. Los usuarios pueden gestionar **listados de artículos** descargados desde una API externa, operar de forma **offline** y sincronizar los datos cuando se recupere la conexión a Internet.

## **Características principales**
- **Escaneo de códigos de barras**: Facilita la validación de artículos en listados de recepción, expedición, inventarios, etc.
- **Gestión offline/online**: Permite descargar listados para trabajar sin conexión y sincronizarlos cuando hay conectividad.
- **Sincronización automática**: Los datos locales se suben automáticamente cuando se detecta conexión a Internet.
- **Personalización de la presentación**: La API proporciona los datos de presentación, permitiendo personalizar cómo se muestran los listados y artículos en la interfaz.
- **Constructor de pantallas**: Permite configurar las pantallas según las necesidades del usuario y la naturaleza de los listados.

## **Requisitos del sistema**
- Dispositivo Android.
- Conexión a una API externa que gestione la lógica de negocio y la presentación de datos.
- Dependencias: **Vue.js** y **Cordova** para el desarrollo móvil nativo.

## **Instalación**
1. Clonar el repositorio en el entorno de desarrollo.
2. Ejecutar el comando `npm install` para instalar las dependencias.
3. Para compilar la aplicación para dispositivos móviles, utilizar Cordova con `cordova build android`.
4. Desplegar la aplicación en el dispositivo móvil.

## **Uso**
1. Iniciar sesión en la aplicación.
2. Descargar listados de artículos desde la API.
3. Validar los artículos mediante el lector de códigos de barras.
4. Sincronizar los listados validados una vez que la conexión esté disponible.

## **Despliegue en Internet**

### **API**:
- Servidor Testing: [API Testing](https://roxanaapitest.manabo.org/api)
- Despliegue: [API](https://.../api)

### **Aplicación (.apk)**:
- Puedes descargar la última versión del APK desde [aquí](https://github.com/usuario/repositorio/releases/download/v1.0/app.apk).

## **Contribuciones**
Las contribuciones al proyecto son bienvenidas. Para realizar cambios, crear un fork del repositorio y enviar una solicitud de extracción.


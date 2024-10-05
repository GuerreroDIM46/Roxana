# **Descripción de la Aplicación**

Esta aplicación móvil está diseñada para automatizar tareas logísticas, permitiendo la **validación de artículos** a través del escaneo de **códigos de barras**. Los usuarios pueden gestionar **listados de artículos** descargados desde una API externa, operar de forma **offline** y sincronizar los datos cuando se recupere la conexión a Internet.

## **Características principales**
- **Escaneo de códigos de barras**: Facilita la validación de artículos en listados de recepción, expedición, inventarios, etc.
- **Gestión offline/online**: Permite descargar listados para trabajar sin conexión y sincronizarlos cuando hay conectividad.
- **Sincronización automática**: Los datos locales se suben automáticamente cuando se detecta conexión a Internet.
- **Personalización de la presentación**: La API proporciona los datos de presentación, permitiendo personalizar cómo se muestran los listados y artículos en la interfaz.
- **Constructor de pantallas**: Permite configurar las pantallas según las necesidades del usuario y la naturaleza de los listados.

## **Instrucciones de compilacion APK**
#### Esta aplicación ha sido compilado en un equipo con Windows 10 y las siguientes dependencias instaladas:
1. **Node.js (v20.11.1) y npm (v10.8.1)** Descarga en: [nodejs.org](https://nodejs.org/).
2. **Cordova (v12.0.0)**: Se puede instalar cor `npm install -g cordova`
3. **Gradle (v8.1)**: Descarga en:  [gradle.org](https://gradle.org/install/)
4. **JVM (Java Development Kit, v17.0.10)**: Descarga en: [Oracle](https://www.oracle.com/java/technologies/javase-downloads.html)
5. **ImageMagick (v7.1.1-38)**:  Descarga en: [ImageMagick](https://imagemagick.org/script/download.php#windows)

#### Instalación:
1. Clonar el repositorio en el entorno de desarrollo
2. Ejecutar el comando `npm install` para instalar las dependencias de Node.js.
3. Ejecutar el comando `cordova platform add android` para añadir la plataforma Android con Cordova.
4. Ejecutar el comando `npm run build:android` para compilar el archivo APK.

#### Uso:
1. Copiar el archivo roxana.apk en un dispositivo android.
2. Obtener todos los permisos necesarios para instalar aplicaciones de fuentes desconocidas.
3. Instalar y arrancar.

## **Despliegue en Internet**

### **API**:
- Servidor Testing: [API Testing](https://roxanaapitest.manabo.org/api)
- Despliegue: [API](https://.../api)

### **Aplicación (.apk)**:
- Puedes descargar la última versión del APK desde [aquí](https://github.com/usuario/repositorio/releases/download/v1.0/app.apk).

## **Contribuciones**
Las contribuciones al proyecto son bienvenidas. Para realizar cambios, crear un fork del repositorio y enviar una solicitud de extracción.


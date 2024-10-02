
## Crear proyecto Vue

    npm create vite@latest
    cd frontend
    npm install

#### para el path
variables de entorno para el path:
en vite.config.js:

    import path from "path"

    const projectRootDir = path.resolve(__dirname)

    resolve: {
        alias: {
        "@": path.resolve(projectRootDir, "src"),
        },
      },

#### para construir app
en main.js

    const app = createApp(App)

    app.mount('#app')

#### para los scripts y el router

    npm install cpy-cli --save-dev
    npm install cpy-cli rimraf --save-dev
    npm install npm-run-all --save-dev
    npm install vue-router@4

#### pagina de muestra
en /src/views/Home.vue (modificar App.vue tambien)

#### para configurar el router
en main.js:

    import { createRouter, createWebHashHistory } from 'vue-router'

    const Home = () => import('@/views/Home.vue')  //para la pagina de prueba

    const routes = [
        { path: '/', redirect: '/home'},  //para la pagina de prueba
        { path: '/home', component: Home, name: 'Home' } //para la pagina de prueba
    ]

    app.use(router)

#### para configurar bootstrap

    npm i --save bootstrap @popperjs/core    
    npm i --save-dev sass

en /scss/styles.scss

    @import "bootstrap/scss/bootstrap";

en main.js, ** quitar el import de styles.css**, y luego:

    import '@/scss/styles.scss'
    import * as bootstrap from 'bootstrap'

### Para instalar pinia

    npm install pinia

en main.js

    import { createPinia } from 'pinia'
    const pinia = createPinia()
    app.use(pinia)

### Para instalar axios

    npm install axios
    
### Vamos con Cordova

#### para instalar cordova

    cordova create roxana-app

copiar /www y config.xml de la carpeta roxana-app a ./ y borrar la carpeta roxana-app   
en package.json, cambiar la variable:

    "type": "commonjs",   

y dejar los scripts como estos (para generar los iconos, que este el logo en su carpeta y el imagemagick instalado):

    "dev": "vite",
    "build": "vite build && node postbuild.js && npm run copy-vite",
    "preview": "vite preview",
    "generate-icon-lpdi": "magick src/assets/logo_roxana.jpeg -resize 36x36 platforms/android/app/src/main/res/mipmap-ldpi/logo_roxana.png",
    "generate-icon-mpdi": "magick src/assets/logo_roxana.jpeg -resize 48x48 platforms/android/app/src/main/res/mipmap-mdpi/logo_roxana.png",
    "generate-icon-hdpi": "magick src/assets/logo_roxana.jpeg -resize 72x72 platforms/android/app/src/main/res/mipmap-hdpi/logo_roxana.png",
    "generate-icon-xhdpi": "magick src/assets/logo_roxana.jpeg -resize 96x96 platforms/android/app/src/main/res/mipmap-xhdpi/logo_roxana.png",
    "generate-icon-xxhdpi": "magick src/assets/logo_roxana.jpeg -resize 144x144 platforms/android/app/src/main/res/mipmap-xxhdpi/logo_roxana.png",
    "generate-icon-xxxhdpi": "magick src/assets/logo_roxana.jpeg -resize 192x192 platforms/android/app/src/main/res/mipmap-xxxhdpi/logo_roxana.png",
    "generate-icons": "npm-run-all --serial generate-icon-lpdi generate-icon-mpdi generate-icon-hdpi generate-icon-xhdpi generate-icon-xxhdpi generate-icon-xxxhdpi",
    "copy-vite": "cpy dist/**/* www/",
    "copy-app": "cpy \"platforms/android/app/build/outputs/apk/debug/app-debug.apk\" ./ --rename=roxana.apk --flat",
    "delete-output": "rimraf platforms/android/app/build/outputs/apk/debug/app-debug.apk",
    "build:android": "npm run build && npm run generate-icons && cordova build android && npm run copy-app && npm run delete-output"

el archivo postbuild.js es nuestro postprocesado para modificar el proyecto vite de /www y adaptarlo a las necesidades de cordova
en config.xml, cambiar el nombre del programa y el del paquete como minimo

    <widget id="io.cordova.roxana" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>Roxana</name>

actualizar los paquetes del proyecto e instalar la plataforma android

    npm update
    cordova platform add android

cambiar los iconos en config.xml

    <platform name="android">
        <icon src="platforms/android/app/src/main/res/mipmap-ldpi/logo_roxana.png" density="ldpi" />
        <icon src="platforms/android/app/src/main/res/mipmap-mdpi/logo_roxana.png" density="mdpi" />
        <icon src="platforms/android/app/src/main/res/mipmap-hdpi/logo_roxana.png" density="hdpi" />
        <icon src="platforms/android/app/src/main/res/mipmap-xhdpi/logo_roxana.png" density="xhdpi" />
        <icon src="platforms/android/app/src/main/res/mipmap-xxhdpi/logo_roxana.png" density="xxhdpi" />
        <icon src="platforms/android/app/src/main/res/mipmap-xxxhdpi/logo_roxana.png" density="xxxhdpi" />
    </platform>


#### para instalar phonegap-plugin-barcodescanner

    cordova plugin add phonegap-plugin-barcodescanner

en platforms/android/phonegap-plugin-barcodescanner/*nombredelproyecto*.gradle, en dependencies, cambiar *compile* por **implementation**

    dependencies {
        implementation(name:'barcodescanner-release-2.1.5', ext:'aar')
    }

en config.xml

    <widget id="io.cordova.test6" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0" xmlns:android="http://schemas.android.com/apk/res/android">

    <platform name="android">  
        <uses-permission android:name="android.permission.CAMERA" />
    </platform>

#### Para instalar cordova-plugin-network-information

    cordova plugin add cordova-plugin-network-information

en config.xml

    <platform name="android">  
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
        <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    </platform>

 








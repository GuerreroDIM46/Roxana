#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ajustar la ruta al archivo config.xml desde la carpeta postbuild
const configFilePath = path.join(__dirname, '..', 'config.xml');

// Líneas de iconos que deseas agregar
const iconLines = `
    <icon src="platforms/android/app/src/main/res/mipmap-ldpi/logo_roxana.png" density="ldpi"/>
    <icon src="platforms/android/app/src/main/res/mipmap-mdpi/logo_roxana.png" density="mdpi"/>
    <icon src="platforms/android/app/src/main/res/mipmap-hdpi/logo_roxana.png" density="hdpi"/>
    <icon src="platforms/android/app/src/main/res/mipmap-xhdpi/logo_roxana.png" density="xhdpi"/>
    <icon src="platforms/android/app/src/main/res/mipmap-xxhdpi/logo_roxana.png" density="xxhdpi"/>
    <icon src="platforms/android/app/src/main/res/mipmap-xxxhdpi/logo_roxana.png" density="xxxhdpi"/>
`;

// Leer el archivo config.xml
fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo config.xml:', err);
        return;
    }

    // Verifica si ya existen las líneas de los iconos para no duplicar
    if (data.includes('<icon src="platforms/android/app/src/main/res/mipmap-ldpi/logo_roxana.png"')) {
        console.log('Las líneas de íconos ya están presentes.');
        return;
    }

    // Añadir las líneas de iconos antes de la primera aparición de </platform>
    const modifiedData = data.replace('</platform>', `${iconLines}\n    </platform>`);

    // Escribir el archivo modificado de nuevo
    fs.writeFile(configFilePath, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('Error al escribir el archivo config.xml modificado:', err);
        } else {
            console.log('Líneas de íconos añadidas correctamente a config.xml.');
        }
    });
});

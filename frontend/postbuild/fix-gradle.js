#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ruta al archivo gradle
const gradleFilePath = path.join(__dirname, '..', 'platforms', 'android', 'phonegap-plugin-barcodescanner', 'roxana-barcodescanner.gradle');

// Lee el archivo gradle
fs.readFile(gradleFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo .gradle:', err);
        return;
    }

    // Reemplaza 'compile' por 'implementation' en la sección de dependencias
    const modifiedData = data.replace(/compile/g, 'implementation');

    // Escribe el archivo modificado de nuevo
    fs.writeFile(gradleFilePath, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('Error al escribir el archivo .gradle modificado:', err);
        } else {
            console.log('Archivo .gradle modificado correctamente: compile cambiado por implementation.');
        }
    });
});

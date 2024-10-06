const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Cambia la ruta para que apunte al config.xml correcto
function updateConfigXml() {
    const configXmlPath = path.join(__dirname, '../config.xml'); // Ajusta la ruta al archivo config.xml en la raíz
    const configXml = fs.readFileSync(configXmlPath, 'utf8');

    // Usar xml2js para modificar el archivo XML
    xml2js.parseString(configXml, (err, result) => {
        if (err) throw err;

        // Obtener la versión actual del widget
        let currentVersion = result.widget.$.version;
        console.log(`Versión actual en config.xml: ${currentVersion}`);

        // Dividir la versión en partes (mayor, menor, parche)
        const versionParts = currentVersion.split('.').map(Number);

        // Incrementar la parte del parche (la última)
        versionParts[2] += 1;

        // Unir las partes y establecer la nueva versión
        const newVersion = versionParts.join('.');
        result.widget.$.version = newVersion;

        // Convertir el objeto de vuelta a XML
        const builder = new xml2js.Builder();
        const updatedConfigXml = builder.buildObject(result);

        // Escribir el nuevo config.xml
        fs.writeFileSync(configXmlPath, updatedConfigXml);

        console.log(`Versión de config.xml actualizada a ${newVersion}`);
    });
}

// Ejecutar la función de actualización de config.xml
updateConfigXml();

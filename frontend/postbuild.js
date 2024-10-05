const fs = require('fs')
const path = require('path')

// Ruta al index.html generado por Vite
const indexPath = path.join(__dirname, 'dist', 'index.html')

// Lee el contenido del index.html generado por Vite
fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer index.html:', err)
        return;
    }

    // Modifica el contenido agregando cordova.js y el evento deviceready
    const updatedHtml = data
        .replace(
            '</head>',
            `
    <script src="cordova.js"></script>
    <script type="text/javascript">
        document.addEventListener('deviceready', function() {
        console.log('Cordova está listo.');
        }, false)
    </script>
    </head>
    `
        )

    // Sobrescribe el archivo index.html modificado en la carpeta dist
    fs.writeFile(indexPath, updatedHtml, 'utf8', (err) => {
        if (err) {
            console.error('Error al escribir index.html:', err)
        } else {
            console.log('index.html actualizado correctamente con cordova.js y deviceready.')
        }
    })
})

export const soundLibrary = {
    reproducirSonido(tipo) {
        let archivoAudio

        if (tipo === 'success') {
            archivoAudio = 'src/assets/success.mp3' // Sonido de éxito
        } else if (tipo === 'fail') {
            archivoAudio = 'src/assets/fail.mp3' // Sonido de error
        }

        const media = new Media(
            archivoAudio,
            () => {}, // Éxito
            (err) => console.error("Error al reproducir sonido: ", err) // Manejo de error
        )
        media.play()
    }
}

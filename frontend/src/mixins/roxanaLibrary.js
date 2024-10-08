import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';

export const roxanaLibrary = {
    computed: {
        ...mapState(useCombinedStore, ['cordovaListo']) // Mapeo directo de cordovaListo
    },
    methods: {
        ...mapActions(useCombinedStore, ['setCordovaListo']), // Mapeamos la acción para modificar el estado

        // Función para cuando Cordova esté listo
        onDeviceReady() {
            this.setCordovaListo(true); // Llamamos la acción para cambiar el estado
            console.log("Cordova está listo.");
        },

        // Reproducir sonidos según el tipo (éxito o error)
        reproducirSonido(tipo) {
            let archivoAudio;
            if (tipo == 'success') {
                archivoAudio = 'src/assets/sounds/success.mp3'; // Ruta del sonido de éxito
            } else if (tipo == 'fail') {
                archivoAudio = 'src/assets/sounds/fail.mp3'; // Ruta del sonido de error
            }

            // Reproducir sonido usando el plugin de media de Cordova
            const media = new Media(archivoAudio,
                () => console.log("Sonido reproducido correctamente"), // Éxito
                (err) => console.error("Error al reproducir sonido: ", err) // Error
            );
            media.play(); // Iniciar la reproducción
        },

        // Función para extraer el ID desde un objeto HATEOAS
        extraerId(objeto, tipoEnlace = 'self') {
            if (!objeto || !objeto._links || !objeto._links[tipoEnlace] || !objeto._links[tipoEnlace].href) {
                return null;
            }
            return objeto._links[tipoEnlace].href.split('/').pop(); // Extraer el último segmento del href (ID)
        },

        // Puedes añadir más métodos o funcionalidades aquí según sea necesario
    },
    mounted() {
        // Escuchar el evento deviceready cuando Cordova esté disponible
        document.addEventListener("deviceready", this.onDeviceReady, false);
        console.log("Esperando a Cordova...");
    },
    beforeDestroy() {
        // Remover el listener de deviceready cuando el componente se destruye
        document.removeEventListener("deviceready", this.onDeviceReady, false);
    }
};

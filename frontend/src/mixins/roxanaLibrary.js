import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';

export const roxanaLibrary = {
    computed: {
        ...mapState(useCombinedStore, ['cordovaListo' , 'codigoEscaneado']) // Mapeo directo de cordovaListo
    },
    methods: {
        ...mapActions(useCombinedStore, ['setCordovaListo', 'setCodigoEscaneado']), // Mapeamos la acción para modificar el estado

        // Función para cuando Cordova esté listo
        onDeviceReady() {
            this.setCordovaListo(true); // Llamamos la acción para cambiar el estado
            console.log("Cordova está listo.");
        },

        // Reproducir sonidos según el tipo (éxito o error)
        reproducirSonido(tipo) {
            let archivoAudio;
            if (tipo == 'success') {
                archivoAudio = 'src/assets/success.mp3'; // Ruta del sonido de éxito
            } else if (tipo == 'fail') {
                archivoAudio = 'src/assets/fail.mp3'; // Ruta del sonido de error
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
        async escanear() {
            if (!this.cordovaListo) {
                alert("Cordova no está disponible todavía.");
                return;
            }        
            return new Promise((resolve, reject) => {
                cordova.plugins.barcodeScanner.scan(
                    (result) => {
                        if (!result.cancelled) {
                            // Guardar el código escaneado en Pinia
                            this.setCodigoEscaneado(result.text);
                            console.log("Código escaneado guardado:", result.text);
                            resolve(result.text);  // Resolver la promesa con el resultado del escaneo
                        } else {
                            alert("Escaneo cancelado");
                            reject(new Error("Escaneo cancelado")); // Rechazar la promesa si se cancela el escaneo
                        }
                    },
                    (error) => {
                        alert("Error al escanear: " + error);
                        reject(error);  // Rechazar la promesa si ocurre un error
                    },
                    {
                        disableSuccessBeep: true, // Desactivar el pitido de éxito
                    }
                );
            });
        }
        

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

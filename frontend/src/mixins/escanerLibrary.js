import { mapState, mapActions } from 'pinia'
import { useCordovaStore } from '@/storage/cordovaStore'
import { useEscanerStore } from '@/storage/escanerStore'

export const escanerLibrary = {
    computed: {
        ...mapState(useCordovaStore, ['cordovaListo']),
        ...mapState(useEscanerStore, ['codigoEscaneado'])
    },
    methods: {
        ...mapActions(useEscanerStore, ['setCodigoEscaneado']), 

        // Función para realizar el escaneo
        async escanear() {
            if (!this.cordovaListo) {
                alert("Cordova no está disponible.")
                return
            }
            return new Promise((resolve, reject) => {
                cordova.plugins.barcodeScanner.scan(
                    (result) => {
                        if (!result.cancelled) {
                            this.setCodigoEscaneado(result.text) 
                            resolve(result.text)  // Resolver la promesa con el resultado
                        } else {
                            alert("Escaneo cancelado")
                            reject(new Error("Escaneo cancelado")) 
                        }
                    },
                    (error) => {
                        alert("Error al escanear: " + error)
                        reject(error)  
                    },
                    {
                        disableSuccessBeep: true 
                    }
                )
            })
        }
    }
}

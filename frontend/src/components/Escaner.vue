<script>
import { cordovaMixin } from '@/mixins/cordovaMixin'
import { useCombinedStore } from '@/storage/combinedStore'

export default {
    mixins: [cordovaMixin],
    computed: {
        cordovaListo() {
            return useCombinedStore().cordovaListo
        },
    },
    methods: {
        escanear() {
            if (!this.cordovaListo) {
                alert("Cordova no está disponible todavía.")
                return;
            }

            cordova.plugins.barcodeScanner.scan(
                (result) => {
                    if (!result.cancelled) {
                        this.$emit("codigoEscaneado", result.text)
                    } else {
                        alert("Escaneo cancelado");
                    }
                },
                (error) => {
                    alert("Error al escanear: " + error)
                }
            )
        },
    },
}
</script>

<template>
    <div>
        <button type="button" class="custom-btn" @click="escanear" :disabled="!cordovaListo">
            Escanear Código de Barras
        </button>
        <p v-if="!cordovaListo" style="color: red">Cordova no está listo aún</p>
    </div>
</template>

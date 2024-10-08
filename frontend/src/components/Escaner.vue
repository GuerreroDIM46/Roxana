<script>
import { roxanaLibrary } from '@/mixins/roxanaLibrary'
import { useCombinedStore } from '@/storage/combinedStore'

export default {
    mixins: [roxanaLibrary],
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
                },
                {
                    disableSuccessBeep: true, // Desactivar el pitido de éxito
                }
            )
        },
    },
}
</script>

<template>
    <div>
        <button type="button" class="custom-btn h-20" @click="escanear" :disabled="!cordovaListo">
            <div>
                <i class="pi pi-search me-1"></i>
                <span>Escanear</span>
            </div>
        </button>
        <p v-if="!cordovaListo" style="color: red">Cordova no está listo aún</p>
    </div>
</template>

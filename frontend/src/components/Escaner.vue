<script>
export default {
    data() {
        return {
            cordovaListo: false, 
        }
    },
    methods: {
        escanear() {
            if (!this.cordovaListo) {
                alert("Cordova no está disponible todavía.")
                return
            }

            cordova.plugins.barcodeScanner.scan(
                (result) => {
                    if (!result.cancelled) {
                        this.$emit("codigoEscaneado", result.text)
                    } else {
                        alert("Escaneo cancelado")
                    }
                },
                (error) => {
                    alert("Error al escanear: " + error)
                }
            )
        },
        onDeviceReady() {
            this.cordovaListo = true
            console.log("Cordova está listo.")
        },
    },
    mounted() {
        document.addEventListener("deviceready", this.onDeviceReady, false)
        console.log("Esperando a Cordova...")
    },
    beforeDestroy() {
        document.removeEventListener("deviceready", this.onDeviceReady, false)
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

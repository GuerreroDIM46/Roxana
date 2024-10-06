import { useCombinedStore } from '@/storage/combinedStore'

export const cordovaMixin = {
    computed: {
        cordovaListo() {
            return this.$store.cordovaListo
        },
    },
    methods: {
        onDeviceReady() {
            const store = useCombinedStore()
            store.setCordovaListo(true)
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

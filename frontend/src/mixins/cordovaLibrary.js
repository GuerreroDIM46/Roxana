import { mapState, mapActions } from 'pinia'
import { useCordovaStore } from '@/storage/cordovaStore'

export const cordovaLibrary = {
    computed: {
        ...mapState(useCordovaStore, ['cordovaListo']) 
    },
    methods: {
        ...mapActions(useCordovaStore, ['setCordovaListo']), 
        
        onDeviceReady() {
            this.setCordovaListo(true) 
            console.log("Cordova está listo.")
        }
    },
    mounted() {
        document.addEventListener("deviceready", this.onDeviceReady, false)
        console.log("Esperando a Cordova...")
    },
    beforeDestroy() {
        document.removeEventListener("deviceready", this.onDeviceReady, false)
    }
}
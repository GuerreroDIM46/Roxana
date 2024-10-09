import { mapState, mapActions } from 'pinia'
import { useConexionStore } from '@/storage/conexionStore'
import { useCordovaStore } from '@/storage/cordovaStore'
import { cordovaLibrary } from '@/mixins/cordovaLibrary'

export const conexionLibrary = {
    mixins: [cordovaLibrary],
    computed: {
        ...mapState(useCordovaStore, ['cordovaListo']),
        ...mapState(useConexionStore, ['conexionLista']),
    },
    methods: {
        ...mapActions(useConexionStore, ['setConexionLista']),
        
        // Comprobar el estado inicial de la red
        checkNetworkStatus() {
            if (!this.cordovaListo) return
            
            if (navigator.connection) {
                const online = navigator.connection.type !== Connection.NONE
                this.setConexionLista(online)
            }
        },

        // Actualizar el estado de la red al cambiar
        updateNetworkStatus() {
            if (!this.cordovaListo) return

            const online = navigator.onLine
            this.setConexionLista(online)
        },
    },
    
    mounted() {
        this.checkNetworkStatus()
        document.addEventListener('offline', this.updateNetworkStatus, false)
        document.addEventListener('online', this.updateNetworkStatus, false)
    },

    beforeDestroy() {
        document.removeEventListener('offline', this.updateNetworkStatus)
        document.removeEventListener('online', this.updateNetworkStatus)
    },
}

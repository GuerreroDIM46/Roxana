<script>
import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';
import { cordovaMixin } from '@/mixins/cordovaMixin';

export default {
    mixins: [cordovaMixin],
    computed: {
        ...mapState(useCombinedStore, ['conexionLista', 'cordovaListo']),
    },
    methods: {
        ...mapActions(useCombinedStore, ['setConexionLista']),
        checkNetworkStatus() {
            if (!this.cordovaListo) {
                console.log("Cordova no está listo para comprobar el estado de la red.");
                return;
            }

            if (navigator.connection) {
                const networkState = navigator.connection.type;
                const online = networkState !== Connection.NONE;
                console.log(`Actualizando conexión a: ${online ? 'Online' : 'Offline'}`);
                this.setConexionLista(online);
            }
        },
        updateNetworkStatus() {
            if (!this.cordovaListo) {
                console.log("Cordova no está listo para actualizar el estado de la red.");
                return;
            }

            const online = navigator.onLine;
            console.log(`Actualizando conexión a: ${online ? 'Online' : 'Offline'}`);
            this.setConexionLista(online);
        },
    },
    watch: {
        conexionLista(newValue) {
            console.log('Nuevo estado de conexión:', newValue);
        }
    },
    mounted() {
        this.checkNetworkStatus(); // Comprobar el estado inicial de la red

        document.addEventListener('offline', this.updateNetworkStatus, false);
        document.addEventListener('online', this.updateNetworkStatus, false);
    },
    beforeDestroy() {
        document.removeEventListener('offline', this.updateNetworkStatus);
        document.removeEventListener('online', this.updateNetworkStatus);
    },
};
</script>

<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="status">
                <span>Estado: </span>
                <span v-if="conexionLista" style="color: green;">Online</span>
                <span v-else style="color: red;">Offline</span>
            </div>
            <div class="brand">
                <span>&copy; EIE</span>
            </div>
        </div>
    </footer>
</template>
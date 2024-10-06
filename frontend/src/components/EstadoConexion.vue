<script>
import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';
import { cordovaMixin } from '@/mixins/CordovaMixin';

export default {
    mixins: [cordovaMixin],
    computed: {
        ...mapState(useCombinedStore, ['isOnline', 'cordovaListo']), // Accede al estado de cordovaListo
    },
    methods: {
        ...mapActions(useCombinedStore, ['setOnlineStatus']),
        checkNetworkStatus() {
            if (!this.cordovaListo) {
                console.log("Cordova no está listo para comprobar el estado de la red.");
                return;
            }

            if (navigator.connection) {
                const networkState = navigator.connection.type;
                const online = networkState !== Connection.NONE;
                this.setOnlineStatus(online);
            }
        },
        updateNetworkStatus() {
            if (!this.cordovaListo) {
                console.log("Cordova no está listo para actualizar el estado de la red.");
                return;
            }

            const online = navigator.onLine;
            this.setOnlineStatus(online);
        },
    },
    mounted() {
        this.checkNetworkStatus();
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
                <span v-if="isOnline" style="color: green;">Online</span>
                <span v-else style="color: red;">Offline</span>
            </div>
            <div class="brand">
                <span>&copy; EIE</span>
            </div>
        </div>
    </footer>
</template>



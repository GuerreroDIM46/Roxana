<script>
import { mapState } from 'pinia'
import { useConexionStore } from '@/storage/conexionStore'
import { conexionLibrary } from '@/mixins/conexionLibrary'

export default {
    mixins: [conexionLibrary], 
    computed: {
        ...mapState(useConexionStore, ['conexionLista']), 
    },
}
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
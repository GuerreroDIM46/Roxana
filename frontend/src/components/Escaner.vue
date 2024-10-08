<script>
import { mapState } from 'pinia';  // Importar mapState
import { useCombinedStore } from '@/storage/combinedStore';  // Pinia store
import { roxanaLibrary } from '@/mixins/roxanaLibrary';  // Mixin

export default {
    mixins: [roxanaLibrary],  // Usar el mixin
    computed: {
        ...mapState(useCombinedStore, ['cordovaListo']),  // Usar mapState para obtener cordovaListo desde Pinia
    }
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

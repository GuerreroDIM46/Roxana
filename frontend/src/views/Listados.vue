<script>
import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';

export default {
    data() {
        return {
            cargandoElementos: false,
        };
    },
    computed: {
        ...mapState(useCombinedStore, ['listados', 'elementos', 'alertaSobreescritura', 'conexionLista']),
    },
    methods: {
        ...mapActions(useCombinedStore, ['cargarListados', 'cargarElementos', 'seleccionarListado']),

        // Método para seleccionar un listado y mostrar los elementos
        mostrarElementos(listado) {
            this.seleccionarListado(listado); // Guardar el listado seleccionado en Pinia
            this.$router.push({ name: 'Elementos' }); // Navegar a la página de elementos
        },

        async cargarListadosYElementos() {
            try {
                await this.cargarListados();
                await this.cargarElementos();
            } catch (error) {
                console.error('Error al cargar listados y elementos', error);
            }
        },
    },
    async mounted() {
        await this.cargarListadosYElementos();
    },
};
</script>

<template>
    <div class="container px-4 mt-5">
        <div class="row">
            <!-- Botón 1: Descargar Operaciones -->
            <div class="col-6 col-md-6">
                <button class="custom-btn w-100" @click="cargarListadosYElementos" :disabled="cargandoElementos">
                    <div class="icon-group">
                        <i class="pi pi-sync me-1" style="font-size: 36px;"></i>
                        <i class="pi pi-arrow-down" style="font-size: 36px;"></i>
                    </div>
                    <div v-if="!cargandoElementos">Descargar Ops</div>
                    <div v-else><i class="pi pi-spin pi-spinner"></i> Cargando...</div>
                </button>
            </div>

            <!-- Botón 2: Sincronizar Operaciones -->
            <div class="col-6 col-md-6">
                <button class="custom-btn w-100" :disabled="!conexionLista">
                    <div class="icon-group">
                        <i class="pi pi-sync me-1" style="font-size: 36px;"></i>
                        <i class="pi pi-arrow-up" style="font-size: 36px;"></i>
                    </div>
                    <div>Sincronizar Ops</div>
                </button>
            </div>
        </div>
    </div>

    <!-- Mostrar Listados descargados -->
    <div class="container px-4 mt-5">
        <div class="row mt-4">
            <div class="col-12">
                <h3>Listados Disponibles</h3>
                <!-- Botones de Listados con ícono y nombre en la misma línea -->
                <button v-for="listado in listados" :key="listado.id" class="custom-btn w-100 mt-2"
                    @click="mostrarElementos(listado)">
                    <div>
                        <i class="pi pi-list" style="font-size: 24px; margin-right: 10px;"></i>
                        <span>{{ listado.nombre }}</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionales, si los necesitas */
</style>

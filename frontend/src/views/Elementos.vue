<script>
import { mapState, mapActions } from 'pinia'
import { useCombinedStore } from '@/storage/combinedStore'
import { roxanaLibrary } from '@/mixins/roxanaLibrary'
import { escanerLibrary } from '@/mixins/escanerLibrary'

export default {
    mixins: [roxanaLibrary, escanerLibrary],
    props: {
        operacion: {
            type: String, // Puede ser 'verificacion' o 'generacion'
            required: true,
        },
    },
    computed: {
        ...mapState(useCombinedStore, ['listadoSeleccionado', 'elementos', 'elementosFiltrados'])
    },
    methods: {
        ...mapActions(useCombinedStore, ['guardarEnLocal', 'filtrarPorPropiedad', 'crearNuevoListado']),

        filtrarElementos() {
            const listadoIdSeleccionado = this.listadoSeleccionado?.id
            this.filtrarPorPropiedad('elementos', 'listadoId', listadoIdSeleccionado)
        },

        async activarEscaner() {
            await this.realizarOperacion(this.operacion)
        },

        async guardarCambios() {
            try {
                await this.guardarEnLocal()
                this.volver()
            } catch (error) {
                console.error('Error al guardar los cambios:', error)
                alert('Hubo un error al guardar los cambios.')
            }
        },

        volver() {
            this.$router.push({ name: 'Listados' })
        }
    },

    mounted() {
        if (this.operacion == 'generacion') {
            this.crearNuevoListado()
        }
        this.filtrarElementos()
    }
}
</script>

<template>
    <div class="container-fluid px-4 mt-2">
        <div class="row mt-4 mb-2">
            <div class="col-12">
                <h3 class="text-end">{{ listadoSeleccionado ? listadoSeleccionado.nombre : 'Listado no encontrado' }}
                </h3>
            </div>
        </div>

        <div class="row" style="max-height: 60vh; overflow-y: auto;">
            <div class="col-12">
                <button v-for="elemento in elementosFiltrados" :key="elemento.id"
                    class="custom-btn-secondary w-100 mt-2 d-flex align-items-center">
                    <!-- Contenedor para el ícono y el texto -->
                    <div class="d-flex align-items-center w-100">
                        <!-- Icono y texto alineados -->

                        <!-- Icono -->
                        <i v-if="elemento.flag == 'modificado'" class="pi pi-file-edit text-primary me-2"></i>
                        <i v-else-if="elemento.flag == 'creado'" class="pi pi-file-new text-success me-2"></i>
                        <!-- Texto -->
                        <span class="fw-bold">{{ elemento.nombre }}</span>


                        <!-- Espaciador para empujar el badge a la derecha -->
                        <div class="flex-grow-1"></div>

                        <!-- Badge alineado a la derecha -->
                        <span v-if="elemento.estado == '100'" class="badge bg-warning">Trip</span>
                        <span v-else-if="elemento.estado == '200'" class="badge bg-success">Ack</span>
                        <span v-else-if="elemento.estado == '300'" class="badge bg-info">New</span>
                    </div>
                </button>
            </div>
        </div>


        <!-- Botones de acción siempre visibles encima del footer -->
        <div class="sticky-footer d-flex justify-content-between align-items-center">
            <button class="custom-btn w-90 me-1" @click="activarEscaner">
                <div class="icon-group">
                    <i class="pi pi-search me-1"></i>
                </div>
                <div>Escanear</div>
            </button>

            <button class="custom-btn w-90 me-1" hidden>
                <div class="icon-group">
                    <i class="pi pi-cog me-1"></i>
                </div>
                <div>Operar</div>
            </button>

            <button class="custom-btn w-90" @click="guardarCambios">
                <div class="icon-group">
                    <i class="pi pi-save me-1"></i>
                </div>
                <div>Guardar</div>
            </button>
        </div>
    </div>
</template>
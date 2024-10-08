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
                alert('Cambios guardados con éxito.')
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
<div class="container px-4 mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>{{ listadoSeleccionado ? listadoSeleccionado.nombre : 'Listado no encontrado' }}</h3>
    </div>

    <ul v-if="elementosFiltrados && elementosFiltrados.length > 0" class="list-group list-group-flush">
        <li v-for="elemento in elementosFiltrados" :key="elemento.id" class="list-group-item d-flex justify-content-between align-items-center border-bottom">
            <i v-if="elemento.flag == 'modificado'" class="pi pi-file-edit text-primary"></i>
            <i v-else-if="elemento.flag == 'creado'" class="pi pi-file-new text-success"></i>
            <span class="fw-bold">{{ elemento.nombre }}</span>
            <span v-if="elemento.estado == '100'" class="badge bg-warning">Trip</span>
            <span v-else-if="elemento.estado == '200'" class="badge bg-success">Ack</span>
            <span v-else-if="elemento.estado == '300'" class="badge bg-info">New</span>
        </li>
    </ul>

    <div v-else>
        <p>No se encontraron elementos para este listado o el listado no está seleccionado.</p>
    </div>

    <div class="sticky-footer d-flex justify-content-between">
        <button class="custom-btn h-20" @click="activarEscaner">
            <div>
                <i class="pi pi-search me-1"></i>
                <span>Escanear</span>
            </div>
        </button>
        <button class="custom-btn h-20" @click="guardarCambios">
            <div>
                <i class="pi pi-save me-1"></i>
                <span>Guardar</span>
            </div>
        </button>
    </div>
</div>
</template>

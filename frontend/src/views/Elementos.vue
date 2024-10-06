<script>
import { mapState } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';
import { hateoasMixin } from '@/mixins/hateoasMixin'; // Importar el mixin

export default {
    mixins: [hateoasMixin], // Usar el mixin
    data() {
        return {
            elementosFiltrados: [], // Almacenará los elementos filtrados por listado seleccionado
        };
    },
    computed: {
        ...mapState(useCombinedStore, ['listadoSeleccionado', 'elementos']),
    },
    methods: {
        filtrarElementos() {
            // Filtrar los elementos según el listado seleccionado en Pinia
            if (this.listadoSeleccionado) {
                const listadoIdSeleccionado = this.listadoSeleccionado.id; // Obtener el ID del listado seleccionado
                console.log("ID del listado seleccionado:", listadoIdSeleccionado);

                // Filtrar los elementos utilizando listadoId
                this.elementosFiltrados = this.elementos.filter(elemento => {
                    return elemento.listadoId == listadoIdSeleccionado; // Comparar listadoId
                });

                console.log("Elementos filtrados:", this.elementosFiltrados); // Depuración
            }
        },
        volver() {
            this.$router.go(-1); // Volver a la pantalla anterior
        },
    },
    mounted() {
        this.filtrarElementos(); // Filtrar elementos al montar el componente
    }
};
</script>

<template>
    <div class="container px-4 mt-5">
        <!-- Encabezado con el nombre del listado y botón de volver -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>{{ listadoSeleccionado ? listadoSeleccionado.nombre : 'Listado no encontrado' }}</h3>
            <button class="custom-btn h-20" @click="volver">
                <i class="pi pi-arrow-left"></i> Volver
            </button>
        </div>

        <!-- Mostrar los elementos filtrados si el listado existe -->
        <!-- Mostrar los elementos filtrados si el listado existe -->
        <ul v-if="elementosFiltrados && elementosFiltrados.length > 0" class="list-group list-group-flush">
            <li v-for="elemento in elementosFiltrados" :key="elemento.id" class="list-group-item d-flex justify-content-between align-items-center border-bottom">
                <!-- Nombre del elemento alineado a la izquierda y en negrita -->
                <span class="fw-bold">{{ elemento.nombre }}</span>

                <!-- Icono de thumbs-down si el estado es 100 -->
                <i v-if="elemento.estado === '100'" class="pi pi-thumbs-down-fill text-primary"></i>

                <!-- Badge basado en el estado del elemento -->
                <span v-else-if="elemento.estado === '200'" class="badge bg-success">Recepcionado</span>
            </li>
        </ul>
        <div v-else>
            <p>No se encontraron elementos para este listado o el listado no está seleccionado.</p>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionales si es necesario */
</style>

<script>
import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';
import { roxanaLibrary } from '@/mixins/roxanaLibrary';

export default {
    mixins: [roxanaLibrary],
    computed: {
        ...mapState(useCombinedStore, ['listadoSeleccionado', 'elementos', 'codigoEscaneado', 'cordovaListo']),  // Mapear cordovaListo
    },
    methods: {
        ...mapActions(useCombinedStore, ['guardarEnLocal', 'setCodigoEscaneado']),  // Acción para guardar el código escaneado

        filtrarElementos() {
            if (this.listadoSeleccionado) {
                const listadoIdSeleccionado = this.listadoSeleccionado.id;
                this.elementosFiltrados = this.elementos.filter(elemento => elemento.listadoId === listadoIdSeleccionado);
                console.log("Elementos filtrados:", this.elementosFiltrados);
            }
        },

        async escanearEnBucle() {
            // Verificamos que Cordova esté listo para el escaneo
            if (!this.cordovaListo) {
                alert("Cordova no está disponible todavía.");
                return;
            }

            try {
                // Escanear código de barras y almacenarlo en Pinia
                await this.escanear();  // Llamamos a la función de escaneo del mixin

                console.log("Código escaneado:", this.codigoEscaneado);
                const elementoEncontrado = this.elementosFiltrados.find(
                    elemento => elemento.barcode === this.codigoEscaneado
                );

                if (elementoEncontrado) {
                    elementoEncontrado.estado = '200';  // Actualizar estado a 'recepcionado'
                    elementoEncontrado.flag = 'modificado';  // Marcar como modificado
                    console.log("Elemento actualizado:", elementoEncontrado);
                    this.reproducirSonido('success');  // Sonido de éxito
                } else {
                    this.reproducirSonido('fail');  // Sonido de error
                }

                // Después de cada escaneo, iniciamos un nuevo escaneo en bucle
                this.escanearEnBucle();

            } catch (error) {
                console.error("Error en el escaneo:", error);
            }
        },

        // Guardar los elementos modificados en Dexie
        async guardarCambios() {
            try {
                await this.guardarEnLocal();  // Llamar la acción de Pinia para guardar en local
                alert('Cambios guardados con éxito.');
                this.volver();  // Volver a la página de Listados
            } catch (error) {
                console.error('Error al guardar los cambios:', error);
                alert('Hubo un error al guardar los cambios.');
            }
        },

        volver() {
            this.$router.push({ name: 'Listados' });  // Volver a la página de listados
        }
    },

    mounted() {
        this.filtrarElementos();
    }
};
</script>

<template>
    <div class="container px-4 mt-5">
        <!-- Encabezado con el nombre del listado y botón de volver -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>{{ listadoSeleccionado ? listadoSeleccionado.nombre : 'Listado no encontrado' }}</h3>
        </div>

        <!-- Mostrar los elementos filtrados si el listado existe -->
        <ul v-if="elementosFiltrados && elementosFiltrados.length > 0" class="list-group list-group-flush">
            <li v-for="elemento in elementosFiltrados" :key="elemento.id"
                class="list-group-item d-flex justify-content-between align-items-center border-bottom">
                <i v-if="elemento.flag === 'modificado'" class="pi pi-pen-to-square text-primary"></i>
                <i v-else-if="elemento.flag === 'creado'" class="pi pi-pen-to-square text-success"></i>
                <span class="fw-bold">{{ elemento.nombre }}</span>
                <span v-if="elemento.estado === '100'" class="badge bg-warning">Trip</span>
                <span v-else-if="elemento.estado === '200'" class="badge bg-success">Ack</span>
                <span v-else-if="elemento.estado === '300'" class="badge bg-info">New</span>
            </li>
        </ul>

        <div v-else>
            <p>No se encontraron elementos para este listado o el listado no está seleccionado.</p>
        </div>

        <!-- Botones Escanear y Guardar -->
        <div class="sticky-footer d-flex justify-content-between">
            <button class="custom-btn h-20" @click="escanearEnBucle">
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

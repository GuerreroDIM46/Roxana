<script>
import {
    mapState,
    mapActions
} from 'pinia';
import {
    useCombinedStore
} from '@/storage/combinedStore';
import {
    roxanaLibrary
} from '@/mixins/roxanaLibrary';

export default {
    mixins: [roxanaLibrary],
    data() {
        return {
            elementosFiltrados: [], // Almacenar los elementos filtrados por listado seleccionado
        };
    },
    computed: {
        ...mapState(useCombinedStore, ['listadoSeleccionado', 'elementos', 'codigoEscaneado', 'cordovaListo', 'elementoEncontrado']), // Mapear cordovaListo
    },
    methods: {
        ...mapActions(useCombinedStore, ['guardarEnLocal', 'setElementoEncontrado']), // Acción para guardar el código escaneado

        filtrarElementos() {
            if (this.listadoSeleccionado) {
                const listadoIdSeleccionado = this.listadoSeleccionado.id;
                this.elementosFiltrados = this.elementos.filter(elemento => elemento.listadoId === listadoIdSeleccionado);
                console.log("Elementos filtrados:", this.elementosFiltrados);
            }
        },

        async activarEscaner() {
            if (!this.cordovaListo) {
                alert("Cordova no está disponible todavía.");
                return;
            }

            try {
                await this.escanear(); // Esperar hasta que el escaneo finalice

                this.comparar(); // Comparamos el código escaneado

                if (this.elementoEncontrado) {
                    this.modificarPropiedades("verificacion"); // Modificamos las propiedades del elemento encontrado
                    this.actualizarElementoEnPinia(); // Actualizamos el elemento en el store
                    this.filtrarElementos();
                }

            } catch (error) {
                console.error("Error en el escaneo:", error);
            }
        },


        comparar() {
            try {
                console.log("Código escaneado:", this.codigoEscaneado);

                const elemento = this.elementosFiltrados.find(
                    elemento => elemento.barcode === this.codigoEscaneado
                );

                // Guardamos el elemento encontrado en el store
                this.setElementoEncontrado(elemento);

            } catch (error) {
                console.error("Error en la comparación:", error);
            }
        },

        modificarPropiedades(operacion) {
            if (this.elementoEncontrado) {
                if (operacion === "verificacion") {
                    this.elementoEncontrado.estado = '200'; // Actualizar estado a 'recepcionado'
                    this.elementoEncontrado.flag = 'modificado'; // Marcar como modificado
                    console.log("Elemento actualizado:", this.elementoEncontrado);
                    // this.reproducirSonido('success'); // Sonido de éxito
                } else {
                    this.reproducirSonido('fail'); // Sonido de error
                    console.log("Elemento no actualizado");
                }
            } else {
                this.reproducirSonido('fail'); // Sonido de error si no se encuentra el elemento
            }
        },

        actualizarElementoEnPinia() {
            // Validar si elementoEncontrado está definido antes de usarlo
            if (!this.elementoEncontrado || !this.elementoEncontrado.id) {
                console.error(" Error: elementoEncontrado no está definido o no tiene un ID válido.");
                return;
            }

            // Depuración para verificar el ID del elemento encontrado
            console.log("Actualizando el siguiente elemento:", this.elementoEncontrado);

            // Buscar el índice del elemento en el array de elementos
            const index = this.elementos.findIndex(elemento => elemento.id === this.elementoEncontrado.id);

            if (index !== -1) {
                // Si el elemento existe en el array, reemplazarlo con el actualizado
                this.elementos.splice(index, 1, this.elementoEncontrado);
                console.log(`Elemento con ID ${this.elementoEncontrado.id} se ha reemplazado en el array.`);
            } else {
                console.error("No se inserto elemento en el array");
            }

            // Limpiar elementoEncontrado después de actualizar el store
            this.setElementoEncontrado(null); // Usar la acción para resetear el valor en el store
            console.log("elementoEncontrado limpiado correctamente.");
        },

        // Guardar los elementos modificados en Dexie
        async guardarCambios() {
            try {
                await this.guardarEnLocal(); // Llamar la acción de Pinia para guardar en local
                alert('Cambios guardados con éxito.');
                this.volver(); // Volver a la página de Listados
            } catch (error) {
                console.error('Error al guardar los cambios:', error);
                alert('Hubo un error al guardar los cambios.');
            }
        },

        volver() {
            this.$router.push({
                name: 'Listados'
            }); // Volver a la página de listados
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
        <li v-for="elemento in elementosFiltrados" :key="elemento.id" class="list-group-item d-flex justify-content-between align-items-center border-bottom">
            <i v-if="elemento.flag === 'modificado'" class="pi pi-file-edit text-primary"></i>
            <i v-else-if="elemento.flag === 'creado'" class="pi pi-file-new text-success"></i>
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

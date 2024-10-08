<script>
import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';
import { roxanaLibrary } from '@/mixins/roxanaLibrary';
import Escaner from '@/components/Escaner.vue'; // Importar el componente de escaneo

export default {
    mixins: [roxanaLibrary],
    components: {
        Escaner, // Usar el componente de escaneo
    },
    data() {
        return {
            elementosFiltrados: [], // Almacenar los elementos filtrados por listado seleccionado
            codigoEscaneado: null,  // Almacenar el código escaneado
        };
    },
    computed: {
        ...mapState(useCombinedStore, ['listadoSeleccionado', 'elementos']),
    },
    methods: {
        ...mapActions(useCombinedStore, ['guardarEnLocal']),
        filtrarElementos() {
            if (this.listadoSeleccionado) {
                const listadoIdSeleccionado = this.listadoSeleccionado.id;
                console.log("ID del listado seleccionado:", listadoIdSeleccionado);

                this.elementosFiltrados = this.elementos.filter(elemento => {
                    return elemento.listadoId == listadoIdSeleccionado;
                });

                console.log("Elementos filtrados:", this.elementosFiltrados);
            }
        },
        volver() {
            this.$router.push({ name: 'Listados' })
        },
        // Lógica de escaneo
        siEscaneado(codigo) {
            this.codigoEscaneado = codigo; // Guardar el código escaneado
            console.log("Código escaneado:", this.codigoEscaneado)
            const elementoEncontrado = this.elementosFiltrados.find(elemento => elemento.barcode == this.codigoEscaneado);

            if (elementoEncontrado) {
                elementoEncontrado.estado = '200'; // Actualizar estado a recepcionado
                elementoEncontrado.flag = 'modificado'; // Marcar como modificado
                console.log("Elemento actualizado:", elementoEncontrado);
                this.reproducirSonido('success');
            } else {
                this.reproducirSonido('fail');
            }
        },
        // Guardar los elementos modificados en Dexie
        async guardarCambios() {
            try {
                await this.guardarEnLocal(); // Llamar la acción de Pinia para guardar en local

                // Mostrar alerta de éxito
                alert('Cambios guardados con éxito.');

                // Volver a la página de Listados
                this.volver();
            } catch (error) {
                console.error('Error al guardar los cambios:', error);
                alert('Hubo un error al guardar los cambios.');
            }
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
                <i v-if="elemento.flag === 'modificado'" class="pi pi-pen-to-square text-primary"></i>
                <i v-else-if="elemento.flag === 'creado'" class="pi pi-pen-to-square text-success"></i>
                <span class="fw-bold">{{ elemento.nombre }}</span>
                <span v-if="elemento.estado === '100'" class="badge bg-warning">Trip</span>
                <span v-else-if="elemento.estado === '200'" class="badge bg-success">Ack</span>                
            </li>
        </ul>

        <div v-else>
            <p>No se encontraron elementos para este listado o el listado no está seleccionado.</p>
        </div>

        <!-- Botones Escanear y Guardar -->
        <div class="sticky-footer d-flex justify-content-between">
            <Escaner @codigoEscaneado="siEscaneado" />
            <button class="custom-btn h-20" @click="guardarCambios">
                <div>
                <i class="pi pi-save me-1"></i>
                <span>Guardar</span>
                </div>
            </button>
        </div>
    </div>
</template>




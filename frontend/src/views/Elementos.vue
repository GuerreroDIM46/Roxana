<script>
import { mapState } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';
import { hateoasMixin } from '@/mixins/hateoasMixin';
import Escaner from '@/components/Escaner.vue'; // Importar el componente de escaneo

export default {
    components: {
        Escaner, // Usar el componente de escaneo
    },
    mixins: [hateoasMixin],
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
            const elementoEncontrado = this.elementosFiltrados.find(elemento => elemento.barcode === codigo);

            if (elementoEncontrado) {
                elementoEncontrado.estado = '200'; // Actualizar estado a recepcionado
                elementoEncontrado.flag = 'modificado'; // Marcar como modificado
                console.log("Elemento actualizado:", elementoEncontrado);
            } else {
                alert("No se encontró ningún elemento con ese código de barras.");
            }
        },
        // Guardar los elementos modificados en Dexie
        async guardarCambios() {
            try {
                const db = await import('@/storage/dexieDBConfig'); // Importar Dexie dinámicamente
                const elementosModificados = this.elementosFiltrados.filter(elemento => elemento.flag === 'modificado');
                for (const elemento of elementosModificados) {
                    await db.elementos.put(elemento); // Guardar en Dexie
                }
                alert('Cambios guardados correctamente.');
            } catch (error) {
                console.error('Error al guardar los cambios en Dexie:', error);
            }
        },
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
            <button class="custom-btn h-20" @click="volver">
                <div>
                    <i class="pi pi-arrow-left"></i>
                    <span>Volver</span> 
                </div>
            </button>
        </div>

        <!-- Mostrar los elementos filtrados si el listado existe -->
        <ul v-if="elementosFiltrados && elementosFiltrados.length > 0" class="list-group list-group-flush">
            <li v-for="elemento in elementosFiltrados" :key="elemento.id" class="list-group-item d-flex justify-content-between align-items-center border-bottom">
                <span class="fw-bold">{{ elemento.nombre }}</span>
                <i v-if="elemento.estado === '100'" class="pi pi-thumbs-down-fill text-primary"></i>
                <span v-else-if="elemento.estado === '200'" class="badge bg-success">Recepcionado</span>
            </li>
        </ul>

        <div v-else>
            <p>No se encontraron elementos para este listado o el listado no está seleccionado.</p>
        </div>

        <!-- Botones Escanear y Guardar -->
        <div class="sticky-footer d-flex justify-content-between">
            <button class="custom-btn h-20" @click="escanearCodigo">
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


<style scoped>
.sticky-footer {
    position: fixed;
    bottom: 60px; /* Altura del footer Estado de Conexión */
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 10px;
    z-index: 100;
    border-top: 1px solid #ccc;
}

.sticky-footer button {
    flex-grow: 1;
}
</style>

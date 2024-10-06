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
            this.$router.go(-1);
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
                <i class="pi pi-arrow-left"></i> Volver
            </button>
        </div>

        <!-- Mostrar los elementos filtrados -->
        <ul v-if="elementosFiltrados && elementosFiltrados.length > 0" class="list-group list-group-flush">
            <li v-for="elemento in elementosFiltrados" :key="elemento.id" class="list-group-item d-flex justify-content-between align-items-center border-bottom">
                <!-- Nombre del elemento en negrita -->
                <span class="fw-bold">{{ elemento.nombre }}</span>

                <!-- Icono de verificación si el estado es 200 -->
                <i v-if="elemento.estado === '200'" class="pi pi-check-circle text-success"></i>

                <!-- Icono de thumbs-down si el estado es 100 -->
                <i v-else class="pi pi-thumbs-down-fill text-primary"></i>
            </li>
        </ul>
        <div v-else>
            <p>No se encontraron elementos para este listado o el listado no está seleccionado.</p>
        </div>

        <!-- Botones de guardar y escanear en la parte inferior -->
        <div class="d-flex justify-content-between mt-4">
            <!-- Botón de escanear -->
            <div>
                <Escaner @codigoEscaneado="siEscaneado" />
            </div>

            <!-- Botón de guardar -->
            <button class="custom-btn btn-success" @click="guardarCambios">
                Guardar Cambios
            </button>
        </div>
    </div>
</template>

<style scoped>
.list-group-item {
    border-bottom: 1px solid #ddd;
}

.custom-btn {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>

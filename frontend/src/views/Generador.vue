<script>
import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';
import { roxanaLibrary } from '@/mixins/roxanaLibrary';

export default {
    mixins: [roxanaLibrary],
    data() {
        return {
            nuevoListado: null, // El listado generado
            elementosFiltrados: [], // Almacenar los elementos del listado generado
        };
    },
    computed: {
        ...mapState(useCombinedStore, ['listados', 'elementos', 'codigoEscaneado', 'cordovaListo']),  // Obtener datos de Pinia
    },
    methods: {
        ...mapActions(useCombinedStore, ['guardarEnLocal', 'setCodigoEscaneado']), // Acciones de Pinia

        // Método para crear un nuevo listado
        crearNuevoListado() {
            const ultimoIdListado = this.listados.length ? this.listados[this.listados.length - 1].id : 0;
            const nuevoId = ultimoIdListado + 1;
            const nuevoListado = {
                id: nuevoId,
                nombre: `Nuevo Listado Número ${nuevoId}`,
                tipo: 'generado',
                flag: 'creado',
            };

            this.nuevoListado = nuevoListado;
            this.listados.push(nuevoListado); // Añadir el nuevo listado al store
            console.log('Nuevo listado generado:', nuevoListado);
        },

        filtrarElementos() {
            if (this.nuevoListado) {
                const nuevoListadoId = this.nuevoListado.id;

                this.elementosFiltrados = this.elementos.filter(elemento => {
                    return elemento.listadoId == nuevoListadoId;
                });

                console.log("Elementos filtrados:", this.elementosFiltrados);
            }
        },

        // Método para escanear en bucle
        async escanearEnBucle() {
            if (!this.cordovaListo) {
                alert("Cordova no está disponible todavía.");
                return;
            }

            try {
                // Escanear y almacenar el código escaneado en Pinia
                await this.escanear();  // Llamada a la función de escaneo del mixin `roxanaLibrary`

                console.log("Código escaneado:", this.codigoEscaneado);

                // Buscar si ya existe un elemento con este código de barras en el array de elementos
                const elementoExistente = this.elementos.find(elemento => elemento.barcode === this.codigoEscaneado);
                const ultimoIdElemento = this.elementos.length ? this.elementos[this.elementos.length - 1].id : 0;
                const nuevoIdElemento = ultimoIdElemento + 1;

                // Crear el nuevo elemento
                const nuevoElemento = {
                    id: nuevoIdElemento,
                    nombre: elementoExistente ? elementoExistente.nombre : `Nuevo Elemento ${nuevoIdElemento}`,
                    barcode: this.codigoEscaneado,
                    estado: "300",
                    listado: `https://roxanaapitest.manabo.org/api/listados/${this.nuevoListado.id}`,  // Guardar como string por ahora
                    listadoId: this.nuevoListado.id,  // Añadir la propiedad listadoId con el id del nuevo listado
                    flag: 'creado',
                };

                // Añadir el nuevo elemento al array de elementos global y local
                this.elementos.push(nuevoElemento); // Añadir al store
                this.elementosFiltrados.push(nuevoElemento); // Añadir a la lista local para mostrar en la UI
                console.log('Elemento añadido:', nuevoElemento);

                // Refrescar los elementos filtrados
                this.filtrarElementos();

                // Continuar escaneando automáticamente
                // Llamar a sí mismo para continuar con el escaneo en bucle
            } catch (error) {
                console.error("Error en el escaneo:", error);
            }
        },

        // Método para guardar los cambios (listado y elementos) en DexieDB
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
            this.$router.push({ name: 'Listados' }); // Volver a la página de listados
        },
    },
    mounted() {
        this.crearNuevoListado(); // Crear un nuevo listado al montar el componente
    },
};
</script>

<template>
    <div class="container px-4 mt-5">
        <!-- Encabezado con el nombre del listado -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>{{ nuevoListado ? nuevoListado.nombre : 'Listado no encontrado' }}</h3>
        </div>

        <!-- Mostrar los elementos escaneados en el listado -->
        <ul v-if="elementosFiltrados.length > 0" class="list-group list-group-flush">
            <li v-for="elemento in elementosFiltrados" :key="elemento.id"
                class="list-group-item d-flex justify-content-between align-items-center border-bottom">
                <i v-if="elemento.flag === 'modificado'" class="pi pi-file-edit text-primary"></i>
                <i v-else-if="elemento.flag === 'creado'" class="pi pi-file-new text-success"></i>
                <span class="fw-bold">{{ elemento.nombre }}</span>
                <span v-if="elemento.estado === '100'" class="badge bg-warning">Trip</span>
                <span v-else-if="elemento.estado === '200'" class="badge bg-success">Ack</span>
                <span v-else-if="elemento.estado === '300'" class="badge bg-info">New</span>  
            </li>
        </ul>

        <div v-else>
            <p>Lista vacía. Escanea un código para añadir un elemento.</p>
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

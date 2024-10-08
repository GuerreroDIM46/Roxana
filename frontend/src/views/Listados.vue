<script>
import { mapState, mapActions } from 'pinia';
import { useCombinedStore } from '@/storage/combinedStore';

export default {
    data() {
        return {
            cargandoElementos: false,
            sincronizando: false,
        };
    },
    computed: {
        ...mapState(useCombinedStore, ['listados', 'elementos', 'alertaSobreescritura', 'conexionLista']),
    },
    methods: {
        ...mapActions(useCombinedStore, [
            'cargarListados',
            'cargarElementos',
            'seleccionarListado',
            'sincronizarOperaciones',
            'borrarBaseDeDatosLocal',
            'cargarDatosDesdeDexie'
        ]),

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
        generar() {
            this.$router.push({ name: 'Generador' })
        },
        async sincronizar() {
            this.sincronizando = true;
            try {
                console.log("Sincronizando operaciones...");
                await this.sincronizarOperaciones(); // Llamar a la acción de Pinia
                alert('Sincronización completada con éxito.');
            } catch (error) {
                console.error('Error al sincronizar las operaciones:', error);
                alert('Hubo un error al sincronizar las operaciones.');
            } finally {
                this.sincronizando = false;
            }
        },
        borrarBaseDeDatos() {
            const confirmacion = confirm("¿Estás seguro de que deseas borrar todos los datos locales? Esta acción no se puede deshacer.");

            if (confirmacion) {
                // Si el usuario confirma, borra la base de datos
                this.borrarBaseDeDatosLocal();
                alert("Base de datos local borrada con éxito.");
            } else {
                // Si el usuario cancela, no se hace nada
                console.log("Acción de borrado cancelada.");
            }
        }
    },
    mounted() {
        // Verificar si listados y elementos en Pinia están vacíos
        if (this.listados.length === 0 || this.elementos.length === 0) {
            console.log("Listados o Elementos vacíos en Pinia, comprobando DexieDB...");

            this.cargarDatosDesdeDexie(); // Llamamos la función para cargar desde Dexie
        } else {
            console.log("Listados y Elementos ya están cargados en Pinia.");
        }
    }
};
</script>

<template>
    <div class="container px-4 mt-5">
        <div class="row">
            <!-- Botón 1: Descargar Operaciones -->
            <div class="col-6 col-md-6">
                <button class="custom-btn w-100" @click="cargarListadosYElementos" :disabled="!conexionLista"
                    :class="{ 'disabled-class': !conexionLista }">
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
                <button class="custom-btn w-100" @click="sincronizar" :disabled="!conexionLista || sincronizando"
                    :class="{ 'disabled-class': !conexionLista || sincronizando }">
                    <div class="icon-group">
                        <i class="pi pi-sync me-1" style="font-size: 36px;"></i>
                        <i class="pi pi-arrow-up" style="font-size: 36px;"></i>
                    </div>
                    <div v-if="!sincronizando">Sincronizar Ops</div>
                    <div v-else><i class="pi pi-spin pi-spinner"></i> Sincronizando...</div>
                </button>
            </div>

            <!-- Botón 3: Descartar Operaciones -->
            <div class="col-6 col-md-6 mt-4">
                <button class="custom-btn w-100" @click="borrarBaseDeDatos">
                    <div class="icon-group">
                        <i class="pi pi-trash me-1" style="font-size: 36px;"></i>
                    </div>
                    <div>Descartar Ops</div>
                </button>
            </div>


            <!-- Botón 4: Generacion de listados -->
            <div class="col-6 col-md-6 mt-4">
                <button class="custom-btn w-100" @click="generar">
                    <div class="icon-group">
                        <i class="pi pi-file-plus me-1" style="font-size: 36px;"></i>
                    </div>
                    <div>Generar</div>
                </button>
            </div>


        </div>
    </div>

    <!-- Mostrar Listados descargados -->
    <div class="container px-4 mt-1">
        <div class="row mt-4">
            <div class="col-12">
                <h3>Listados Disponibles</h3>
                <!-- Botones de Listados con ícono y nombre en la misma línea -->
                <button v-for="listado in listados" :key="listado.id" class="custom-btn w-100 mt-2"
                    @click="mostrarElementos(listado)">
                    <div>
                        <i class="pi pi-list" style="font-size: 24px; margin-right: 10px;"></i>
                        <span>{{ listado.nombre }}</span>
                        <i v-if="listado.flag == 'creado'" class="pi pi-pen-to-square text-success"
                            style="font-size: 24px; margin-left: 10px;"></i>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.disabled-class {
    pointer-events: none;
    /* Deshabilita interacciones */
    opacity: 0.5;
    /* Visualmente deshabilitado */
}
</style>

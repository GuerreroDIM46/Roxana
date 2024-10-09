<script>
import { mapState, mapActions } from 'pinia'
import { useConexionStore } from '@/storage/conexionStore'
import { useCombinedStore } from '@/storage/combinedStore'
import { useSincronizacionStore } from '@/storage/sincronizacionStore'

export default {
    computed: {
        ...mapState(useConexionStore, ['conexionLista']),
        ...mapState(useCombinedStore, ['listados', 'elementos', 'cargando']),
        ...mapState(useSincronizacionStore, ['sincronizando']),
    },
    methods: {
        ...mapActions(useCombinedStore, ['cargarListados', 'cargarElementos', 'seleccionarListado']),
        ...mapActions(useSincronizacionStore, ['sincronizarOperaciones', 'borrarBaseDeDatosLocal', 'cargarDatosDesdeDexie']),

        mostrarElementos(listado) {
            this.seleccionarListado(listado)
            this.$router.push({ name: 'Elementos' })
        },

        async cargarListadosYElementos() {
            try {
                await this.cargarListados()
                console.log("Listados cargados en la pagina: ", this.listados)
                await this.cargarElementos()
                console.log("Elementos cargados: ", this.elementos)
            } catch (error) {
                console.error('Error al cargar listados y elementos', error)
            }
        },

        generar() {
            this.$router.push({ name: 'Generador' })
        },

        tieneElementosModificados(listado) {
            const elementosFiltrados = this.elementos.filter(elemento => elemento.listadoId === listado.id);
            return elementosFiltrados.some(elemento => elemento.flag === 'modificado');
        },

        async sincronizar() {
            try {
                await this.sincronizarOperaciones()
                alert('Sincronización completada con éxito.')
            } catch (error) {
                console.error('Error al sincronizar las operaciones:', error)
                alert('Hubo un error al sincronizar las operaciones.')
            }
        },

        borrarBaseDeDatos() {
            const confirmacion = confirm("¿Estás seguro de que deseas borrar todos los datos locales? Esta acción no se puede deshacer.")
            if (confirmacion) {
                this.borrarBaseDeDatosLocal()
                alert("Base de datos local borrada con éxito.")
            }
        }
    },

    mounted() {
        if ((this.listados && this.listados.length === 0) || (this.elementos && this.elementos.length === 0)) {
            console.log("Habia datos en el store, los voy a cargar")
            this.cargarDatosDesdeDexie()
        }
    }
}
</script>

<template>
    <div class="container-fluid px-4 mt-2">
        <!-- Botón Generar como parte de los listados -->
        <div class="row mt-4 mb-2">
            <div class="col-12">
                <h3>Listados Disponibles</h3>

                <!-- Botón de generar listado -->
                <button class="custom-btn w-100 mt-3" @click="generar">
                    <div class="d-flex align-items-center justify-content-between">
                        <i class="pi pi-file-plus me-2"></i>
                        <span class="me-2">Generar Listado</span>
                        <i></i> <!-- Espacio vacío para mantener la misma estructura -->
                    </div>
                </button>
            </div>
        </div>

        <!-- Listados disponibles con barra de scroll si hay muchos elementos -->
        <div class="row mt-2" style="max-height: 60vh; overflow-y: auto;">
            <div class="col-12">
                <button v-for="listado in listados" :key="listado.id" class="custom-btn w-100 mt-2"
                    @click="mostrarElementos(listado)">
                    <div class="d-flex align-items-center justify-content-between">
                        <i v-if="tieneElementosModificados(listado) || (listado.flag == 'creado')"
                            class="pi pi-file-edit"></i>
                        <i v-if="!listado.flag && !tieneElementosModificados(listado)" class="pi pi-file"></i>                        
                        <span class="me-2">{{ listado.nombre }}</span>

                    </div>
                </button>
            </div>
        </div>
    </div>


    <!-- Botones de acción siempre visibles encima del footer -->
    <div class="sticky-footer d-flex justify-content-between align-items-center">
        <button class="custom-btn w-90 me-1" @click="cargarListadosYElementos" :disabled="!conexionLista"
            :class="{ 'disabled-class': !conexionLista }">
            <div class="icon-group">
                <i class="pi pi-file-import me-1"></i>
            </div>
            <div>Descargar <br> Operaciones</div>
        </button>

        <button class="custom-btn w-90 me-1" @click="sincronizar" :disabled="!conexionLista || sincronizando"
            :class="{ 'disabled-class': !conexionLista || sincronizando }">
            <div class="icon-group">
                <i class="pi pi-file-export me-1"></i>
            </div>
            <div>Sincronizar <br> Operaciones</div>
        </button>

        <button class="custom-btn w-90" @click="borrarBaseDeDatos">
            <div class="icon-group">
                <i class="pi pi-trash me-1"></i>
            </div>
            <div>Descartar <br> Operaciones</div>
        </button>
    </div>
</template>
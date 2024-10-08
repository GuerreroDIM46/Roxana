<script>
import { mapState, mapActions } from 'pinia'
import { useConexionStore } from '@/storage/conexionStore'
import { useCombinedStore } from '@/storage/combinedStore'
import { useSincronizacionStore } from '@/storage/sincronizacionStore'

export default {
    data() {
        return {
            cargandoElementos: false,
        }
    },
    computed: {
        ...mapState(useConexionStore, ['conexionLista']),
        ...mapState(useCombinedStore, ['listados', 'elementos']),
        ...mapState(useSincronizacionStore, ['listados', 'elementos', 'sincronizando']),
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
                await this.cargarElementos()
            } catch (error) {
                console.error('Error al cargar listados y elementos', error)
            }
        },

        generar() {
            this.$router.push({ name: 'Generador' })
        },

        async sincronizar() {
            this.sincronizando = true
            try {
                await this.sincronizarOperaciones()
                alert('Sincronización completada con éxito.')
            } catch (error) {
                console.error('Error al sincronizar las operaciones:', error)
                alert('Hubo un error al sincronizar las operaciones.')
            } finally {
                this.sincronizando = false
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
        if (this.listados.length === 0 || this.elementos.length === 0) {
            this.cargarDatosDesdeDexie()
        }
    }
}
</script>

<template>
    <div class="container px-4 mt-5">
        <div class="row">
            <div class="col-6 col-md-6">
                <button class="custom-btn w-100" @click="cargarListadosYElementos" :disabled="!conexionLista"
                    :class="{ 'disabled-class': !conexionLista }">
                    <div class="icon-group">
                        <i class="pi pi-sync me-1"></i>
                        <i class="pi pi-arrow-down"></i>
                    </div>
                    <div v-if="!cargandoElementos">Descargar Ops</div>
                    <div v-else><i class="pi pi-spin pi-spinner"></i> Cargando...</div>
                </button>
            </div>

            <div class="col-6 col-md-6">
                <button class="custom-btn w-100" @click="sincronizar" :disabled="!conexionLista || sincronizando"
                    :class="{ 'disabled-class': !conexionLista || sincronizando }">
                    <div class="icon-group">
                        <i class="pi pi-sync me-1"></i>
                        <i class="pi pi-arrow-up"></i>
                    </div>
                    <div v-if="!sincronizando">Sincronizar Ops</div>
                    <div v-else><i class="pi pi-spin pi-spinner"></i> Sincronizando...</div>
                </button>
            </div>

            <div class="col-6 col-md-6 mt-4">
                <button class="custom-btn w-100" @click="borrarBaseDeDatos">
                    <div class="icon-group">
                        <i class="pi pi-trash me-1"></i>
                    </div>
                    <div>Descartar Ops</div>
                </button>
            </div>

            <div class="col-6 col-md-6 mt-4">
                <button class="custom-btn w-100" @click="generar">
                    <div class="icon-group">
                        <i class="pi pi-file-plus me-1"></i>
                    </div>
                    <div>Generar</div>
                </button>
            </div>
        </div>
    </div>

    <div class="container px-4 mt-1">
        <div class="row mt-4">
            <div class="col-12">
                <h3>Listados Disponibles</h3>
                <button v-for="listado in listados" :key="listado.id" class="custom-btn w-100 mt-2"
                    @click="mostrarElementos(listado)">
                    <div>
                        <i class="pi pi-list"></i>
                        <span>{{ listado.nombre }}</span>
                        <i v-if="listado.flag === 'modificado'" class="pi pi-file-edit text-primary"></i>
                        <i v-else-if="listado.flag === 'creado'" class="pi pi-file-new text-success"></i>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>



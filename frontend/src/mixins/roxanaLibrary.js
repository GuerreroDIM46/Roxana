import { mapState, mapActions } from 'pinia'
import { useCombinedStore } from '@/storage/combinedStore'
import { useEscanerStore } from '@/storage/escanerStore'
// import { soundLibrary } from '@/libs/soundLibrary'  // Comentado para evitar conflictos con el sonido

export const roxanaLibrary = {
    computed: {
        ...mapState(useEscanerStore, ['codigoEscaneado']),
        ...mapState(useCombinedStore, ['elementosFiltrados', 'elementoEncontrado', 'elementos', 'listadoSeleccionado'])
    },
    methods: {
        ...mapActions(useCombinedStore, ['setElementoEncontrado']),

        async realizarOperacion(tipo) {
            try {
                await this.escanear()
                this.comparar(tipo)

                if (this.elementoEncontrado) {
                    this.modificarPropiedades('actualizar')
                } else {
                    this.modificarPropiedades('generar')
                }

                this.actualizarElementoEnPinia(tipo)
                this.filtrarElementos()
            } catch (error) {
                console.error(`Error en la operación de tipo ${tipo}:`, error)
            }
        },

        comparar(tipo) {
            const elemento = (tipo == 'verificacion')
                ? this.elementosFiltrados.find(el => el.barcode == this.codigoEscaneado)
                : this.elementos.find(el => el.barcode == this.codigoEscaneado)

            this.setElementoEncontrado(elemento)

            if (!elemento) {
                console.warn("Elemento no encontrado.")
                // soundLibrary.reproducirSonido('fail')
                console.log("Sonido fail: Elemento no encontrado.")
            }
        },

        modificarPropiedades(operacion) {
            if (this.elementoEncontrado && operacion == "actualizar") {
                this.elementoEncontrado.estado = '200'
                this.elementoEncontrado.flag = 'modificado'
                // soundLibrary.reproducirSonido('success')
                console.log("Sonido success: Elemento actualizado.")
            } else if (operacion == "generar") {
                const nuevoId = this.elementos.length ? this.elementos[this.elementos.length - 1].id + 1 : 1
                this.elementoEncontrado = {
                    id: nuevoId,
                    nombre: `Nuevo Elemento ${nuevoId}`,
                    barcode: this.codigoEscaneado,
                    estado: '300',
                    flag: 'creado',
                    listadoId: this.listadoSeleccionado.id
                }
                // soundLibrary.reproducirSonido('success')
                console.log("Sonido success: Nuevo elemento generado.")
            } else {
                // soundLibrary.reproducirSonido('fail')
                console.log("Sonido fail: Operación fallida.")
            }
        },

        actualizarElementoEnPinia(tipo) {
            const index = this.elementos.findIndex(el => el.id == this.elementoEncontrado.id)

            if (tipo == 'verificacion' && index !== -1) {
                this.elementos.splice(index, 1, this.elementoEncontrado)
            } else if (tipo == 'generacion') {
                this.elementos.push(this.elementoEncontrado)
            }

            this.setElementoEncontrado(null)
        },
    },
}

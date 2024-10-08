import { defineStore } from 'pinia'
import { db } from '@/storage/dexieDBConfig'
import { getListados, getElementos } from '@/storage/LlamadasAPI'

export const useCombinedStore = defineStore('CombinedStore', {
    state: () => ({
        listados: [],
        elementos: [],
        elementosFiltrados: [],
        alertaSobreescritura: null,
        listadoSeleccionado: null,
        elementoEncontrado: null
    }),
    
    actions: {
        setElementoEncontrado(elemento) {
            this.elementoEncontrado = elemento
        },

        seleccionarListado(listado) {
            this.listadoSeleccionado = listado
        },

        async cargarListados() {
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) return console.warn('Operación interrumpida por alerta de sobreescritura.')

            try {
                const { data } = await getListados()
                const listados = data._embedded.listados.map(listado => ({
                    ...listado,
                    flag: null  // Indicar que no ha sido modificado localmente
                }))
                await db.listados.bulkPut(listados)
                this.listados = listados
            } catch (error) {
                console.error('Error al cargar los listados desde la API:', error)
                this.listados = await db.listados.toArray()
            }
        },

        async cargarElementos() {
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) return console.warn('Operación interrumpida por alerta de sobreescritura.')

            try {
                const { data } = await getElementos()
                const elementos = data._embedded.elementos.map(elemento => ({
                    ...elemento,
                    flag: null
                }))
                await db.elementos.bulkPut(elementos)
                this.elementos = elementos
            } catch (error) {
                console.error('Error al cargar los elementos desde la API:', error)
                this.elementos = await db.elementos.where('listadoId').equals(this.listadoSeleccionado?.id).toArray()
            }
        },

        async verificarElementosModificados() {
            try {
                if (this.alertaSobreescritura == 'ignorar') return true

                const [elementosModificados, listadosModificados] = await Promise.all([
                    db.elementos.where('flag').anyOf('creado', 'modificado').count(),
                    db.listados.where('flag').anyOf('creado', 'modificado').count()
                ])

                if (elementosModificados + listadosModificados > 0) {
                    this.alertaSobreescritura = 'notificar'
                    return false
                }
                
                this.alertaSobreescritura = null
                return true
            } catch (error) {
                console.error('Error al verificar elementos y listados modificados en Dexie:', error)
                return false
            }
        },

        filtrarPorPropiedad(elementos, campoFiltrado, valorFiltrado) {
            if (!valorFiltrado) {
                console.warn('El valorFiltrado es inválido:', valorFiltrado)
                return
            }
            this.elementosFiltrados = this[elementos].filter(item => item[campoFiltrado] == valorFiltrado)
        },

        crearNuevoListado() {
            const ultimoIdListado = this.listados.length ? this.listados[this.listados.length - 1].id : 0
            const nuevoId = ultimoIdListado + 1
            const nuevoListado = {
                id: nuevoId,
                nombre: `Nuevo Listado Número ${nuevoId}`,
                tipo: 'generado',
                flag: 'creado'
            }

            this.listadoSeleccionado = nuevoListado
            this.listados.push(nuevoListado)
        },

        async guardarEnLocal() {
            try {
                const elementosModificadosOCreados = this.obtenerElementosModificadosOCreados()
                const listadosCreados = this.obtenerListadosCreados()

                await Promise.all([
                    elementosModificadosOCreados.length && this.guardarElementosEnDexie(elementosModificadosOCreados),
                    listadosCreados.length && this.guardarListadosEnDexie(listadosCreados)
                ])
            } catch (error) {
                console.error('Error al guardar los elementos y listados en Dexie:', error)
            }
        },

        obtenerElementosModificadosOCreados() {
            return this.elementos.filter(elemento => ['modificado', 'creado'].includes(elemento.flag))
        },

        obtenerListadosCreados() {
            return this.listados.filter(listado => listado.flag == 'creado')
        },

        async guardarElementosEnDexie(elementos) {
            const elementosPlanos = elementos.map(e => JSON.parse(JSON.stringify(e))) // Eliminar reactividad
            await db.elementos.bulkPut(elementosPlanos)
        },

        async guardarListadosEnDexie(listados) {
            const listadosPlanos = listados.map(l => JSON.parse(JSON.stringify(l))) // Eliminar reactividad
            await db.listados.bulkPut(listadosPlanos)
        }
    }
})

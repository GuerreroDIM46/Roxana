import { defineStore } from 'pinia'
import { db } from '@/storage/dexieDBConfig'
import { getListados, getElementos, postElemento, patchElemento, postListado } from '@/storage/LlamadasAPI'

export const useCombinedStore = defineStore('CombinedStore', {
    state: () => ({
        listados: [],
        elementos: [],
        conexionLista: true,
        cordovaListo: false,
        codigoEscaneado: null,
        alertaSobreescritura: null,
        listadoSeleccionado: null,
        elementoEncontrado:null
    }),
    actions: {
        setConexionLista(estado) {
            this.conexionLista = estado
        },
        setCordovaListo(estado) {
            this.cordovaListo = estado
        },
        setElementoEncontrado(elemento) {
            this.elementoEncontrado = elemento
        },
        seleccionarListado(listado) {
            this.listadoSeleccionado = listado
        },
        setCodigoEscaneado(codigo) {
            this.codigoEscaneado = codigo;
        },
        async cargarListados() {
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) {
                console.warn('Operación interrumpida debido a alerta de sobreescritura')
                return
            }
            try {
                const response = await getListados()
                const listados = response.data._embedded.listados.map(listado => ({
                    ...listado,
                    flag: null // Agregar el flag "null" para indicar que no se ha modificado localmente
                }))
                console.log("listados:", listados)
                await db.listados.bulkPut(listados)
                this.listados = listados
            } catch (error) {
                console.error('Error al cargar los listados desde la API', error)
                const listadosLocales = await db.listados.toArray()
                this.listados = listadosLocales
            }
        },

        async cargarElementos() {
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) {
                console.warn('Operación interrumpida debido a alerta de sobreescritura')
                return
            }
            try {
                const response = await getElementos()
                const elementos = response.data._embedded.elementos.map(elemento => ({
                    ...elemento,
                    flag: null
                }))
                console.log("elementos:", elementos)
                await db.elementos.bulkPut(elementos)
                this.elementos = elementos
            } catch (error) {
                console.error('Error al cargar los elementos desde la API', error)
                const elementosLocales = await db.elementos.where('listadoId').equals(this.listadoSeleccionado.id).toArray()
                this.elementos = elementosLocales
            }
        },

        async verificarElementosModificados() {
            try {
                if (this.alertaSobreescritura !== 'ignorar') {
                    const countElementosModificados = await db.elementos
                        .where('flag')
                        .anyOf('creado', 'modificado')
                        .count()
                    const countListadosModificados = await db.listados
                        .where('flag')
                        .anyOf('creado', 'modificado')
                        .count()
                    if ((countElementosModificados + countListadosModificados) > 0) {
                        this.alertaSobreescritura = 'notificar'
                        return false
                    } else {
                        this.alertaSobreescritura = null
                    }
                }
                return true
            } catch (error) {
                console.error('Error al verificar elementos y listados modificados en Dexie', error)
                return false
            }
        },

        async guardarEnLocal() {
            try {
                const elementosModificadosOCreados = this.obtenerElementosModificadosOCreados()
                const listadosCreados = this.obtenerListadosCreados()

                if (elementosModificadosOCreados.length > 0) {
                    await this.guardarElementosEnDexie(elementosModificadosOCreados)
                    console.log('Elementos modificados o creados guardados en Dexie:', elementosModificadosOCreados)
                } else {
                    console.log('No hay elementos modificados o creados para guardar en Dexie.')
                }

                if (listadosCreados.length > 0) {
                    await this.guardarListadosEnDexie(listadosCreados)
                    console.log('Listados creados guardados en Dexie:', listadosCreados)
                } else {
                    console.log('No hay listados creados para guardar en Dexie.')
                }
            } catch (error) {
                console.error('❌ Error al guardar los elementos y listados en Dexie:', error)
            }
        },

        obtenerElementosModificadosOCreados() {
            return this.elementos.filter(elemento => elemento.flag === 'modificado' || elemento.flag === 'creado')
        },

        obtenerListadosCreados() {
            return this.listados.filter(listado => listado.flag === 'creado')
        },

        async guardarElementosEnDexie(elementos) {
            for (const elemento of elementos) {
                const elementoPlano = JSON.parse(JSON.stringify(elemento)) // Eliminar reactividad (Vue Proxy)
                await db.elementos.put(elementoPlano)
            }
        },

        async guardarListadosEnDexie(listados) {
            for (const listado of listados) {
                const listadoPlano = JSON.parse(JSON.stringify(listado)) // Eliminar reactividad (Vue Proxy)
                await db.listados.put(listadoPlano)
            }
        },

        async borrarBaseDeDatosLocal() {
            try {
                await db.elementos.clear()
                console.log('✅ Todos los elementos han sido borrados de la base de datos local.')

                await db.listados.clear()
                this.listados = []
                this.elementos = []
                console.log('✅ Todos los listados han sido borrados de la base de datos local.')
            } catch (error) {
                console.error('❌ Error al borrar la base de datos local:', error)
            }
        },

        async sincronizarOperaciones() {
            this.sincronizando = true // Activar el estado de sincronización

            try {
                console.log("Iniciando sincronización de listados y elementos...")

                const listadosCreados = await db.listados.where('flag').equals('creado').toArray()
                const listadoIdMap = {}

                for (const listado of listadosCreados) {
                    const { flag, ...listadoSinFlag } = listado
                    const response = await postListado(listadoSinFlag)

                    if (response.status >= 200 && response.status < 300) {
                        const nuevoListadoId = response.data.id
                        listadoIdMap[listado.id] = nuevoListadoId

                        listado.flag = null
                        await db.listados.put(listado)

                        const index = this.listados.findIndex(l => l.id === listado.id)
                        if (index !== -1) {
                            this.listados[index].flag = null
                        }
                    }
                }

                const elementosModificados = await db.elementos.where('flag').anyOf('modificado', 'creado').toArray()

                for (const elemento of elementosModificados) {
                    const { flag, ...elementoSinFlag } = elemento
                    let response

                    if (elemento.listadoId && listadoIdMap[elemento.listadoId]) {
                        elementoSinFlag.listado = `https://roxanaapitest.manabo.org/api/listados/${listadoIdMap[elemento.listadoId]}`
                    }

                    if (flag === 'creado') {
                        response = await postElemento(elementoSinFlag)
                    } else if (flag === 'modificado') {
                        response = await patchElemento(elementoSinFlag)
                    }

                    if (response.status >= 200 && response.status < 300) {
                        elemento.flag = null
                        await db.elementos.put(elemento)

                        const index = this.elementos.findIndex(el => el.id === elemento.id)
                        if (index !== -1) {
                            this.elementos[index].flag = null
                        }
                    }
                }
                console.log("Sincronización completada con éxito.");
            } catch (error) {
                console.error('Error durante la sincronización:', error);
                alert('Hubo un error al sincronizar las operaciones.');
            } finally {
                this.sincronizando = false; // Desactivar el estado de sincronización
            }
        },

        async cargarDatosDesdeDexie() {
            try {
                // Cargar listados desde DexieDB
                const listadosEnDexie = await db.listados.toArray();
                if (listadosEnDexie.length > 0) {
                    this.listados = listadosEnDexie;
                    console.log("Listados cargados desde Dexie en Pinia:", listadosEnDexie);
                } else {
                    console.log("No se encontraron listados en Dexie.");
                }

                // Cargar elementos desde DexieDB
                const elementosEnDexie = await db.elementos.toArray();
                if (elementosEnDexie.length > 0) {
                    this.elementos = elementosEnDexie;
                    console.log("Elementos cargados desde Dexie en Pinia:", elementosEnDexie);
                } else {
                    console.log("No se encontraron elementos en Dexie.");
                }
            } catch (error) {
                console.error("Error al cargar datos desde Dexie:", error);
            }
        }
    }
});


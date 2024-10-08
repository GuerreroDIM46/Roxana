
import { defineStore } from 'pinia'
import { db } from '@/storage/dexieDBConfig'
import { getListados, getElementos, postElemento, patchElemento, postListado } from '@/storage/LlamadasAPI'

export const useCombinedStore = defineStore('CombinedStore', {
    state: () => ({
        listados: [],
        elementos: [],
        conexionLista: true, 
        cordovaListo: false, 
        alertaSobreescritura: null, 
        listadoSeleccionado: null,
    }),
    actions: {        
        setConexionLista(estado) {
            this.conexionLista = estado
        },
        setCordovaListo(estado) {
            this.cordovaListo = estado
        },
        seleccionarListado(listado) {
            this.listadoSeleccionado = listado
        },        
        async cargarListados() {            
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) {
                console.warn('Operación interrumpida debido a alerta de sobreescritura')
                return
            }
            try {
                const response = await getListados()
                // Usar map para agregar el flag null a cada listado
                const listados = response.data._embedded.listados.map(listado => ({
                    ...listado,
                    flag: null // Agregar el flag "null" para indicar que no se ha modificado localmente
                }))
                console.log("listados:", listados )                
                await db.listados.bulkPut(listados)
                this.listados = listados
            } catch (error) {
                console.error('Error al cargar los listados desde la API', error)
                const listadosLocales = await db.listados.toArray()
                this.listados = listadosLocales;
            }
        },
        async cargarElementos() {
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) {
                console.warn('Operación interrumpida debido a alerta de sobreescritura')
                return
            }
            try {
                const response = await await getElementos()
                const elementos = response.data._embedded.elementos.map(elemento => ({
                    ...elemento,
                    flag: null 
                }))
                console.log("elementos:", elementos )
                await db.elementos.bulkPut(elementos)
                this.elementos = elementos
            } catch (error) {
                console.error('Error al cargar los elementos desde la API', error)
                const elementosLocales = await db.elementos.where('listadoId').equals(listadoId).toArray()
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
                } else {
                    console.log('Alerta de sobreescritura está en modo "ignorar". No se actualiza.')
                }        
                return true
            } catch (error) {
                console.error('Error al verificar elementos y listados modificados en Dexie', error)
                return false
            }
        },
        async guardarEnLocal() {
            try {
                const elementosModificadosOCreados = this.obtenerElementosModificadosOCreados();
                const listadosCreados = this.obtenerListadosCreados();

                if (elementosModificadosOCreados.length > 0) {
                    await this.guardarElementosEnDexie(elementosModificadosOCreados);
                    console.log('Elementos modificados o creados guardados en Dexie:', elementosModificadosOCreados);
                } else {
                    console.log('No hay elementos modificados o creados para guardar en Dexie.');
                }

                if (listadosCreados.length > 0) {
                    await this.guardarListadosEnDexie(listadosCreados);
                    console.log('Listados creados guardados en Dexie:', listadosCreados);
                } else {
                    console.log('No hay listados creados para guardar en Dexie.');
                }
            } catch (error) {
                console.error('❌ Error al guardar los elementos y listados en Dexie:', error);
            }
        },

        // Filtrar elementos modificados o creados
        obtenerElementosModificadosOCreados() {
            return this.elementos.filter(elemento => elemento.flag === 'modificado' || elemento.flag === 'creado');
        },

        // Filtrar listados creados
        obtenerListadosCreados() {
            return this.listados.filter(listado => listado.flag === 'creado');
        },

        // Guardar elementos en Dexie
        async guardarElementosEnDexie(elementos) {
            for (const elemento of elementos) {
                const elementoPlano = JSON.parse(JSON.stringify(elemento)); // Eliminar reactividad (Vue Proxy)
                await db.elementos.put(elementoPlano);
            }
        },

        // Guardar listados en Dexie
        async guardarListadosEnDexie(listados) {
            for (const listado of listados) {
                const listadoPlano = JSON.parse(JSON.stringify(listado)); // Eliminar reactividad (Vue Proxy)
                await db.listados.put(listadoPlano);
            }
        },

        async borrarBaseDeDatosLocal() {
            try {
                // Borrar todos los elementos de la tabla 'elementos'
                await db.elementos.clear();
                console.log('✅ Todos los elementos han sido borrados de la base de datos local.');
        
                // Borrar todos los listados de la tabla 'listados'
                await db.listados.clear();
                this.listados = []
                this.elementos = []
                console.log('✅ Todos los listados han sido borrados de la base de datos local.');
            } catch (error) {
                console.error('❌ Error al borrar la base de datos local:', error);
            }
        },
        async sincronizarOperaciones() {
            try {
                console.log("Iniciando sincronización de elementos y listados...");
                await this.sincronizarElementos();
                await this.sincronizarListados();
                console.log("Sincronización completada con éxito.");
            } catch (error) {
                console.error('Error durante la sincronización:', error);
                throw new Error('Error durante la sincronización.');
            }
        },

        // Sincronización de elementos modificados o creados
        async sincronizarElementos() {
            try {
                const elementosModificados = await db.elementos
                    .where('flag')
                    .anyOf('modificado', 'creado')
                    .toArray();

                for (const elemento of elementosModificados) {
                    const { flag, ...elementoSinFlag } = elemento;
                    let response;

                    // Si es creado o modificado, hacemos la llamada correspondiente
                    if (flag === 'creado') {
                        response = await postElemento(elementoSinFlag); // API de creación
                    } else if (flag === 'modificado') {
                        response = await patchElemento(elementoSinFlag); // API de modificación
                    }

                    // Si la respuesta es exitosa, actualizamos el flag a null
                    if (response.status >= 200 && response.status < 300) {
                        elemento.flag = null; // Resetear el flag en Dexie
                        await db.elementos.put(elemento); // Guardar el elemento actualizado en Dexie

                        // Actualizar el flag en Pinia
                        const index = this.elementos.findIndex(el => el.id === elemento.id);
                        if (index !== -1) {
                            this.elementos[index].flag = null;
                        }
                    }
                }
            } catch (error) {
                console.error('Error al sincronizar los elementos:', error);
                throw new Error('Error al sincronizar los elementos.');
            }
        },

        // Sincronización de listados creados
        async sincronizarListados() {
            try {
                const listadosCreados = await db.listados
                    .where('flag')
                    .equals('creado')
                    .toArray();

                for (const listado of listadosCreados) {
                    const { flag, ...listadoSinFlag } = listado;
                    const response = await postListado(listadoSinFlag); // API de creación de listados

                    if (response.status >= 200 && response.status < 300) {
                        listado.flag = null; // Resetear el flag en Dexie
                        await db.listados.put(listado); // Guardar el listado actualizado en Dexie

                        // Actualizar el flag en Pinia
                        const index = this.listados.findIndex(l => l.id === listado.id);
                        if (index !== -1) {
                            this.listados[index].flag = null;
                        }
                    }
                }
            } catch (error) {
                console.error('Error al sincronizar los listados:', error);
                throw new Error('Error al sincronizar los listados.');
            }
        },
    }
})

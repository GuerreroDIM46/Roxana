import { mapState, mapActions, defineStore } from 'pinia';
import { db } from '@/storage/dexieDBConfig';
import { postElemento, patchElemento, postListado } from '@/storage/LlamadasAPI';
import { useCombinedStore } from '@/storage/combinedStore'
import { host } from '@/storage/LlamadasAPI';

export const useSincronizacionStore = defineStore('SincronizacionStore', {
    state: () => ({
        sincronizando: false, // Estado de sincronización
    }),
    computed: {
        ...mapState(useCombinedStore, ['listados', 'elementos']),
    },
    actions: {
        ...mapActions(useCombinedStore, ['setElementos', 'setListados']),
        async sincronizarOperaciones() {
            this.sincronizando = true;
            try {
                console.log("Iniciando sincronización de listados y elementos...");

                const listadosCreados = await db.listados.where('flag').equals('creado').toArray();
                const listadoIdMap = {};

                for (const listado of listadosCreados) {
                    const { flag, ...listadoSinFlag } = listado;
                    const response = await postListado(listadoSinFlag);

                    if (response.status >= 200 && response.status < 300) {
                        const nuevoListadoId = response.data.id;
                        listadoIdMap[listado.id] = nuevoListadoId;
                        listado.flag = null;
                        await db.listados.put(listado);
                    }
                }

                const elementosModificados = await db.elementos.where('flag').anyOf('modificado', 'creado').toArray();

                for (const elemento of elementosModificados) {
                    const { flag, ...elementoSinFlag } = elemento;
                    let response;

                    if (elemento.listadoId && listadoIdMap[elemento.listadoId]) {
                        elementoSinFlag.listado = `${host}listados/${listadoIdMap[elemento.listadoId]}`
                    }

                    if (flag === 'creado') {
                        response = await postElemento(elementoSinFlag);
                    } else if (flag === 'modificado') {
                        response = await patchElemento(elementoSinFlag);
                    }

                    if (response.status >= 200 && response.status < 300) {
                        elemento.flag = null;
                        await db.elementos.put(elemento);
                    }
                }
                console.log("Sincronización completada con éxito.");
            } catch (error) {
                console.error('Error durante la sincronización:', error);
                alert('Hubo un error al sincronizar las operaciones.');
            } finally {
                this.sincronizando = false;
            }
        },

        // Función para cargar datos (listados y elementos) desde Dexie a Pinia
        async cargarDatosDesdeDexie() {
            try {
                const listados = await db.listados.toArray();
                const elementos = await db.elementos.toArray();
                console.log("Listados y Elementos cargados desde Dexie:", { listados, elementos });
                this.setListados(listados)
                this.setElementos(elementos)
            } catch (error) {
                console.error("Error al cargar datos desde Dexie:", error);
            }
        },

        // Función para borrar toda la base de datos local (listados y elementos) en Dexie
        async borrarBaseDeDatosLocal() {
            try {
                await db.listados.clear()
                await db.elementos.clear()
                this.setListados([])
                this.setElementos([])
                console.log('Base de datos local borrada con éxito.');
            } catch (error) {
                console.error('Error al borrar la base de datos local:', error);
            }
        }
    }
});

// stores/listadoStore.js
import { defineStore } from 'pinia';
import { db } from '@/storage/dexieDBConfig'; // Importar la base de datos Dexie
import { getListados, getElementos, postElemento, patchElemento, postListado } from '@/storage/LlamadasAPI'; // Importar las llamadas centralizadas

export const useCombinedStore = defineStore('CombinedStore', {
    state: () => ({
        listados: [],
        elementos: [],
        conexionLista: true, // Estado inicial de la conexión
        cordovaListo: false, // Estado inicial de la de cordiva
        alertaSobreescritura: null, // Nueva variable para manejar la alerta
        listadoSeleccionado: null,
    }),
    actions: {
        // Verificar si hay elementos o listados modificados
        setConexionLista(estado) {
            this.conexionLista = estado
        },
        setCordovaListo(estado) {
            this.cordovaListo = estado
        },
        seleccionarListado(listado) {
            this.listadoSeleccionado = listado; // Guardar el listado seleccionado en Pinia
        },
        // Cargar listados desde la API y guardarlos en DexieDB
        async cargarListados() {
            // Verificar si hay elementos o listados modificados antes de continuar
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) {
                console.warn('Operación interrumpida debido a alerta de sobreescritura')
                return; // Interrumpir la operación
            }

            try {
                const response = await getListados()
                // Usar map para agregar el flag null a cada listado
                const listados = response.data._embedded.listados.map(listado => ({
                    ...listado,
                    flag: null // Agregar el flag "null" para indicar que no se ha modificado localmente
                }));
                console.log("listados:", listados )
                // Guardar los listados en DexieDB
                await db.listados.bulkPut(listados)

                // Actualizar el estado de listados en Pinia
                this.listados = listados

            } catch (error) {
                console.error('Error al cargar los listados desde la API', error)

                // Si falla la API, intentar cargar los listados desde DexieDB
                const listadosLocales = await db.listados.toArray()
                this.listados = listadosLocales;
            }
        },

        // Cargar elementos por listado desde la API y guardarlos en DexieDB
        async cargarElementos() {
            // Verificar si hay elementos o listados modificados antes de continuar
            const puedeContinuar = await this.verificarElementosModificados()
            if (!puedeContinuar) {
                console.warn('Operación interrumpida debido a alerta de sobreescritura');
                return; // Interrumpir la operación
            }

            try {
                const response = await await getElementos()
                // Usar map para agregar el flag null a cada elemento
                const elementos = response.data._embedded.elementos.map(elemento => ({
                    ...elemento,
                    flag: null // Agregar el flag "null" para indicar que no se ha modificado localmente
                }))
                console.log("elementos:", elementos )
                // Guardar los elementos en DexieDB
                await db.elementos.bulkPut(elementos)

                // Actualizar el estado de elementos en Pinia
                this.elementos = elementos
            } catch (error) {
                console.error('Error al cargar los elementos desde la API', error)

                // Si falla la API, intentar cargar los elementos desde DexieDB
                const elementosLocales = await db.elementos.where('listadoId').equals(listadoId).toArray()
                this.elementos = elementosLocales;
            }
        },
        async verificarElementosModificados() {
            try {
                // Solo proceder si alertaSobreescritura no es "ignorar"
                if (this.alertaSobreescritura !== 'ignorar') {
                    // Contar elementos en DexieDB con flags "creado" o "modificado"
                    const countElementosModificados = await db.elementos
                        .where('flag')
                        .anyOf('creado', 'modificado')
                        .count()
        
                    // Contar listados en DexieDB con flags "creado" o "modificado"
                    const countListadosModificados = await db.listados
                        .where('flag')
                        .anyOf('creado', 'modificado')
                        .count()
        
                    // Si hay elementos o listados modificados o creados, actualizar alertaSobreescritura
                    if ((countElementosModificados + countListadosModificados) > 0) {
                        this.alertaSobreescritura = 'notificar' // Cambiar el valor de alerta
                        return false // Interrumpir la operación
                    } else {
                        this.alertaSobreescritura = null // Si no hay modificaciones, resetear la alerta
                    }
                } else {
                    console.log('Alerta de sobreescritura está en modo "ignorar". No se actualiza.');
                }
        
                return true // Continuar si no hay elementos modificados o si se ignora la alerta
            } catch (error) {
                console.error('Error al verificar elementos y listados modificados en Dexie', error);
                return false
            }
        },
        


        // Sincronizar elementos modificados o creados localmente con la API
        async sincronizarElementos() {
            // Obtener elementos con flag "modificado" o "creado"
            const elementosModificados = await db.elementos.where('flag').anyOf('modificado', 'creado').toArray();

            for (const elemento of elementosModificados) {
                // Eliminar la propiedad `flag` antes de enviar a la API
                const { flag, ...elementoSinFlag } = elemento;

                let response;

                // Realizar la sincronización según el flag
                if (flag === 'creado') {
                    response = await postElemento(elementoSinFlag);
                } else if (flag === 'modificado') {
                    response = await patchElemento(elementoSinFlag);
                }

                // Comprobar la respuesta de la API: si el estado es 2xx (sin errores), eliminar el elemento de DexieDB
                if (response.status >= 200 && response.status < 300) {
                    // Eliminar el elemento de DexieDB
                    await db.elementos.delete(elemento.id);
                }
            }
        },

        // Sincronizar los listados que tienen el flag "creado"
        async sincronizarListados() {
            // Obtener listados con el flag "creado"
            const listadosCreados = await db.listados.where('flag').equals('creado').toArray();

            for (const listado of listadosCreados) {
                // Eliminar el flag antes de enviar a la API
                const { flag, ...listadoSinFlag } = listado;

                // Enviar el POST a la API
                const response = await postListado(listadoSinFlag);

                // Comprobar si la respuesta fue exitosa (código de estado 2xx)
                if (response.status >= 200 && response.status < 300) {
                    // Eliminar el listado de DexieDB
                    await db.listados.delete(listado.id);
                }
            }
        },

        // Crear un nuevo listado localmente con el flag "creado"
        async crearListado() {
            // Obtener el número de listados existentes para generar un nombre único
            const listadosLocales = await db.listados.toArray();
            const nuevoNombre = `nuevolistado${listadosLocales.length + 1}`;

            // Crear el objeto del nuevo listado con el flag "creado" y tipo "inventario"
            const nuevoListado = {
                nombre: nuevoNombre,
                tipo: 'inventario',
                flag: 'creado'
            };

            // Guardar el nuevo listado en DexieDB
            await db.listados.add(nuevoListado);

            // Actualizar el estado de listados en Pinia
            this.listados.push(nuevoListado);
        },
        
    }
});

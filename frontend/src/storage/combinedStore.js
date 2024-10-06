
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
                // Filtrar los elementos modificados o creados
                const elementosModificados = this.elementos.filter(elemento => elemento.flag === 'modificado' || elemento.flag === 'creado');
        
                if (elementosModificados.length > 0) {
                    // Guardar cada elemento modificado/creado en Dexie
                    for (const elemento of elementosModificados) {
                        await db.elementos.put(elemento);
                    }
                    console.log('✅ Elementos modificados o creados guardados en Dexie:', elementosModificados);
                } else {
                    console.log('ℹ️ No hay elementos modificados o creados para guardar en Dexie.');
                }
            } catch (error) {
                console.error('❌ Error al guardar los elementos modificados o creados en Dexie:', error);
            }
        },        
        async sincronizarElementos() {
            const elementosModificados = await db.elementos.where('flag').anyOf('modificado', 'creado').toArray()
            for (const elemento of elementosModificados) {
                const { flag, ...elementoSinFlag } = elemento
                let response
                if (flag == 'creado') {
                    response = await postElemento(elementoSinFlag)
                } else if (flag == 'modificado') {
                    response = await patchElemento(elementoSinFlag)
                }
                if (response.status >= 200 && response.status < 300) {                    
                    await db.elementos.delete(elemento.id)
                }
            }
        },
        async sincronizarListados() {
            const listadosCreados = await db.listados.where('flag').equals('creado').toArray()
            for (const listado of listadosCreados) {
                const { flag, ...listadoSinFlag } = listado
                const response = await postListado(listadoSinFlag)
                if (response.status >= 200 && response.status < 300) {
                    await db.listados.delete(listado.id)
                }
            }
        },
        async crearListado() {
            const listadosLocales = await db.listados.toArray();
            const nuevoNombre = `nuevolistado${listadosLocales.length + 1}`
            const nuevoListado = {
                nombre: nuevoNombre,
                tipo: 'inventario',
                flag: 'creado'
            }
            await db.listados.add(nuevoListado)
            this.listados.push(nuevoListado)
        },        
    }
})

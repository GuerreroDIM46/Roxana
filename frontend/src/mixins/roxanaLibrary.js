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
        async realizarOperacion(tipo) {       // Puede ser 'verificacion' o 'generacion'
            try {
                await this.escanear()   // devuelve codigoEscaneado
                this.comparar(tipo)      // devuelve elementoEncontrado
                if (!this.elementoEncontrado) { // si no existe interrumpe operacion
                    // soundLibrary.reproducirSonido('fail')
                    return
                }
                this.modificarPropiedades(tipo)  // le cambia las propiedades al elemento encontrada
                this.actualizarElementoEnPinia(tipo)  // guarda elemento encontrado en pinia
                this.filtrarElementos() // hace un filtrar
            } catch (error) {
                console.error(`Error en la operación de tipo ${tipo}:`, error)
            }
        },
        comparar(tipo) {
            let elementos;        
            if (tipo === "verificacion") {
                elementos = this.elementosFiltrados;
            } else if (tipo === "generacion") {
                elementos = this.elementos;
            } else {
                console.log("❌Tipo de operación no reconocido.");
                return; 
            }
            const elemento = elementos.find(el => el.barcode === this.codigoEscaneado);        
            this.setElementoEncontrado(elemento);        
            if (!elemento) {
                console.log("❌Elemento no encontrado.");
            }
        },
        modificarPropiedades(tipo) {
            switch (tipo) {
                case "verificacion":
                    this.elementoEncontrado.estado = '200';
                    this.elementoEncontrado.flag = 'modificado';
                    // soundLibrary.reproducirSonido('success');
                    console.log("Elemento actualizado:", this.elementoEncontrado);
                    break;
        
                case "generacion":
                    this.elementoEncontrado.estado = '300';
                    this.elementoEncontrado.flag = 'modificado';
                    this.elementoEncontrado.listadoId = this.listadoSeleccionado.id
                    // soundLibrary.reproducirSonido('success');
                    console.log("Elemento generado:", this.elementoEncontrado);
                    break;
        
                default:
                    console.log("Operación fallida: tipo no reconocido.");
                    // soundLibrary.reproducirSonido('fail');
                    break;
            }
        },
        actualizarElementoEnPinia(tipo) {
            if (tipo === 'verificacion') {
                const index = this.elementos.findIndex(el => el.id === this.elementoEncontrado.id);
                if (index !== -1) {
                    this.elementos.splice(index, 1, this.elementoEncontrado); // Reemplazar el elemento
                }
            } else if (tipo === 'generacion') {
                this.elementos.push(this.elementoEncontrado); // Agregar nuevo elemento al final
            }        
            this.setElementoEncontrado(null); // Limpiar el elementoEncontrado después de actualizar
        }
        
        
    },
}

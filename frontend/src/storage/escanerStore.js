import { defineStore } from 'pinia'

export const useEscanerStore = defineStore('EscanerStore', {
    state: () => ({
        codigoEscaneado: null,
    }),
    actions: {
        setCodigoEscaneado(codigo) {
            this.codigoEscaneado = codigo;
        }
    }
})

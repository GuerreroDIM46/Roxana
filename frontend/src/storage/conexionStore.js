import { defineStore } from 'pinia'

export const useConexionStore = defineStore('ConexionStore', {
    state: () => ({
        conexionLista: true,
    }),
    actions: {
        setConexionLista(estado) {
            this.conexionLista = estado
        }
    }
})

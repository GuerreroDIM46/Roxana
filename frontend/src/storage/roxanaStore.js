import { defineStore } from 'pinia'

export const useRoxanaStore = defineStore('roxanaStore', {
    state: () => ({
        clase: null, // Tipo de operacion
    }),
    actions: {
        setClase(clase) {
            this.clase = clase
        }
    }
})
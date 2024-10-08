import { defineStore } from 'pinia'

export const useCordovaStore = defineStore('CordovaStore', {
    state: () => ({
        cordovaListo: false,
    }),
    actions: {
        setCordovaListo(estado) {
            this.cordovaListo = estado
        }
    }
})

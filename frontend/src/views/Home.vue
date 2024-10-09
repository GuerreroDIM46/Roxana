<script>
import { mapState } from 'pinia'

import { useEscanerStore } from '@/storage/escanerStore'   
import { escanerLibrary } from '@/mixins/escanerLibrary'   //libreria funcion escanear()

import { useConexionStore } from '@/storage/conexionStore'
import { conexionLibrary }  from '@/mixins/conexionLibrary' //libreria para obtener el estado de la conexion

export default {
    mixins: [escanerLibrary, conexionLibrary],
    computed: {
        ...mapState(useEscanerStore, ['codigoEscaneado']),  // acceso centralizado al codigo escaneado
        ...mapState(useConexionStore, ['conexionLista']),   // acceso centralizado al estado de la conexion
    },
    methods: {
        async iniciarEscaneo() {
            try {
                await this.escanear()
            } catch (error) {
                console.error("Error en el escaneo:", error)
            }
        },
        goMain() {
            this.$router.push({ name: 'Listados' })
        }
    },
}
</script>

<template>
    <div id="app" class="container mt-5 text-center">
        <h1 class="text-center mb-4">                
                <span>Estado de la conexion: </span>
                <span v-if="conexionLista" style="color: green;">Online</span>
                <span v-else style="color: red;">Offline</span> 
        </h1>

        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-header">

                    </div>
                    <div class="card-body" @click="goMain">
                        <!-- Imagen circular centrada -->
                        <img src="@/assets/logo_roxana.jpeg" alt="Imagen Circular" class="rounded-circle mb-3"
                            width="150" height="150" />
                        <p class="card-text">Este es un ejemplo básico la funcionalidad del lector codigo de barras,
                            bootstrap, pinia, vue router y deteccion de la conexion.</p>
                        <div class="mt-4">
                            <h2>Escanear Código de Barras</h2>
                            <div v-if="codigoEscaneado">
                                <h3>Código escaneado:</h3>
                                <p>{{ codigoEscaneado }}</p>
                            </div>
                            <button class="btn btn-success" @click="iniciarEscaneo">Escanear</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

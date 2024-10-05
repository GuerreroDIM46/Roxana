<script>
import Escaner from '@/components/Escaner.vue'
export default {
    data() {
        return {
            codigoEscaneado: null,
            alertaVisible: false
        }
    },
    components: {
        Escaner,
    },
    methods: {
        siEscaneado(codigo) {
            this.codigoEscaneado = codigo
        },
        mostrarAlerta() {
            this.alertaVisible = true
        }
    }
};
</script>

<template>
    <div id="app" class="container mt-5">
        <h1 class="text-center mb-4">Demostración de Bootstrap con Vue</h1>

        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="card text-center">
                    <div class="card-header prueba">
                        Componente de Tarjeta con Imagen Circular
                    </div>
                    <div class="card-body">
                        <!-- Imagen circular centrada -->
                        <img src="@/assets/logo_roxana.jpeg" alt="Imagen Circular" class="rounded-circle mb-3"
                            width="150" height="150" />
                        <p class="card-text">Este es un ejemplo básico de una tarjeta con una imagen circular usando
                            clases de Bootstrap.</p>
                        <button class="btn btn-primary btn-block" @click="mostrarAlerta">Haz clic aquí</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="alert alert-success mt-4" v-if="alertaVisible" role="alert">
            ¡Has hecho clic en el botón!
        </div>

        <div class="m-4">
        <h1>Escanear Código de Barras</h1>
        <div v-if="codigoEscaneado">
            <h2>Código escaneado:</h2>
            <p>{{ codigoEscaneado }}</p>
        </div>
        <Escaner @codigoEscaneado="siEscaneado" />
    </div>
    </div>
</template>



<style scoped>

</style>
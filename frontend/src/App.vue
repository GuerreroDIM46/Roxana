<script>
import estadoConexion from "@/components/EstadoConexion.vue"
import Titulo from "@/components/Titulo.vue";

export default {
  components: { estadoConexion, Titulo },
}
</script>

<template>
  <div  class="app-container ">
    <Titulo></Titulo>
    <main>
      <router-view></router-view>
    </main>
    <estadoConexion></estadoConexion>
  </div>
</template>




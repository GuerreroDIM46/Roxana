<script>
import estadoConexion from "@/components/EstadoConexion.vue"

export default {
  components: { estadoConexion },
}
</script>

<template>
  <div  class="app-container ">
    <main>
      <router-view></router-view>
    </main>
    <estadoConexion></estadoConexion>
  </div>
</template>




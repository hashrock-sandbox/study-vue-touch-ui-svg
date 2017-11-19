<template>
  <div id="app">
    <!-- mousemove, touchmove, mouseleaveはコンテナに置かないと不便 -->
    <fusen-canvas></fusen-canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FusenCanvas from "./FusenCanvas.vue"

export default Vue.extend({
  components: {
    FusenCanvas
  }
})
</script>

<style>
body {
  background: #eee;
  margin: 0;
}


#app {
  text-align: center;
  color: #2c3e50;
}

</style>
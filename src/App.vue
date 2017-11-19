<template>
  <div id="app">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/css/bootstrap-reboot.css">
    <!-- mousemove, touchmove, mouseleaveはコンテナに置かないと不便 -->
    <fusen-canvas></fusen-canvas>
    <div class="editor" v-show="editing">
      <div class="editor__frame">
        <textarea class="editor__textarea">Hello!</textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FusenCanvas from "./FusenCanvas.vue"

export default Vue.extend({
  data(){
    return {
      editing: false
    }
  },
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
  width: 800px;
  height: 800px;
  position: relative;
}

.editor{
  top: 0;
  left: 0;
  width: 800px;
  height: 800px;
  position: absolute;
}

.editor__frame{
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 300px;
  height: 300px;
}
.editor__textarea{
  flex: 1;
  height: 100%;
}

</style>
<template>
  <div class="split">
    <div class="pane-left">
      <textarea class="example" v-model="input"></textarea>
    </div>
    <div class="pane-right">
      <app :input="input" @change="update"></app>  
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import App from "./App.vue";
import { FusenItem } from "./shapes";

export default Vue.extend({
  components: {
    App
  },
  data() {
    return {
      input: "Hello,world 0,0,200,100\nこんにちは～ 100,100,300,150"
    };
  },
  methods: {
    update(value: FusenItem[]) {
      this.input = value
        .map(item => {
          return `${item.text.replace(/\n/g, "\\n")} ${item.x},${item.y},${
            item.w
          },${item.h}`;
        })
        .join("\n");
    }
  }
});
</script>

<style>
.split {
  display: flex;
}
.pane-left {
  flex: 1;
  display: flex;
}
.pane-right {
  flex: 1;
}
textarea.example {
  flex: 1;
  background: #333;
  color: white;
}
</style>

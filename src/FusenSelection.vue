<template>
  <g v-if="selectedItem" :transform="'translate('+ selectedItem.x + ',' + selectedItem.y +  ')'">
    <rect class="selection" :x="0" :y="0" :width="selectedItem.w" :height="selectedItem.h"></rect>
    <rect class="handle" @pointerdown="resizePoint(handle.type)" v-for="(handle, index) in handles" :key="index" :x="handle.x - handle.size / 2" :y="handle.y - handle.size / 2" :width="handle.size" :height="handle.size"></rect>
    <circle class="arrow-handle" :cx="selectedItem.w / 2" :cy="-20" r="5"></circle>
    <circle class="arrow-handle" :cx="-20" :cy="selectedItem.h / 2" r="5"></circle>
    <circle class="arrow-handle" :cx="selectedItem.w + 20" :cy="selectedItem.h / 2" r="5"></circle>
    <circle class="arrow-handle" :cx="selectedItem.w / 2" :cy="selectedItem.h + 20" r="5"></circle>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { FusenItem } from "./store";

export default Vue.extend({
  props: {
    selectedItem: Object
  },
  computed: {
    handles() {
      const item: FusenItem = this.selectedItem;
      if (!item) {
        return [];
      }
      const size = 10;
      /*
        lt ct rt
        lc    rc
        lb cb rb
      */
      return [
        { type: ["left", "top"], x: 0, y: 0, size: size },
        { type: ["center", "top"], x: item.w / 2, y: 0, size: size },
        { type: ["right", "top"], x: item.w, y: 0, size: size },
        { type: ["left", "center"], x: 0, y: item.h / 2, size: size },
        { type: ["right", "center"], x: item.w, y: item.h / 2, size: size },
        { type: ["left", "bottom"], x: 0, y: item.h, size: size },
        { type: ["center", "bottom"], x: item.w / 2, y: item.h, size: size },
        { type: ["right", "bottom"], x: item.w, y: item.h, size: size }
      ];
    }
  },
  methods: {
    resizePoint(type: string[]) {
      this.$emit("resize", type);
    }
  }
});
</script>

<style>
.handle {
  fill: white;
  stroke: green;
}

.selection {
  fill: none;
  stroke: green;
}

.arrow-handle {
  fill: white;
  stroke: rgba(0, 0, 0, 0.5);
}
</style>

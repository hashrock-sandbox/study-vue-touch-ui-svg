<template>
  <g :transform="toPosition">
    <rect class="item" @pointerdown="startDrag($event)" :width="item.w" :height="item.h">
    </rect>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    item: Object,
    index: Number
  },
  methods: {
    startDrag(event: DragEvent) {
      this.$emit("selected", [event, this.index]);
    }
  },
  computed: {
    toPosition(): string {
      return `translate(${this.item.x}, ${this.item.y})`;
    }
  }
});
</script>

<style>

</style>

<template>
  <g :transform="toPosition">
    <rect class="item" @pointerdown="startDrag($event)" @dblclick="openEditor" :width="item.w" :height="item.h" >
    </rect>
    <foreignObject width="300" height="300" x="0" y="0">
      <div class="innerText" v-text="item.text"></div>
    </foreignObject>
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
    },
    openEditor() {
      this.$emit("open", this.index);
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
.innerText {
  padding: 0.5rem;
  white-space: pre-wrap;
  user-select: none;
  pointer-events: none;
}
</style>

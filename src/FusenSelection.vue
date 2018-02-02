<template>
  <g v-if="selectedItem" :transform="'translate('+ selectedItem.x + ',' + selectedItem.y +  ')'">
    <rect class="selection" :x="0" :y="0" :width="selectedItem.w" :height="selectedItem.h"></rect>
    <rect class="handle" @pointerdown="resizePoint(handle.type)" v-for="(handle, index) in handles" :key="index" :x="handle.pos.x - size / 2" :y="handle.pos.y - size / 2" :width="size" :height="size"></rect>
    <polygon class="arrow-handle" @pointerdown="createArrow($event, 270)" :transform="arrowUiShape(270)" points="0,-8 8,0 0,8"></polygon>
    <polygon class="arrow-handle" @pointerdown="createArrow($event, 180)" :transform="arrowUiShape(180)" points="0,-8 8,0 0,8"></polygon>
    <polygon class="arrow-handle" @pointerdown="createArrow($event, 0)" :transform="arrowUiShape(0)" points="0,-8 8,0 0,8"></polygon>
    <polygon class="arrow-handle" @pointerdown="createArrow($event, 90)" :transform="arrowUiShape(90)" points="0,-8 8,0 0,8"></polygon>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { FusenItem, Point } from "./shapes";

interface Handle {
  type: string[];
  pos: Point;
}

export default Vue.extend({
  props: {
    selectedItem: Object
  },
  data() {
    return {
      size: 10
    };
  },
  computed: {
    handles(): Handle[] {
      const item: FusenItem = this.selectedItem;
      if (!item) {
        return [];
      }
      return [
        { type: ["right", "center"], pos: item.localRight },
        { type: ["right", "bottom"], pos: item.localRightBottom },
        { type: ["center", "bottom"], pos: item.localBottom },
        { type: ["left", "bottom"], pos: item.localLeftBottom },
        { type: ["left", "center"], pos: item.localLeft },
        { type: ["left", "top"], pos: item.localLeftTop },
        { type: ["center", "top"], pos: item.localTop },
        { type: ["right", "top"], pos: item.localRightTop }
      ];
    }
  },
  methods: {
    arrowUiShape(rotate: number): string {
      if (this.selectedItem) {
        const offset = 16;
        if (rotate === 0) {
          return `translate(${this.selectedItem.w + offset}, ${this.selectedItem
            .h / 2}) rotate(${rotate})`;
        }
        if (rotate === 90) {
          return `translate(${this.selectedItem.w / 2}, ${this.selectedItem.h +
            offset}) rotate(${rotate})`;
        }
        if (rotate === 180) {
          return `translate(${-offset}, ${this.selectedItem.h /
            2}) rotate(${rotate})`;
        }
        if (rotate === 270) {
          return `translate(${this.selectedItem.w /
            2}, ${-offset}) rotate(${rotate})`;
        }
      }
      return "";
    },
    resizePoint(type: string[]) {
      this.$emit("resize", type);
    },
    createArrow(event: PointerEvent, type: number) {
      this.$emit("arrow", { type: type, event: event });
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

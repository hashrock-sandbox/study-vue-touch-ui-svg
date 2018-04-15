<template>
  <g v-if="selectedItem" :transform="selectedTransform">
    <rect class="selection" :x="0" :y="0" :width="selectedItem.w" :height="selectedItem.h"></rect>
    <rect class="handle" @pointerdown="resizePoint(handle.type)" v-for="(handle, index) in handles" :key="index" :x="handle.pos.x - size / 2" :y="handle.pos.y - size / 2" :width="size" :height="size"></rect>
    <polygon v-for="handle in arrowHandles" :key="handle" class="arrow-handle" @pointerdown="createArrow($event, handle)" :transform="arrowUiShape(handle)" points="0,-8 8,0 0,8"></polygon>
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
      size: 10,
      arrowHandles: ["top", "left", "right", "bottom"]
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
    },
    selectedTransform(): string {
      if (!this.selectedItem) {
        return "";
      }
      return (
        "translate(" + this.selectedItem.x + "," + this.selectedItem.y + ")"
      );
    }
  },
  methods: {
    arrowUiShape(rotate: string): string {
      if (this.selectedItem) {
        const offset = 16;
        if (rotate === "right") {
          return `translate(${this.selectedItem.w + offset}, ${this.selectedItem
            .h / 2}) rotate(0)`;
        }
        if (rotate === "bottom") {
          return `translate(${this.selectedItem.w / 2}, ${this.selectedItem.h +
            offset}) rotate(90)`;
        }
        if (rotate === "left") {
          return `translate(${-offset}, ${this.selectedItem.h /
            2}) rotate(180)`;
        }
        if (rotate === "top") {
          return `translate(${this.selectedItem.w /
            2}, ${-offset}) rotate(270)`;
        }
      }
      return "";
    },
    resizePoint(type: string[]) {
      this.$emit("resize", type);
    },
    createArrow(event: PointerEvent, type: string) {
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

<template>
  <svg id="canv" width="800" height="800" @pointermove="onDrag" @pointerup="stopDrag">
    <fusen-group v-for="(item, index) in items" :index="index" :key="index" :item="item" @selected="startDrag"></fusen-group>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import FusenGroup from "./FusenGroup.vue";

interface FusenItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default Vue.extend({
  data() {
    return {
      dragging: "none",
      selectedIndex: -1,
      dragOffset: {
        x: 0,
        y: 0
      },
      items: <FusenItem[]>[
        {
          x: 10,
          y: 10,
          w: 200,
          h: 100
        },
        {
          x: 210,
          y: 210,
          w: 300,
          h: 150
        }
      ]
    };
  },
  computed: {
    selectedItem(): FusenItem {
      return this.items[this.selectedIndex];
    }
  },
  methods: {
    startDrag(ev: any[]) {
      const e: DragEvent = ev[0];
      const index: number = ev[1];
      this.dragging = "move";
      this.selectedIndex = index;
      //ページ左上とオブジェクト左上の差分から、ドラッグ開始位置（オブジェクト相対座標）を取得
      this.dragOffset.x = e.offsetX - this.selectedItem.x;
      this.dragOffset.y = e.offsetY - this.selectedItem.y;

      if (e.offsetX - this.selectedItem.x > this.selectedItem.w - 20) {
        this.dragging = "resize-x";
      }
      if (e.offsetY - this.selectedItem.y > this.selectedItem.h - 20) {
        this.dragging = "resize-y";
      }
    },
    onDrag(e: DragEvent) {
      if (this.dragging === "move") {
        //差分値を基点に反映
        this.selectedItem.x =
          Math.round((e.offsetX - this.dragOffset.x) / 8) * 8;
        this.selectedItem.y =
          Math.round((e.offsetY - this.dragOffset.y) / 8) * 8;
      }
      if (this.dragging === "resize-x") {
        this.selectedItem.w =
          Math.round((e.offsetX - this.selectedItem.x) / 8) * 8;
        if (this.selectedItem.w < 8) {
          this.selectedItem.w = 8;
        }
      }
      if (this.dragging === "resize-y") {
        this.selectedItem.h =
          Math.round((e.offsetY - this.selectedItem.y) / 8) * 8;
        if (this.selectedItem.h < 8) {
          this.selectedItem.h = 8;
        }
      }
    },
    stopDrag() {
      if (this.dragging !== "none") {
        this.dragging = "none";
        this.selectedIndex = -1;
      }
    }
  },
  components: {
    FusenGroup
  }
});
</script>

<style>
svg {
  touch-action: none;
  background: white;
  position: absolute;
  /*opacity: 0.9;*/
}

.hint {
  width: 1px;
  height: 100px;
  background: red;
  position: absolute;
  z-index: -100;
}

.move {
  fill: gray;
}

.hover {
  fill: yellow;
}

.resize-hover {
  fill: blue;
}
.item {
  fill: white;
  stroke: black;
}

.item:hover {
  opacity: 0.5;
}
</style>

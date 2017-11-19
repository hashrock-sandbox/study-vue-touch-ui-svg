<template>
  <svg id="canv" width="800" height="800" @pointermove="onDrag" @pointerup="stopDrag">
    <filter id="drop-shadow" width="150%" height="150%">
        <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="2" />
        <feOffset result="offsetBlur" dx="2" dy="2" />
        <feBlend in="SourceGraphic" in2="offsetBlur" mode="normal" />
    </filter>
    <fusen-group v-for="(item, index) in items" :index="index" :key="index" :item="item" @selected="startDrag"></fusen-group>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import FusenGroup from "./FusenGroup.vue";
import { FusenItem } from "./store";
import { mapMutations } from "vuex";

export default Vue.extend({
  data() {
    return {
      dragging: "none",
      dragOffset: {
        x: 0,
        y: 0
      }
    };
  },
  computed: {
    selectedItem(): FusenItem {
      return this.$store.state.items[this.$store.state.selectedIndex];
    },
    items(): FusenItem[] {
      return this.$store.state.items;
    }
  },
  methods: {
    startDrag(ev: any[]) {
      const e: DragEvent = ev[0];
      const index: number = ev[1];
      this.dragging = "move";
      this.$store.commit("selectItem", index);

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
        this.$store.commit("moveItem", {
          x: Math.round((e.offsetX - this.dragOffset.x) / 8) * 8,
          y: Math.round((e.offsetY - this.dragOffset.y) / 8) * 8
        });
      }
      if (this.dragging === "resize-x") {
        this.$store.commit("resizeItem", {
          w: Math.round((e.offsetX - this.selectedItem.x) / 8) * 8,
          h: this.selectedItem.h
        });
      }
      if (this.dragging === "resize-y") {
        this.$store.commit("resizeItem", {
          w: this.selectedItem.w,
          h: Math.round((e.offsetY - this.selectedItem.y) / 8) * 8
        });
      }
    },
    stopDrag() {
      if (this.dragging !== "none") {
        this.dragging = "none";
        this.$store.commit("selectItem", -1);
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
  background: #FCC;
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

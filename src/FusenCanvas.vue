<template>
  <svg id="canv" width="800" height="800" @pointermove="onDrag" @pointerup="stopDrag">
    <filter id="drop-shadow" width="150%" height="150%">
        <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="2" />
        <feOffset result="offsetBlur" dx="2" dy="2" />
        <feBlend in="SourceGraphic" in2="offsetBlur" mode="normal" />
    </filter>
    <fusen-group v-for="(item, index) in items" :index="index" :key="index" :item="item" @selected="startDrag" @open="openEditor"></fusen-group>
    <g v-if="selectedItem" :transform="'translate('+ selectedItem.x + ',' + selectedItem.y +  ')'">
      <rect class="selection" :x="0" :y="0" :width="selectedItem.w" :height="selectedItem.h"></rect>
      <rect class="handle" @pointerdown="resizePoint(handle.type)" v-for="(handle, index) in handles" :key="index" :x="handle.x - handle.size / 2" :y="handle.y - handle.size / 2" :width="handle.size" :height="handle.size"></rect>
    </g>
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
    },
    handles(){
      const item: FusenItem = this.selectedItem
      if(!item){
        return []
      }
      const size = 10
      return [
        /*
          lt ct rt
          lc    rc
          lb cb rb
        */
        {type: "resize-lt", x: 0, y: 0, size: size},
        {type: "resize-ct", x: item.w / 2, y: 0, size: size},
        {type: "resize-rt", x: item.w, y: 0, size: size},
        {type: "resize-lc", x: 0, y: item.h / 2, size: size},
        {type: "resize-rc", x: item.w, y: item.h / 2, size: size},
        {type: "resize-lb", x: 0, y: item.h, size: size},
        {type: "resize-cb", x: item.w / 2, y: item.h, size: size},
        {type: "resize-rb", x: item.w, y: item.h, size: size},
      ]
    }
  },
  methods: {
    resizePoint(type: string) {
        this.dragging = type;
    },
    startDrag(ev: any[]) {
      const e: DragEvent = ev[0];
      const index: number = ev[1];
      this.dragging = "move";
      this.$store.commit("selectItem", index);

      //ページ左上とオブジェクト左上の差分から、ドラッグ開始位置（オブジェクト相対座標）を取得
      this.dragOffset.x = e.offsetX - this.selectedItem.x;
      this.dragOffset.y = e.offsetY - this.selectedItem.y;
    },
    onDrag(e: DragEvent) {
      if (this.dragging === "move") {
        //差分値を基点に反映
        this.$store.commit("moveItem", {
          x: Math.round((e.offsetX - this.dragOffset.x) / 8) * 8,
          y: Math.round((e.offsetY - this.dragOffset.y) / 8) * 8
        });
      }

      /*
        lt ct rt
        lc    rc
        lb cb rb
      */      
      if(this.dragging.indexOf("resize") === 0){
        let move = {
          x: this.selectedItem.x,
          y: this.selectedItem.y,
          w: this.selectedItem.w,
          h: this.selectedItem.h
        }
        if (this.dragging === "resize-lt") {
          move.x = Math.round((e.offsetX) / 8) * 8
          move.w = move.w - move.x + this.selectedItem.x
          move.y = Math.round((e.offsetY) / 8) * 8
          move.h = move.h - move.y + this.selectedItem.y
        }
        if (this.dragging === "resize-ct") {
          move.y = Math.round((e.offsetY ) / 8) * 8
          move.h = move.h - move.y + this.selectedItem.y
        }
        if (this.dragging === "resize-rt") {
          move.y = Math.round((e.offsetY ) / 8) * 8
          move.h = move.h - move.y + this.selectedItem.y
          move.w = Math.round((e.offsetX - this.selectedItem.x) / 8) * 8
        }
        if (this.dragging === "resize-lc") {
          move.x = Math.round((e.offsetX) / 8) * 8
          move.w = move.w - move.x + this.selectedItem.x
        }
        if (this.dragging === "resize-rc") {
          move.w = Math.round((e.offsetX - this.selectedItem.x) / 8) * 8
        }
        if (this.dragging === "resize-lb") {
          move.x = Math.round((e.offsetX) / 8) * 8
          move.w = move.w - move.x + this.selectedItem.x
          move.h = Math.round((e.offsetY - this.selectedItem.y) / 8) * 8
        }
        if (this.dragging === "resize-cb") {
          move.h = Math.round((e.offsetY - this.selectedItem.y) / 8) * 8
        }
        if (this.dragging === "resize-rb") {
          move.w = Math.round((e.offsetX - this.selectedItem.x) / 8) * 8
          move.h = Math.round((e.offsetY - this.selectedItem.y) / 8) * 8
        }
        this.$store.commit("resizeItem", move);
      }
    },
    stopDrag() {
      if (this.dragging !== "none") {
        this.dragging = "none";
        //this.$store.commit("selectItem", -1);
      }
    },
    openEditor(index: number){
      this.$store.commit("openEditor", index)
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

.handle{
  fill: white;
  stroke: green;
}

.selection{
  fill: none;
  stroke: green;
}

</style>
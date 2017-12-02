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
    <path class="connector" :d="connectorPath"></path>
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
      resizeType: <string[]>[],
      dragOffset: {
        x: 0,
        y: 0
      },
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
      /*
        lt ct rt
        lc    rc
        lb cb rb
      */
      return [
        {type: ["left", "top"], x: 0, y: 0, size: size},
        {type: ["center", "top"], x: item.w / 2, y: 0, size: size},
        {type: ["right", "top"], x: item.w, y: 0, size: size},
        {type: ["left", "center"], x: 0, y: item.h / 2, size: size},
        {type: ["right", "center"], x: item.w, y: item.h / 2, size: size},
        {type: ["left", "bottom"], x: 0, y: item.h, size: size},
        {type: ["center", "bottom"], x: item.w / 2, y: item.h, size: size},
        {type: ["right", "bottom"], x: item.w, y: item.h, size: size},
      ]
    },
    connectorPath(){
      const items: FusenItem[] = this.items
      const start = {
        x: items[0].x + items[0].w,
        y: items[0].y + items[0].h / 2,
      }
      const end = {
        x: items[1].x,
        y: items[1].y + items[1].h / 2,
      }
      const handleLength = 50
      if(items.length > 0){
        return `M${start.x},${start.y} C${start.x + handleLength},${start.y} ${end.x - handleLength},${end.y} ${end.x},${end.y}`
      }
      return ""
    }
  },
  methods: {
    resizePoint(type: string[]) {
        this.dragging = "resize";
        this.resizeType = type;
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
    onResize(e: DragEvent){
        let move = {
          x: this.selectedItem.x,
          y: this.selectedItem.y,
          w: this.selectedItem.w,
          h: this.selectedItem.h
        }
        if (this.resizeType[0] === "left") {
          move.x = gridRound(e.offsetX)
          move.w = move.w - move.x + this.selectedItem.x
        }
        if (this.resizeType[0] === "right") {
          move.w = gridRound(e.offsetX - this.selectedItem.x)
        }
        if (this.resizeType[1] === "bottom") {
          move.h = gridRound(e.offsetY - this.selectedItem.y)
        }
        if (this.resizeType[1] === "top") {
          move.y = gridRound(e.offsetY)
          move.h = move.h - move.y + this.selectedItem.y
        }
        this.$store.commit("resizeItem", move);
    },
    onDrag(e: DragEvent) {
      if (this.dragging === "move") {
        //差分値を基点に反映
        this.$store.commit("moveItem", {
          x: gridRound(e.offsetX - this.dragOffset.x),
          y: gridRound(e.offsetY - this.dragOffset.y)
        });
      }
      if(this.dragging === "resize"){
        this.onResize(e)
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

function gridRound(value: number){
  return Math.round(value / 8) * 8
}
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

.connector{
  fill: none;
  stroke: black;
  stroke-width: 3px;
}

</style>

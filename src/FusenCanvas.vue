<template>
  <svg id="canv" width="800" height="800" @pointermove="onDrag" @pointerup="stopDrag">
    <filter id="drop-shadow" width="150%" height="150%">
        <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="2" />
        <feOffset result="offsetBlur" dx="2" dy="2" />
        <feBlend in="SourceGraphic" in2="offsetBlur" mode="normal" />
    </filter>
    <path v-for="connector in connectors" :key="connector.id" class="connector" :d="connectorPath(connector)"></path>
    <fusen-group v-for="(item, index) in items" :index="index" :key="item.id" :item="item" @selected="startDrag" @open="openEditor"></fusen-group>
    <fusen-selection :selected-item="selectedItem" @resize="resizePoint" @arrow="createArrow"></fusen-selection>
    <path v-if="arrowPreview" class="connector connector--preview" :d="connectorPath(arrowPreview)"></path>
    <g v-if="arrowPreview">
      <g v-for="(item, index) in items" v-show="index !== selectedIndex" :key="item.id" :transform="transformStr(item)">
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 'top')" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 'top')" :cx="item.w / 2" :cy="-20" r="10"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 'left')" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 'left')" :cx="-20" :cy="item.h / 2" r="10"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 'right')" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 'right')" :cx="item.w + 20" :cy="item.h / 2" r="10"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 'bottom')" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 'bottom')" :cx="item.w / 2" :cy="item.h + 20" r="10"></circle>
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import FusenGroup from "./FusenGroup.vue";
import FusenSelection from "./FusenSelection.vue";
import { FusenItem, Connector } from "./store";
import { mapMutations } from "vuex";

function getConnectPosition(
  x: number,
  y: number,
  w: number,
  h: number,
  position: string,
  offset: number
) {
  let px = x;
  let py = y;

  if (position === "left") {
    px -= offset;
    py = y + h / 2;
  }
  if (position === "top") {
    px = x + w / 2;
    py -= offset;
  }
  if (position === "right") {
    px = x + w + offset;
    py = y + h / 2;
  }
  if (position === "bottom") {
    px = x + w / 2;
    py = y + h + offset;
  }

  return {
    x: px,
    y: py
  };
}

export default Vue.extend({
  data() {
    return {
      dragging: "none",
      resizeType: <string[]>[],
      dragOffset: {
        x: 0,
        y: 0
      },
      arrowPreview: null as null | Connector
    };
  },
  computed: {
    selectedIndex(): number {
      return this.$store.state.selectedIndex;
    },
    selectedItem(): FusenItem {
      return this.$store.state.items[this.$store.state.selectedIndex];
    },
    items(): FusenItem[] {
      return this.$store.state.items;
    },
    connectors(): Connector[] {
      return this.$store.state.connectors;
    }
  },
  methods: {
    makeArrow(id: number, type: string) {
      if (this.arrowPreview) {
        this.arrowPreview.to = id;
        this.arrowPreview.toPosition = type;
        this.$store.commit("createArrow", this.arrowPreview);
      }
    },
    removeArrow(ev: PointerEvent) {
      if (this.arrowPreview) {
        this.arrowPreview.to = -1;
      }
    },
    addArrow(id: number, type: string) {
      if (this.arrowPreview) {
        this.arrowPreview.to = id;
        this.arrowPreview.toPosition = type;
      }
    },
    transformStr(item: FusenItem) {
      return `translate(${item.x},${item.y})`;
    },
    createArrow(payload: any) {
      this.arrowPreview = {
        id: -1,
        from: this.selectedItem.id,
        fromPosition: payload.type,
        to: -1,
        toPoint: [payload.event.clientX, payload.event.clientY],
        toPosition: "none",
        arrowType: ["none", "none"]
      };
    },
    connectorPath(connector: Connector) {
      const items: FusenItem[] = this.items;

      const fromItem = items.filter(item => {
        return connector.from === item.id;
      })[0];
      const toItem = items.filter(item => {
        return connector.to === item.id;
      })[0];

      const start = getConnectPosition(
        fromItem.x,
        fromItem.y,
        fromItem.w,
        fromItem.h,
        connector.fromPosition,
        0
      );
      const startHandle = getConnectPosition(
        fromItem.x,
        fromItem.y,
        fromItem.w,
        fromItem.h,
        connector.fromPosition,
        50
      );

      if (!toItem) {
        return `M${start.x},${start.y} C${startHandle.x},${startHandle.y} ${connector
          .toPoint[0]},${connector.toPoint[1]} ${connector
          .toPoint[0]},${connector.toPoint[1]}`;
      }

      const endHandle = getConnectPosition(
        toItem.x,
        toItem.y,
        toItem.w,
        toItem.h,
        connector.toPosition,
        50
      );
      const end = getConnectPosition(
        toItem.x,
        toItem.y,
        toItem.w,
        toItem.h,
        connector.toPosition,
        0
      );

      let deg = 0
      if(connector.toPosition === "top"){
        deg = 90 * 3
      }
      if(connector.toPosition === "left"){
        deg = 90 * 2
      }
      if(connector.toPosition === "bottom"){
        deg = 90 * 1
      }
      const pl = {
        x: end.x + Math.cos((deg + 45) * Math.PI / 180) * 16,
        y: end.y + Math.sin((deg + 45) * Math.PI / 180) * 16,
      }
      const pr = {
        x: end.x + Math.cos((deg - 45) * Math.PI / 180) * 16,
        y: end.y + Math.sin((deg - 45) * Math.PI / 180) * 16,
      }

      
      if (items.length > 0) {
        return `M${start.x},${start.y} C${startHandle.x},${startHandle.y} ${endHandle.x},${endHandle.y} ${end.x},${end.y} L ${pl.x},${pl.y} M ${end.x},${end.y} L ${pr.x},${pr.y}`;
      }
      return "";
    },
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
    onResize(e: DragEvent) {
      let move = {
        x: this.selectedItem.x,
        y: this.selectedItem.y,
        w: this.selectedItem.w,
        h: this.selectedItem.h
      };
      if (this.resizeType[0] === "left") {
        move.x = gridRound(e.offsetX);
        move.w = move.w - move.x + this.selectedItem.x;
      }
      if (this.resizeType[0] === "right") {
        move.w = gridRound(e.offsetX - this.selectedItem.x);
      }
      if (this.resizeType[1] === "bottom") {
        move.h = gridRound(e.offsetY - this.selectedItem.y);
      }
      if (this.resizeType[1] === "top") {
        move.y = gridRound(e.offsetY);
        move.h = move.h - move.y + this.selectedItem.y;
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
      if (this.dragging === "resize") {
        this.onResize(e);
      }
      if (this.arrowPreview) {
        Vue.set(this.arrowPreview.toPoint, 0, e.offsetX);
        Vue.set(this.arrowPreview.toPoint, 1, e.offsetY);
      }
    },
    stopDrag() {
      if (this.dragging !== "none") {
        this.dragging = "none";
        //this.$store.commit("selectItem", -1);
      }
      if (this.arrowPreview) {
        this.arrowPreview = null;
      }
    },
    openEditor(index: number) {
      this.$store.commit("openEditor", index);
    }
  },
  components: {
    FusenGroup,
    FusenSelection
  }
});

function gridRound(value: number) {
  return Math.round(value / 8) * 8;
}
</script>

<style>
svg {
  touch-action: none;
  background: #fcc;
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

.item {
  fill: white;
  stroke: black;
}

.connector {
  fill: none;
  stroke: black;
  stroke-width: 3px;
}
.connector--preview {
  stroke: green;
}

.arrow-attach {
  fill: rgba(255, 255, 255, 0.5);
}
</style>

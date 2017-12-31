<template>
  <svg id="canv" width="800" height="800" @pointermove="onDrag" @pointerup="stopDrag">
    <filter id="drop-shadow" width="150%" height="150%">
        <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="2" />
        <feOffset result="offsetBlur" dx="2" dy="2" />
        <feBlend in="SourceGraphic" in2="offsetBlur" mode="normal" />
    </filter>
    <g>
      <g v-for="connector in connectors" :key="connector.id" >
        <path class="connector" :d="connectorPath(connector)"></path>
        <path class="connector__arrow" :d="connectorPathEnd(connector)"></path>
      </g>
    </g>
    <fusen-group v-for="(item, index) in items" :index="index" :key="item.id" :item="item" @selected="startDrag" @open="openEditor"></fusen-group>
    <fusen-selection :selected-item="selectedItem" @resize="resizePoint" @arrow="createArrow"></fusen-selection>
    <path v-if="arrowPreview" class="connector connector--preview" :d="connectorPath(arrowPreview)"></path>
    <g v-if="arrowPreview">
      <g v-for="(item, index) in items" v-show="index !== selectedIndex" :key="index" :transform="transformStr(item)">
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 270)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 270)" :cx="item.w / 2" :cy="0" r="16"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 180)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 180)" :cx="0" :cy="item.h / 2" r="16"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 0)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 0)" :cx="item.w" :cy="item.h / 2" r="16"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 90)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 90)" :cx="item.w / 2" :cy="item.h" r="16"></circle>
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

const CONNECTOR_END_OFFSET = 8

function getConnectPosition(
  x: number,
  y: number,
  w: number,
  h: number,
  position: number,
  offset: number
) {
  let px = x;
  let py = y;

  if (position === 180) {
    px -= offset;
    py = y + h / 2;
  }
  if (position === 270) {
    px = x + w / 2;
    py -= offset;
  }
  if (position === 0) {
    px = x + w + offset;
    py = y + h / 2;
  }
  if (position === 90) {
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
    makeArrow(id: number, type: number) {
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
    addArrow(id: number, type: number) {
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
        toPosition: 0,
        arrowType: ["none", "none"]
      };
    },
    connectorPathEnd(connector: Connector) {
      const items: FusenItem[] = this.items;
      const toItem = items.filter(item => {
        return connector.to === item.id;
      })[0];
      
      const end = getConnectPosition(
        toItem.x,
        toItem.y,
        toItem.w,
        toItem.h,
        connector.toPosition,
        CONNECTOR_END_OFFSET
      );
      let deg = connector.toPosition;
      const pl = {
        x: end.x + Math.cos((deg + 45) * Math.PI / 180) * 16,
        y: end.y + Math.sin((deg + 45) * Math.PI / 180) * 16
      };
      const pr = {
        x: end.x + Math.cos((deg - 45) * Math.PI / 180) * 16,
        y: end.y + Math.sin((deg - 45) * Math.PI / 180) * 16
      };
      
      return `M ${end.x},${end.y} L ${pl.x},${pl.y} M ${end.x},${end.y} L ${pr.x},${pr.y}`
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

      let startHandle = getConnectPosition(
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

      const end = getConnectPosition(
        toItem.x,
        toItem.y,
        toItem.w,
        toItem.h,
        connector.toPosition,
        CONNECTOR_END_OFFSET
      );

      let distance = Math.pow(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
        0.5
      );
      if (distance > 200) {
        distance = 200;
      }

      startHandle = getConnectPosition(
        fromItem.x,
        fromItem.y,
        fromItem.w,
        fromItem.h,
        connector.fromPosition,
        distance / 2
      );

      const endHandle = getConnectPosition(
        toItem.x,
        toItem.y,
        toItem.w,
        toItem.h,
        connector.toPosition,
        distance / 2
      );

      if (items.length > 0) {
        return `M${start.x},${start.y} C${startHandle.x},${startHandle.y} ${endHandle.x},${endHandle.y} ${end.x},${end.y}`;
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

.connector__arrow {
  fill: none;
  stroke: black;
  stroke-width: 3px;
}

.connector--preview {
  stroke: green;
}

.arrow-attach {
  fill: rgba(200, 255, 200, 0.5);
}
</style>

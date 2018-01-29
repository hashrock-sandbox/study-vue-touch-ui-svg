<template>
  <svg id="canv" width="800" height="800" @pointermove="onDrag" @pointerup="stopDrag">
    <g>
      <g v-for="connector in connectors" :key="connector.id" >
        <connector-path :items="items" :connector="connector"></connector-path>
      </g>
    </g>
    <fusen-group v-for="(item, index) in items" :index="index" :key="item.id" :item="item" @selected="startDrag" @open="openEditor"></fusen-group>
    <fusen-selection :selected-item="selectedItem" @resize="resizePoint" @arrow="createArrow"></fusen-selection>

    <connector-path v-if="arrowPreview" :items="items" :is-preview="true" :connector="arrowPreview"></connector-path>

    <g v-if="arrowPreview">
      <g v-for="(item, index) in items" v-show="index !== selectedIndex" :key="index" :transform="transformStr(item)">
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 270)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 270)" :cx="item.w / 2" :cy="0" r="16"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 180)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 180)" :cx="0" :cy="item.h / 2" r="16"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 0)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 0)" :cx="item.w" :cy="item.h / 2" r="16"></circle>
        <circle class="arrow-attach" @pointerup="makeArrow(item.id, 90)" @pointerleave="removeArrow" @pointermove="addArrow(item.id, 90)" :cx="item.w / 2" :cy="item.h" r="16"></circle>
      </g>
    </g>

    <g :transform="arrowMenuPosition" v-if="showArrowMenu" @pointerleave="onLeaveArrowMenu">
      <rect x="-60" y="-60" width="120" height="90" fill="rgba(0,0,0,0)"></rect>
      <circle @click="selectArrowItem('remove')" class="arrow-menu-item" r=20 :cx="-40" :cy="-40"></circle>
      <circle @click="selectArrowItem('none')" class="arrow-menu-item" r=20 :cx="0" :cy="-40"></circle>
      <circle @click="selectArrowItem('arrow')" class="arrow-menu-item" r=20 :cx="40" :cy="-40"></circle>
      <g transform="translate(-50, -50)" style="pointer-events: none;">
        <path d="M0,0 L20,20 M20,0 L0,20" stroke-width="2" stroke="black"></path>
      </g>
      <g transform="translate(-10, -50)" style="pointer-events: none;">
        <path d="M-10,10 L15,10" stroke-width="2" stroke="black"></path>
      </g>
      <g transform="translate(30, -50)" style="pointer-events: none;">
        <path d="M-10,10 L15,10 L10,5 M15,10 L10,15" stroke-width="2" stroke="black" fill="none"></path>
      </g>      
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import FusenGroup from "./FusenGroup.vue";
import FusenSelection from "./FusenSelection.vue";
import ConnectorPath from "./ConnectorPath.vue";
import { FusenItem, Connector, Point } from "./shapes";
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
    },
    selectedConnectorId(): Connector[] {
      return this.$store.state.selectedConnectorId;
    },
    showArrowMenu(): boolean {
      return this.$store.state.showArrowMenu;
    },
    arrowMenuPosition() {
      const end: Point = this.$store.state.arrowMenuPosition;
      return `translate(${end.x},${end.y})`;
    }
  },
  methods: {
    selectArrowItem(type: string) {
      if (type === "remove") {
        this.$store.commit("removeConnector", this.selectedConnectorId);
      }
      if (type === "arrow") {
        this.$store.commit("changeConnectorType", {
          id: this.selectedConnectorId,
          type: "arrow"
        });
      }
      if (type === "none") {
        this.$store.commit("changeConnectorType", {
          id: this.selectedConnectorId,
          type: "none"
        });
      }
      this.onLeaveArrowMenu();
    },
    onLeaveArrowMenu() {
      this.$store.commit("showArrowTypeMenu", {
        showArrowMenu: false,
        arrowMenuPosition: {
          x: 0,
          y: 0
        }
      });
    },
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
    FusenSelection,
    ConnectorPath
  }
});

function gridRound(value: number) {
  return Math.round(value / 8) * 8;
}
</script>

<style>
svg {
  touch-action: none;
  background: #f3f3f3;
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

.arrow-attach {
  fill: rgba(200, 255, 200, 0.5);
}

.arrow-menu-item {
  fill: white;
  stroke: black;
  stroke-width: 1px;
  z-index: 10000;
}

.arrow-menu-item:hover {
  fill: gray;
}

rect {
  shape-rendering: crispEdges;
}
</style>

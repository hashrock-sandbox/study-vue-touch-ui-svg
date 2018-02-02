<template>
  <g>
    <path class="connector" :class="{'connector--preview' : isPreview}" :d="connectorPath"></path>
    <path v-if="!isPreview && isEndArrow" class="connector__arrow" :d="connectorPathEnd"></path>
    <circle fill="rgba(0,0,0,0)" v-if="!isPreview" r=20 :cx="positionEnd.x" :cy="positionEnd.y" @pointerenter="onEnterConnectorEnd" @pointerleave="onLeaveConnectorEnd"></circle>
  </g>
</template>

<script lang="ts">
import Vue from "vue";

import { FusenItem, Connector, Point, getConnectPosition } from "./shapes";

export default Vue.extend({
  props: {
    connector: Object,
    isPreview: Boolean,
    items: Array
  },
  data() {
    return {};
  },
  computed: {
    isEndArrow(): boolean {
      return this.connector.arrowType[1] === "arrow";
    },
    fromItem(): FusenItem {
      const connector: Connector = this.connector;
      const items: FusenItem[] = this.items;

      return items.filter(item => {
        return connector.from === item.id;
      })[0];
    },
    toItem() {
      const connector: Connector = this.connector;
      const items: FusenItem[] = this.items;

      return items.filter(item => {
        return connector.to === item.id;
      })[0];
    },
    positionStart(): Point {
      const fromItem: FusenItem = this.fromItem;
      return getConnectPosition(fromItem, this.connector.fromPosition, 0);
    },
    positionStartHandle(): Point {
      const fromItem: FusenItem = this.fromItem;
      return getConnectPosition(
        fromItem,
        this.connector.fromPosition,
        this.distance / 2
      );
    },
    positionEnd(): Point {
      const toItem: FusenItem = this.toItem;

      if (toItem) {
        return getConnectPosition(toItem, this.connector.toPosition, 0);
      }

      return { x: this.connector.toPoint[0], y: this.connector.toPoint[1] };
    },
    positionEndHandle(): Point {
      const toItem: FusenItem = this.toItem;

      if (toItem) {
        return getConnectPosition(
          toItem,
          this.connector.toPosition,
          this.distance / 2
        );
      }

      return { x: this.connector.toPoint[0], y: this.connector.toPoint[1] };
    },
    distance() {
      const start: Point = this.positionStart;
      const end: Point = this.positionEnd;

      let distance = Math.pow(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
        0.5
      );
      if (distance > 200) {
        distance = 200;
      }
      return distance;
    },
    connectorPath() {
      const connector: Connector = this.connector;
      const items: FusenItem[] = this.items;
      if (items.length === 0) {
        return "";
      }

      const toItem: FusenItem = this.toItem;
      const fromItem: FusenItem = this.fromItem;
      const start: Point = this.positionStart;
      const startHandle: Point = this.positionStartHandle;
      const end: Point = this.positionEnd;
      const endHandle: Point = this.positionEndHandle;

      return `M${start.x},${start.y} C${startHandle.x},${startHandle.y} ${
        endHandle.x
      },${endHandle.y} ${end.x},${end.y}`;
    },
    connectorPathEnd() {
      const connector: Connector = this.connector;
      const toItem = this.toItem;

      const end: Point = this.positionEnd;
      let deg = connector.toPosition;
      const pl = {
        x: end.x + Math.cos((deg + 45) * Math.PI / 180) * 16,
        y: end.y + Math.sin((deg + 45) * Math.PI / 180) * 16
      };
      const pr = {
        x: end.x + Math.cos((deg - 45) * Math.PI / 180) * 16,
        y: end.y + Math.sin((deg - 45) * Math.PI / 180) * 16
      };

      return `M ${end.x},${end.y} L ${pl.x},${pl.y} M ${end.x},${end.y} L ${
        pr.x
      },${pr.y}`;
    }
  },
  methods: {
    onEnterConnectorEnd() {
      const end: Point = this.positionEnd;
      this.$store.commit("showArrowTypeMenu", {
        showArrowMenu: true,
        arrowMenuPosition: {
          x: end.x,
          y: end.y
        },
        selectedConnectorId: this.connector.id
      });
    },
    onLeaveConnectorEnd() {}
  }
});
</script>

<style>
.connector {
  fill: none;
  stroke: black;
  stroke-width: 3px;
}
.connector--preview {
  stroke: green;
}

.connector__arrow {
  fill: none;
  stroke: black;
  stroke-width: 3px;
}
</style>

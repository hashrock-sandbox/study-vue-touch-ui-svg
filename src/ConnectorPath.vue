<template>
  <g>
    <path class="connector" :class="{'connector--preview' : isPreview}" :d="connectorPath"></path>
    <path v-if="!isPreview" class="connector__arrow" :d="connectorPathEnd"></path>
    <circle r=20></circle>
  </g>
</template>

<script lang="ts">
import Vue from "vue";

import { FusenItem, Connector } from "./store";

const CONNECTOR_END_OFFSET = 8;

interface Point {
  x: number;
  y: number;
}

function getConnectPosition(
  x: number,
  y: number,
  w: number,
  h: number,
  position: number,
  offset: number
): Point {
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
  props: {
    connector: Object,
    isPreview: Boolean,
    items: Array
  },
  computed: {
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
      return getConnectPosition(
        fromItem.x,
        fromItem.y,
        fromItem.w,
        fromItem.h,
        this.connector.fromPosition,
        0
      );
    },
    positionStartHandle(): Point {
      const fromItem: FusenItem = this.fromItem;
      return getConnectPosition(
        fromItem.x,
        fromItem.y,
        fromItem.w,
        fromItem.h,
        this.connector.fromPosition,
        this.distance / 2
      );
    },
    positionEnd(): Point {
      const toItem: FusenItem = this.toItem;

      if (toItem) {
        return getConnectPosition(
          toItem.x,
          toItem.y,
          toItem.w,
          toItem.h,
          this.connector.toPosition,
          CONNECTOR_END_OFFSET
        );
      }

      return {
        x: this.connector.toPoint[0],
        y: this.connector.toPoint[1]
      };
    },
    positionEndHandle(): Point {
      const toItem: FusenItem = this.toItem;

      if (toItem) {
        return getConnectPosition(
          toItem.x,
          toItem.y,
          toItem.w,
          toItem.h,
          this.connector.toPosition,
          this.distance / 2
        );
      }

      return {
        x: this.connector.toPoint[0],
        y: this.connector.toPoint[1]
      };
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

      return `M${start.x},${start.y} C${startHandle.x},${startHandle.y} ${endHandle.x},${endHandle.y} ${end.x},${end.y}`;
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

      return `M ${end.x},${end.y} L ${pl.x},${pl.y} M ${end.x},${end.y} L ${pr.x},${pr.y}`;
    }
  },
  methods: {}
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

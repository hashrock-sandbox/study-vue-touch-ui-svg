<template>
  <div id="app">
    <!-- mousemove, touchmove, mouseleaveはコンテナに置かないと不便 -->
    <svg id="canv" width="400" height="400" @pointermove="onDrag" @pointerup="stopDrag" @pointerleave="stopDrag">
      <rect v-for="(item, index) in items" class="item" @pointerdown="startDrag($event, index)" @pointerup="stopDrag" :x="item.x" :y="item.y" :width="item.w" :height="item.h">
      </rect>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        dragging: "none",
        selectedIndex: -1,
        dragOffset: {
          x: 0,
          y: 0
        },
        items: [
          {
            x: 0,
            y: 0,
            w: 100,
            h: 30
          },
          {
            x: 110,
            y: 110,
            w: 50,
            h: 80
          },
        ]
      }
    },
    computed: {
      selectedItem(){
        return this.items[this.selectedIndex]
      }
    },
    methods: {
      startDrag(e, index) {
        //e = e.changedTouches ? e.changedTouches[0] : e
        this.dragging = "move"
        this.selectedIndex = index
        //ページ左上とオブジェクト左上の差分から、ドラッグ開始位置（オブジェクト相対座標）を取得
        this.dragOffset.x = e.offsetX - this.selectedItem.x
        this.dragOffset.y = e.pageY - this.selectedItem.y

        if (e.offsetX - this.selectedItem.x > this.selectedItem.w - 20) {
          this.dragging = "resize"
        }
      },
      onDrag(e) {
        //e = e.changedTouches ? e.changedTouches[0] : e
        if (this.dragging === "move") {
          //差分値を基点に反映
          this.selectedItem.x = Math.round((e.offsetX - this.dragOffset.x) / 8) * 8
          this.selectedItem.y = Math.round((e.pageY - this.dragOffset.y) / 8) * 8
        }
        if (this.dragging === "resize") {
          this.selectedItem.w = Math.round((e.offsetX - this.selectedItem.x) / 8) * 8
          if (this.selectedItem.w < 8) {
            this.selectedItem.w = 8;
          }
        }
      },
      stopDrag() {
        if (this.dragging !== "none") {
          this.dragging = "none"
          this.selectedIndex = -1;
        }
      }
    }
  }
</script>

<style>
  body {
    background: #eee;
    margin: 0;
  }

  svg {
    background: white;
    /*opacity: 0.9;*/
  }

  #app {
    text-align: center;
    color: #2c3e50;
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
  .item{
    fill: white;
    stroke: black;
  }

  .item:hover {
    opacity: 0.5;
  }
</style>
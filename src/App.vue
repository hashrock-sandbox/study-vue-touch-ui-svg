<template>
  <div id="app">
    <div class="hint" v-for="hint in hints" :style="{'left': hint + 'px'}"></div>
    <!-- mousemove, touchmove, mouseleaveはコンテナに置かないと不便 -->
    <svg id="canv" width="400" height="400" @pointermove="onDrag" @pointerup="stopDrag" @pointerleave="stopDrag">
      <rect class="item" :class="dragging" @pointerdown="startDrag" @pointerup="stopDrag" :x="c.x" :y="c.y" :width="c.w" :height="c.h"></rect>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        dragging: "none",
        start: {
          x: 0,
          y: 0
        },
        c: {
          x: 0,
          y: 0,
          w: 100,
          h: 30
        },
        hints: [
        ]
      }
    },
    methods: {
      startDrag(e) {
        //e = e.changedTouches ? e.changedTouches[0] : e
        this.dragging = "move"
        //ページ左上とオブジェクト左上の差分から、ドラッグ開始位置（オブジェクト相対座標）を取得
        this.start.x = e.offsetX - this.c.x
        this.start.y = e.pageY - this.c.y

        if(e.offsetX - this.c.x > this.c.w - 20){
          this.dragging = "resize"
        }
      },
      over(e){
        if (this.dragging === "none") {

        }
      },
      leave(e){

      },
      onDrag(e) {
        //e = e.changedTouches ? e.changedTouches[0] : e
       if (this.dragging === "move") {
          //差分値を基点に反映
          this.c.x = Math.round((e.offsetX - this.start.x) / 8) * 8
          this.c.y = Math.round((e.pageY - this.start.y) / 8) * 8
        }
        this.hints = [
          this.c.x,
          e.offsetX
        /*
          this.start.x,
          this.start.x - document.getElementById("canv").getBoundingClientRect().left,
          this.c.x
          */
        ]
        if (this.dragging === "resize") {
          this.c.w = Math.round((e.offsetX - this.c.x) / 8) * 8
          if(this.c.w < 8){
            this.c.w = 8;
          }
        }
      },
      stopDrag() {
        if (this.dragging !== "none") {
          this.dragging = "none"
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

  .hint{
    width: 1px;
    height: 100px;
    background: red;
    position: absolute;
    z-index: -100;
  }
  .move{
    fill: gray;
  }
  .hover{
    fill: yellow;
  }

  .resize-hover{
    fill: blue;
  }
  
  .item:hover{
    opacity: 0.9;
  }

  </style>
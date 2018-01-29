<template>
  <div id="app">
    <link rel="stylesheet" href="./bootstrap-reboot.css">
    <!-- mousemove, touchmove, mouseleaveはコンテナに置かないと不便 -->
    <fusen-canvas></fusen-canvas>
    <div class="editor" v-if="editing">
      <div class="editor__frame" :style="styleObj">
        <textarea class="editor__textarea" v-model="editingText" @blur="editItem" autofocus></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FusenCanvas from "./FusenCanvas.vue";
import { FusenItem } from "./shapes";

export default Vue.extend({
  computed: {
    editing(): boolean {
      return this.$store.state.editing;
    },
    selectedItem(): FusenItem {
      return this.$store.state.items[this.$store.state.selectedIndex];
    },
    styleObj() {
      const selected: FusenItem = this.selectedItem;
      if (this.selectedItem) {
        return {
          top: selected.y + "px",
          left: selected.x + "px",
          width: selected.w + "px",
          height: selected.h + "px"
        };
      }
      return {};
    },
    editingText: {
      get(): string {
        return this.$store.state.editingText;
      },
      set(value: string) {
        this.$store.commit("updateEditor", value);
      }
    }
  },
  methods: {
    editItem() {
      this.$store.commit("editItem", this.editingText);
    }
  },
  components: {
    FusenCanvas
  },
  watch: {
    editing(value) {
      if (value) {
        Vue.nextTick(() => {
          const el = <HTMLTextAreaElement>this.$el.querySelector(
            ".editor__textarea"
          );
          el.focus();
        });
      }
    }
  }
});
</script>

<style>
body {
  background: #eee;
  margin: 0;
}

#app {
  width: 800px;
  height: 800px;
  position: relative;
}

.editor {
  top: 0;
  left: 0;
  width: 800px;
  height: 800px;
  position: absolute;
}

.editor__frame {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 300px;
  height: 300px;
}
.editor__textarea {
  flex: 1;
  height: 100%;
  padding: 0.5rem;
  border: 1px solid blue;
}
</style>

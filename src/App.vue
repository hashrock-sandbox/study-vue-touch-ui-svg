<template>
  <div id="app">
    <link rel="stylesheet" href="./bootstrap-reboot.css">
    <!-- mousemove, touchmove, mouseleaveはコンテナに置かないと不便 -->
    <fusen-canvas
      :items="items"
      :selectedIndex="selectedIndex" 
      :selectedConnectorId="selectedConnectorId"
      :connectors="connectors"
      :showArrowMenu="showArrowMenu"
      :arrowMenuPosition="arrowMenuPosition"
      @selectItem="selectItem"
      @openEditor="openEditor"
      @createArrow="createArrow"
      @updateArrowMenu="updateArrowMenu"
      @removeConnector="removeConnector"></fusen-canvas>
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
import { FusenItem, Connector, Point } from "./shapes";

export default Vue.extend({
  props: {
    input: String
  },
  data() {
    return {
      selectedIndex: -1,
      editingText: "",
      showArrowMenu: false,
      selectedConnectorId: -1,
      arrowMenuPosition: {
        x: 0,
        y: 0
      },
      items: [] as FusenItem[],
      connectors: [] as Connector[],
      editing: false
    };
  },
  computed: {
    selectedItem(): FusenItem {
      return this.items[this.selectedIndex];
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
    }
  },
  methods: {
    editItem() {
      this.selectedItem.text = this.editingText;
      this.editingText = "";
      this.editing = false;
    },
    moveItem() {},
    resizeItem() {},
    selectItem(index: number) {
      this.selectedIndex = index;
    },
    openEditor(index: number) {
      this.editing = true;
      this.selectedIndex = index;
      this.editingText = this.selectedItem.text;
    },
    updateEditor() {},
    createArrow(payload: Connector) {
      // idは全connector.idのmax + 1
      payload.id =
        this.connectors
          .map(item => item.id)
          .reduce((x, y) => (x > y ? x : y), 0) + 1;
      this.connectors.push(payload);
    },
    updateArrowMenu(payload: any) {
      this.showArrowMenu = payload.showArrowMenu;
      this.arrowMenuPosition = payload.arrowMenuPosition;
      this.selectedConnectorId = payload.selectedConnectorId;
    },
    showArrowTypeMenu() {},
    removeConnector(id: number) {
      this.connectors = this.connectors.filter(item => {
        return item.id !== id;
      });
    },
    addFusenItem(payload: FusenItem) {
      this.items.push(payload);
      this.$emit("change", this.items);
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
  },
  mounted() {
    // const item = new FusenItem();
    // item.x = 10;
    // item.y = 10;
    // item.w = 200;
    // item.h = 100;
    // item.text = "Hello\nWorld";
    // item.id = 0;

    // const item2 = new FusenItem();
    // item2.x = 210;
    // item2.y = 210;
    // item2.w = 300;
    // item2.h = 150;
    // item2.text = "はろー";
    // item2.id = 1;

    // this.addFusenItem(item);
    // this.addFusenItem(item2);
    this.$watch(
      "input",
      value => {
        this.items = value.split("\n").map((line: string, i: number) => {
          const tokens = line.split(" ");
          const nums = tokens[1].split(",");

          let item = new FusenItem();
          item.text = tokens[0].replace(/\\n/g, "\n");
          item.x = parseInt(nums[0], 10);
          item.y = parseInt(nums[1], 10);
          item.w = parseInt(nums[2], 10);
          item.h = parseInt(nums[3], 10);
          item.id = i;

          return item;
        });
      },
      { immediate: true }
    );

    this.$watch(
      "items",
      () => {
        this.$emit("change", this.items);
      },
      { deep: true }
    );
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

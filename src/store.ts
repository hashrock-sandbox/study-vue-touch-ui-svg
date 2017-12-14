import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface FusenItem {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  id: number;
}

export default new Vuex.Store({
  state: {
    selectedIndex: -1,
    editingText: "",
    items: <FusenItem[]>[
      {
        x: 10,
        y: 10,
        w: 200,
        h: 100,
        text: "Hello\nWorld",
        id: 0
      },
      {
        x: 210,
        y: 210,
        w: 300,
        h: 150,
        text: "はろー",
        id: 1
      },
      {
        x: 310,
        y: 310,
        w: 200,
        h: 200,
        text: "TestTest",
        id: 2
      }

    ],
    connectors: [{
      id: 0,
      from: 0,
      to: 1,
      arrowType: ["none", "none"]
    },
    {
      id: 1,
      from: 1,
      to: 2,
      arrowType: ["none", "none"]
    }],
    editing: false
  },
  mutations: {
    moveItem(state, payload) {
      state.items[state.selectedIndex].x = payload.x
      state.items[state.selectedIndex].y = payload.y
    },
    resizeItem(state, payload) {
      state.items[state.selectedIndex].x = payload.x
      state.items[state.selectedIndex].y = payload.y
      state.items[state.selectedIndex].w = payload.w
      state.items[state.selectedIndex].h = payload.h
    },
    selectItem(state, index) {
      state.selectedIndex = index
    },
    openEditor(state, index) {
      state.editing = true
      state.selectedIndex = index
      state.editingText = state.items[index].text
    },
    editItem(state, text) {
      state.items[state.selectedIndex].text = text
      state.editingText = ""
      state.editing = false
    },
    updateEditor(state, value){
      state.editingText = value
    }

  }
})
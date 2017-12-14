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
  fromPosition: string;
  toPosition: string;
}

export interface Connector {
  id: number;
  from: number;
  fromPosition: string;
  to: number;
  toPosition: string;
  //変更する？
  arrowType: string[];
}

export default new Vuex.Store({
  state: {
    selectedIndex: -1,
    editingText: "",
    items: [
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

    ] as FusenItem[],
    connectors: [{
      id: 0,
      from: 0,
      fromPosition: "top",
      to: 1,
      toPosition: "bottom",
      arrowType: ["none", "none"]
    },
    {
      id: 1,
      from: 1,
      fromPosition: "left",
      to: 2,
      toPosition: "right",
      arrowType: ["none", "none"]
    }] as Connector[],
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
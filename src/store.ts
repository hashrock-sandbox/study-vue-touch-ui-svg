import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface FusenItem {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
}

export default new Vuex.Store({
  state: {
    selectedIndex: -1,
    items: <FusenItem[]>[
      {
        x: 10,
        y: 10,
        w: 200,
        h: 100,
        text: "Hello\nWorld"
      },
      {
        x: 210,
        y: 210,
        w: 300,
        h: 150,
        text: "はろー"
      }
    ],
    editing: false
  },
  mutations: {
    moveItem(state, payload) {
      state.items[state.selectedIndex].x = payload.x
      state.items[state.selectedIndex].y = payload.y
    },
    resizeItem(state, payload) {
      state.items[state.selectedIndex].w = payload.w
      state.items[state.selectedIndex].h = payload.h
    },
    selectItem(state, index) {
      state.selectedIndex = index
    },
    openEditor(state) {
      state.editing = true
    },
    editItem(state, text) {
      state.items[state.selectedIndex].text = text
    }

  }
})
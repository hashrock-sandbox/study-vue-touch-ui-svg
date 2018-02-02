import Vue from "vue";
import Vuex from "vuex";
import { FusenItem, Connector, Point } from "./shapes";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
  },
  mutations: {
    moveItem(state, payload) {
      state.items[state.selectedIndex].x = payload.x;
      state.items[state.selectedIndex].y = payload.y;
    },
    resizeItem(state, payload) {
      state.items[state.selectedIndex].x = payload.x;
      state.items[state.selectedIndex].y = payload.y;
      state.items[state.selectedIndex].w = payload.w;
      state.items[state.selectedIndex].h = payload.h;
    },
    selectItem(state, index) {
      state.selectedIndex = index;
    },
    openEditor(state, index) {
      state.editing = true;
      state.selectedIndex = index;
      state.editingText = state.items[index].text;
    },
    editItem(state, text) {
      state.items[state.selectedIndex].text = text;
      state.editingText = "";
      state.editing = false;
    },
    updateEditor(state, value) {
      state.editingText = value;
    },
    createArrow(state, payload) {
      // idは全connector.idのmax + 1
      payload.id =
        state.connectors
          .map(item => item.id)
          .reduce((x, y) => (x > y ? x : y), 0) + 1;
      state.connectors.push(payload);
    },
    showArrowTypeMenu(state, payload) {
      state.showArrowMenu = payload.showArrowMenu;
      state.arrowMenuPosition.x = payload.arrowMenuPosition.x;
      state.arrowMenuPosition.y = payload.arrowMenuPosition.y;
      state.selectedConnectorId = payload.selectedConnectorId;
    },
    removeConnector(state, payload) {
      state.connectors = state.connectors.filter(item => {
        return item.id !== payload;
      });
    },
    changeConnectorType(state, payload) {
      const selectedConnector = state.connectors.filter(item => {
        return item.id === payload.id;
      })[0];
      selectedConnector.arrowType = ["none", payload.type];
    },
    addFusenItem(state, payload: FusenItem) {
      state.items.push(payload);
    }
  }
});

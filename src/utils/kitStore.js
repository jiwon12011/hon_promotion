import { reactive } from "vue";

export const kitStore = reactive({
  currentSection: 0,
  isMoving: false,
  isLayerOpen: false
});

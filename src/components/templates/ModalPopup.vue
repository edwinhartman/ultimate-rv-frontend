<template>
  <div class="modal-popup">
    <div>
      <div v-if="rightTopCloseOption" class="relative w-full">
        <div v-if="dialogTitle" :class="centerTitle ? '' : 'float-left'">{{ dialogTitle }}</div>
        <button @click="$emit('close')" class="close-button" :class="centerTitle ? 'right-top' : 'float-right'">
          Close
        </button>
      </div>
      <slot />
      <div v-if="yesNoOption" class="text-center pt-2">
        <button @click="$emit('yesAnswer')">Yes</button>
        <button @click="$emit('noAnswer')">No</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ModalPopup",
  props: {
    yesNoOption: {
      type: Boolean,
      required: false,
      default: false,
    },
    rightTopCloseOption: {
      type: Boolean,
      required: false,
      default: false,
    },
    dialogTitle: {
      type: String,
      required: false,
      default: "",
    },
    centerTitle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>
<style scoped>
.modal-popup {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  background-color: rgba(0, 0, 0, 0.45);
  /* fixed left-0 top-0 right-0 bottom-0 popup flex justify-center z-50 */
}
.modal-popup > div {
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0.1em 0.1em rgba(110, 110, 110, 0.5);
  padding: 1rem;
  margin: 1rem;
  overflow-y: scroll;
  position: relative;
  min-height: 5vh;
  max-height: 95vh;
  /* bg-white p-5 rounded-md shadow-md */
}
button {
  font-size: 0.65rem;
  cursor: pointer;
}
button.close-button {
  z-index: 99999;
}
button.right-top {
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
}
</style>

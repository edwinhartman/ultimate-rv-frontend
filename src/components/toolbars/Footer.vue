<template>
  <div class="footer-main">
    <transition name="slide">
      <div v-if="$store.state.sessionStatus.length > 0" class="status-bar">{{ $store.state.sessionStatus }}</div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "Footer",
}
</script>
<style scoped>
div.footer-main {
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    var(--main-bg-color) 13%,
    var(--main-bg-color) 87%,
    rgba(0, 0, 0, 1) 100%
  );
  position: fixed;
  top: calc(var(--header-height) + var(--main-height));
  width: 100vw;
  height: var(--footer-height);
  font-size: 0.7rem;
}
.status-bar {
  position: absolute;
  left: 5rem;
  font-weight: bold;
}
.slide-enter-active {
  animation: slide-in 2s forwards;
}
.slide-leave-active {
  animation: slide-out 3s ease-in;
}
@keyframes slide-in {
  0% {
    left: -20rem;
    font-weight: normal;
  }
  80% {
    font-weight: bold;
  }
  100% {
    left: 5rem;
  }
}
@keyframes slide-out {
  0% {
    left: 5rem;
  }
  20% {
    font-weight: normal;
  }
  100% {
    left: 100vw;
  }
}
</style>

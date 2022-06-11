<template>
  <div id="app">
    <div class="center">
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
#app {
  height: 100vh;
  display: flex;
}
.center {
  margin: auto;
  width: 100%;
}
</style>

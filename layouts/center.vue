<template>
  <div id="entry">
    <div class="center">
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
#entry {
  height: 100vh;
  display: flex;
}
.center {
  margin: auto;
  width: 100%;
}
</style>

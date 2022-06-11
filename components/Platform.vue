<template>
  <Card class="card">
    <template #title> Select your platform: </template>
    <template #content>
      <NuxtLink to="/sellix">
        <Button
          label="Sellix"
          class="p-button-outlined"
          style="margin-bottom: 1rem"
        />
        <Button
          label="Shoppy (Coming Soon!)"
          class="p-button-outlined"
          disabled
        />
      </NuxtLink>
    </template>
  </Card>
</template>

<script>
export default {};
</script>

<style>
.p-card {
  padding: 1rem;
  margin: 0 1rem 0 1rem;
}
.p-card-content {
  display: flex;
  flex-direction: column;
}
.p-button {
  padding: 1rem;
}
</style>

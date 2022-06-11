<template>
  <div>
    <NuxtLayout name="center">
      <Card class="card">
        <template #title> Select your platform: </template>
        <template #content>
          <NuxtLink to="/sellix">
            <Button
              label="Sellix"
              class="p-button-outlined"
              style="margin-bottom: 1rem"
            />
          </NuxtLink>
          <Button
            label="Shoppy (Coming Soon!)"
            class="p-button-outlined"
            disabled
          />
        </template>
      </Card>
    </NuxtLayout>
  </div>
</template>

<script setup></script>

<style>
body {
  background: #121212;
}
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

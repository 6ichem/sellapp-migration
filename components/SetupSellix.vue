<template>
  <div class="center">
    <Card class="card" v-if="isSuccess">
      <template #content>
        <div style="display: flex; flex-direction: column; text-align: center">
          <i class="pi pi-check-circle" style="font-size: 3rem"></i>
          <span style="margin-top: 1.5rem; font-size: 1.2rem"
            >Your products have been succsefully imported to Sell.app!</span
          >
        </div>
      </template>
    </Card>
    <Card class="card" v-else>
      <template #title>
        Set up your Authorization keys:

        <Message
          v-if="errormsg.length > 0"
          severity="error"
          style="margin-top: 1.5rem"
          >{{ errormsg }}</Message
        >
      </template>
      <template #content>
        <div style="margin-bottom: 1.5rem">
          <div style="margin-bottom: 1rem">
            You can find your Sellix API key
            <a
              href="https://dashboard.sellix.io/settings/security"
              target="_blank"
              >here</a
            >
          </div>
          <span class="p-float-label">
            <InputText
              type="text"
              v-model="sellixAuth"
              :class="isErrorSellix && 'p-invalid'"
            />
            <label for="sellixKey">Your Sellix Authorization Key</label>
          </span>
          <small v-if="isErrorSellix" class="p-error"
            >Invalid API key format.</small
          >
        </div>

        <div>
          <div style="margin-bottom: 1rem">
            You can find your Sell.app API key
            <a href="https://sell.app/user/api-tokens" target="_blank">here</a>
          </div>
          <span class="p-float-label">
            <InputText
              type="text"
              v-model="sellappAuth"
              :class="isErrorSellapp && 'p-invalid'"
            />
            <label for="sellappKey">Your Sell.app Authorization Key</label>
          </span>
          <small v-if="isErrorSellapp" class="p-error"
            >Invalid API key format.</small
          >
        </div>

        <div style="margin-top: 1rem" class="toggle">
          <span>Import products from a specific shop in your Sellix store</span>
          <InputSwitch v-model="isShop" @change="!isShop" />
        </div>
        <span class="p-float-label" v-if="isShop" style="margin-top: 1rem">
          <InputText id="sellixShop" type="text" v-model="sellixShop" />
          <label for="sellixShop">Your Sellix shop name</label>
        </span>
      </template>
      <template #footer>
        <Button
          :label="!loading.value ? 'Submit' : ''"
          class="p-button-outlined"
          :loading="loading.value"
          @click="submitData"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
const sellixAuth = ref("");
const sellappAuth = ref("");
const loading = ref(false);
const e = ref(null);
const isErrorSellix = ref(false);
const isErrorSellapp = ref(false);
const errormsg = ref("");
const isSuccess = ref(false);
const isShop = ref(false);
const sellixShop = ref("");

watch(sellappAuth, (val) => {
  if (val.trim().length > 0) {
    isErrorSellapp.value = false;
  } else {
    isErrorSellapp.value = true;
  }
  errormsg.value = "";
});

watch(sellixAuth, (val) => {
  if (val.trim().length > 0) {
    isErrorSellix.value = false;
  } else {
    isErrorSellix.value = true;
  }
  errormsg.value = "";
});

const submitData = async () => {
  if (sellappAuth.value.trim().length < 40) {
    isErrorSellapp.value = true;
  } else {
    isErrorSellapp.value = false;
  }

  if (sellixAuth.value.trim().length < 64) {
    isErrorSellix.value = true;
  } else {
    isErrorSellix.value = false;
  }

  if (!isErrorSellapp.value && !isErrorSellix.value) {
    const { pending, data, error, refresh } = useLazyFetch("/api/sellix", {
      method: "POST",
      server: false,
      body: {
        sellixAuth: sellixAuth.value,
        sellappAuth: sellappAuth.value,
        ...(isShop.value &&
          sellixShop.length > 0 && { sellixShop: sellixShop.value }),
      },
    });
    loading.value = pending;
    watch(data, (newData) => {
      if (newData.message === "success") {
        isSuccess.value = true;
      }
    });
    watch(error, (error) => {
      const { platform, errorMessage, product } = error?.data;
      if (product) {
        errormsg.value = `${platform}: ${errorMessage} Error occured in: '${product.title}'.`;
      } else {
        errormsg.value = `${platform}: ${errorMessage}`;
      }
    });
    refresh();
  }
};
</script>

<style>
.p-card {
  margin: 0 1rem 0 1rem;
}

.p-card-content div a {
  color: rgb(114, 114, 255);
}
.p-button {
  display: flex !important;
  padding: 1rem;
  width: 100%;
}

.p-button .p-button-loading-icon {
  width: 100%;
}

.p-inputtext {
  width: 100%;
}

a {
  text-decoration: none;
}

.toggle {
  display: flex;
  align-items: center;
}

.toggle span:first-child {
  margin-right: 1rem;
}
</style>

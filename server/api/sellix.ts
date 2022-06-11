import { addToSellapp } from "~~/services/sellapp";
import { ResponseError, SellixResponseObject } from "~~/services/types";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  let errorResponse: ResponseError | null = null;
  const { sellixAuth, sellappAuth } = body;

  let sellixProducts: any;

  try {
    const { data: sellixData } = await $fetch<SellixResponseObject>(
      "https://dev.sellix.io/v1/products",
      {
        method: "GET",
        parseResponse: JSON.parse,
        headers: {
          Authorization: `Bearer ${sellixAuth}`,
        },
      }
    );
    const { products } = sellixData;
    sellixProducts = products;
  } catch (e) {
    const { status, error: errorMessage } = e.data;
    errorResponse = {
      status,
      errorMessage,
      platform: "Sellix",
    };
  }
  if (sellixProducts) {
    try {
      await addToSellapp(sellixProducts, sellappAuth, sellixAuth);
    } catch (e) {
      errorResponse = e;
    }
  }

  if (errorResponse) {
    event.res.statusCode = errorResponse.status;
    return errorResponse;
  }

  return { message: "success" };
});

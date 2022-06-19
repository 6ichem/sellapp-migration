import { addToSellapp } from "~~/services/sellapp";
import {
  RequestBody,
  ResponseError,
  SellixResponseObject,
} from "~~/services/types";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  let errorResponse: ResponseError | null = null;
  const { sellixAuth, sellappAuth, sellixShop }: RequestBody = body;

  let sellixProducts: any;

  try {
    const { data: sellixData } = await $fetch<SellixResponseObject>(
      "https://dev.sellix.io/v1/products",
      {
        method: "GET",
        parseResponse: JSON.parse,
        headers: {
          Authorization: `Bearer ${sellixAuth}`,
          ...(sellixShop &&
            sellixShop.length > 1 && { "X-Sellix-Merchant": sellixShop }),
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
      await addToSellapp(sellixProducts, sellappAuth, sellixAuth, sellixShop);
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

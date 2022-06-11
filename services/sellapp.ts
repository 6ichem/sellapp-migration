import { Deliverable, ResponseError, SellappProduct } from "./types";

export const convertPaymentGateways = (gateways) => {
  const defaultSellappGateways = ["PAYPAL", "STRIPE", "CASHAPP", "PAYSTACK"];

  const coinbaseGateways = [
    "BITCOIN",
    "LITECOIN",
    "ETHEREUM",
    "BITCOIN_CASH",
    "SOLANA",
    "BINANCE_COIN",
  ];

  let filteredGateways = gateways.filter((i: string) =>
    defaultSellappGateways.includes(i)
  );

  let filteredCoinbase = gateways.filter((i: string) =>
    coinbaseGateways.includes(i)
  );

  if (filteredCoinbase.length > 0) {
    filteredGateways.push("COINBASE");
  }

  return filteredGateways;
};

export const getProductDeliverables = async (
  uniqueId: string,
  sellixAuth?: string
): Promise<Deliverable> => {
  try {
    const { data } = await $fetch<any>(
      `https://dev.sellix.io/v1/products/${uniqueId}`,
      {
        method: "GET",
        parseResponse: JSON.parse,
        headers: {
          Authorization: `Bearer ${sellixAuth}`,
        },
      }
    );

    const {
      delivery_text,
      type,
      serials,
      dynamic_webhook,
      service_text,
      stock: productStock,
    } = data?.product;

    const defaultDeliverableData = {
      delivery_text: delivery_text,
      type: "MANUAL",
      data: {
        stock: productStock === -1 ? null : productStock,
        removeDuplicate: true,
      },
    };

    switch (type) {
      case "FILE":
        return {
          ...defaultDeliverableData,
          type: "MANUAL",
          data: {
            ...defaultDeliverableData.data,
            comment:
              "This is a placeholder of a downloadable file you have tried to import from Sellix. The migration app currently doesn't support importing files.",
          },
        };
      case "SERIALS":
        return {
          ...defaultDeliverableData,
          type: "TEXT",
          data: {
            ...defaultDeliverableData.data,
            serials: serials,
          },
        };
      case "DYNAMIC":
        return {
          ...defaultDeliverableData,
          type: "DYNAMIC",
          data: {
            ...defaultDeliverableData.data,
            webhook: dynamic_webhook,
          },
        };
      case "SERVICE":
        return {
          ...defaultDeliverableData,
          type: "MANUAL",
          data: {
            ...defaultDeliverableData.data,
            comment: service_text,
          },
        };
      default:
        return {
          ...defaultDeliverableData,
          type: "MANUAL",
          data: {
            ...defaultDeliverableData.data,
            comment:
              "No product delivarbles were found when importing from Sellix.",
          },
        };
    }
  } catch (e) {
    const { status, error: errorMessage } = e.data;
    throw {
      status,
      errorMessage,
      platform: "Sellix",
    };
  }
};

export const addToSellapp = (
  sellixProducts: any,
  sellappAuth: string,
  sellixAuth: string
) => {
  return new Promise((resolve, reject) => {
    sellixProducts.map(async (i: any) => {
      const newSellappProduct: SellappProduct = {
        title: i.title,
        description: i.description,
        order: i.sort_priority,
        visibility: "PUBLIC",
        deliverable: await getProductDeliverables(i.uniqid, sellixAuth),
        price: {
          price: i.price,
          currency: i.currency,
        },
        payment_methods: convertPaymentGateways(i.gateways),
        additional_information: i.custom_fields,
        bulk_discount: i.volume_discounts,
        minimum_purchase_quantity: i.quantity_min,
        maximum_purchase_quantity: i.quantity_max === -1 && null,
        webhook: i.dynamic_webhook,
        warranty: {
          text: i.warranty_text,
          time: i.warranty / 60,
          preferredUnit: "MINUTES",
        },
      };

      try {
        const { data: sellappData } = await $fetch<any>(
          "https://sell.app/api/v1/listings",
          {
            method: "POST",
            body: newSellappProduct,
            parseResponse: JSON.parse,
            headers: {
              Authorization: `Bearer ${sellappAuth}`,
            },
          }
        );

        resolve(sellappData);
      } catch (e) {
        const { errors, message: errorMessage } = e.data;
        if (e.response.status == 401) {
          reject({
            status: e.response.status,
            errorMessage,
            platform: "Sellapp",
          });
        } else {
          reject({
            status: e.response.status,
            errorMessage,
            errors,
            product: i,
            platform: "Sellapp",
          });
        }
      }
    });
  });
};

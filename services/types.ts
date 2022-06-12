export type SellappProduct = {
  title: string;
  description: string;
  order: number;
  visibility: string;
  deliverable: Deliverable;
  price: {
    price: number;
    currency: string;
  };
  payment_methods: any;
  additional_information: any;
  bulk_discount: any;
  minimum_purchase_quantity: number;
  maximum_purchase_quantity: number | null;
  webhook: string | null;
  warranty: {
    text: string;
    time: number;
    preferredUnit: string;
  };
};

export type Deliverable = {
  delivery_text: string;
  type: string;
  data: object;
};

export type ResponseError = {
  status: number;
  errorMessage: string;
  product?: number;
  errors?: any;
  platform?: string;
};

export type SellixResponseObject = {
  status: number;
  message: string | null;
  log: any;
  error: string | object | null;
  env: string;
  data: { products: any };
};

export type RequestBody = {
  sellixAuth: string;
  sellappAuth: string;
  sellixShop?: string;
};

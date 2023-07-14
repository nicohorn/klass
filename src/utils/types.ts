export type Custom_Order = {
  userId: string;
  clientName: string;
  clientEmail: string;
  clientNumber: number;
  address: string;
  message: string;
  images: string[];
  createdAt: string;
  state: string;
  isProject: boolean;
};

export type Order = {
  userId: string;
  clientName: string;
  clientEmail: string;
  products: object[];
  total: number;
  createdAt: string;
  state: string;
};

export type ProductType = {
  _id?: string;
  name: string;
  base_price: number;
  img: Array<string>;
  categories: string;
  options: Array<object>;
  description: string;
  tags: string;
};

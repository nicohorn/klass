export type CustomOrderType = {
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

export type OrderType = {
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
  options: OptionsListType[];
  description: string;
  tags: string;
  steel?: boolean;
};

export type ColorOptionType = {
  _id: string;
  name: string;
  img: string;
};

export type OptionType = {
  value: string;
  multiplier: number;
};

export type CartItemType = {
  id: string;
  price: number;
  size: string;
  color_1: string;
  color_2: string;
  style: string;
  model: string;
};

export type OptionsListType = {
  name: string;
  elements: OptionType[];
};

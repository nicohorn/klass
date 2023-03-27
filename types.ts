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

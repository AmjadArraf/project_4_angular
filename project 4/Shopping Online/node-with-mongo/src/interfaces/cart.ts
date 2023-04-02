export interface CartProduct {
    name: string;
    price: number;
  }

export interface CartInterface {
    key: number
    date: Date
    products: CartProduct[]
}
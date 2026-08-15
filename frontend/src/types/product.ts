export interface ProductVariant {
  weight: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  variants: ProductVariant[];
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}
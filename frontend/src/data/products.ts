export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'fried-rice' | 'noodles' | 'starters' | 'beverages';
  image?: string;         // ✅ Optional for local fallback
  image_url?: string;
  variants: {
    weight: string;
    price: number;
  }[];
  isAvailable: boolean;
  isFeatured: boolean;
  tags?: string[];
}

export const categories = [
  { id: 'fried-rice', name: 'Fried Rice', icon: '🍚', description: 'Authentic Chinese fried rice' },
  { id: 'noodles', name: 'Noodles', icon: '🍜', description: 'Delicious Hakka & Chowmein' },
  { id: 'starters', name: 'Starters', icon: '🍗', description: 'Crispy & Tasty Starters' },
];

export const products: Product[] = [
  // ============================================
  // FRIED RICE (6 items)
  // ============================================
  {
    id: '1',
    name: 'Veg Fried Rice',
    description: 'Classic fried rice with fresh vegetables, spring onions, and aromatic Chinese spices.',
    category: 'fried-rice',
    image: '/images/veg-fried-rice.jpg',
    variants: [
      { weight: 'Regular', price: 100 },
      { weight: 'Large', price: 160 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Veg', 'Popular'],
  },
  {
    id: '2',
    name: 'Gobbi Fried Rice',
    description: 'Delicious fried rice with crispy gobi (cauliflower) and fresh vegetables.',
    category: 'fried-rice',
    image: '/images/gobbi-fried-rice.jpg',
    variants: [
      { weight: 'Regular', price: 120 },
      { weight: 'Large', price: 180 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Veg', 'Special'],
  },
  {
    id: '3',
    name: 'Chicken Fried Rice',
    description: 'Tender chicken pieces tossed with eggs, vegetables, and flavorful Chinese sauces.',
    category: 'fried-rice',
    image: '/images/chicken-fried-rice.jpg',
    variants: [
      { weight: 'Regular', price: 150 },
      { weight: 'Large', price: 220 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Non-Veg', 'Bestseller'],
  },
  {
    id: '4',
    name: 'Egg Fried Rice',
    description: 'Fluffy rice stir-fried with scrambled eggs, spring onions, and soy sauce.',
    category: 'fried-rice',
    image: '/images/egg-fried-rice.jpg',
    variants: [
      { weight: 'Regular', price: 110 },
      { weight: 'Large', price: 170 },
    ],
    isAvailable: true,
    isFeatured: false,
    tags: ['Egg', 'Popular'],
  },
  {
    id: '5',
    name: 'Flashman Fried Rice',
    description: 'Special flashman style fried rice with mixed vegetables and secret spices.',
    category: 'fried-rice',
    image: '/images/flashman-fried-rice.jpg',
    variants: [
      { weight: 'Regular', price: 100 },
      { weight: 'Large', price: 160 },
    ],
    isAvailable: true,
    isFeatured: false,
    tags: ['Veg', 'Special'],
  },
  {
    id: '6',
    name: 'Mixed Fried Rice',
    description: 'A delicious mix of chicken, egg, and vegetables with spring onions.',
    category: 'fried-rice',
    image: '/images/mixed-fried-rice.jpg',
    variants: [
      { weight: 'Regular', price: 160 },
      { weight: 'Large', price: 240 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Non-Veg', 'Special'],
  },

  // ============================================
  // NOODLES (4 items)
  // ============================================
  {
    id: '7',
    name: 'Veg Noodles',
    description: 'Stir-fried noodles with fresh vegetables, spring onions, and Chinese sauces.',
    category: 'noodles',
    image: '/images/veg-noodles.jpg',
    variants: [
      { weight: 'Regular', price: 100 },
      { weight: 'Large', price: 160 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Veg', 'Popular'],
  },
  {
    id: '8',
    name: 'Gobbi Noodles',
    description: 'Noodles stir-fried with crispy gobi (cauliflower) and fresh vegetables.',
    category: 'noodles',
    image: '/images/gobbi-noodles.jpg',
    variants: [
      { weight: 'Regular', price: 120 },
      { weight: 'Large', price: 180 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Veg', 'Special'],
  },
  {
    id: '9',
    name: 'Chicken Noodles',
    description: 'Noodles with tender chicken pieces, vegetables, and aromatic spices.',
    category: 'noodles',
    image: '/images/chicken-noodles.jpg',
    variants: [
      { weight: 'Regular', price: 150 },
      { weight: 'Large', price: 220 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Non-Veg', 'Bestseller'],
  },
  {
    id: '10',
    name: 'Egg Noodles',
    description: 'Noodles stir-fried with scrambled eggs and fresh vegetables.',
    category: 'noodles',
    image: '/images/egg-noodles.jpg',
    variants: [
      { weight: 'Regular', price: 110 },
      { weight: 'Large', price: 170 },
    ],
    isAvailable: true,
    isFeatured: false,
    tags: ['Egg', 'Popular'],
  },

  // ============================================
  // STARTERS (5 items)
  // ============================================
  {
    id: '11',
    name: 'Leg Piece',
    description: 'Crispy fried chicken leg piece with special masala coating.',
    category: 'starters',
    image: '/images/leg-piece.jpg',
    variants: [
      { weight: '1 Pc', price: 40 },
      { weight: '2 Pcs', price: 70 },
      { weight: '4 Pcs', price: 130 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Non-Veg', 'Crispy'],
  },
  {
    id: '12',
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings tossed in spicy sauce.',
    category: 'starters',
    image: '/images/chicken-wings.jpg',
    variants: [
      { weight: '3 Pcs', price: 50 },
      { weight: '6 Pcs', price: 90 },
      { weight: '12 Pcs', price: 170 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Non-Veg', 'Popular'],
  },
  {
    id: '13',
    name: 'Gobbi Manchuriya',
    description: 'Crispy fried gobi (cauliflower) tossed in spicy, tangy Manchurian sauce.',
    category: 'starters',
    image: '/images/gobbi-manchuriya.jpg',
    variants: [
      { weight: 'Regular', price: 150 },
      { weight: 'Large', price: 220 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Veg', 'Bestseller'],
  },
  {
    id: '14',
    name: 'Chicken Manchuriya',
    description: 'Crispy chicken balls tossed in spicy, tangy Manchurian sauce.',
    category: 'starters',
    image: '/images/chicken-manchuriya.jpg',
    variants: [
      { weight: 'Regular', price: 150 },
      { weight: 'Large', price: 220 },
    ],
    isAvailable: true,
    isFeatured: true,
    tags: ['Non-Veg', 'Bestseller'],
  },
  {
    id: '15',
    name: 'Chilli Chicken',
    description: 'Crispy chicken tossed in a spicy, tangy sauce with bell peppers and onions.',
    category: 'starters',
    image: '/images/chilli-chicken.jpg',
    variants: [
      { weight: 'Regular', price: 160 },
      { weight: 'Large', price: 230 },
    ],
    isAvailable: true,
    isFeatured: false,
    tags: ['Non-Veg', 'Spicy'],
  },
];
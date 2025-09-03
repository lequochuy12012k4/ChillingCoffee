'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  _id: string;
  title: string;
  image?: string;
  base_price: string;
  category: 'drink' | 'cake';
};

const apiBase = `${(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001').replace(/\/$/, '')}/api/v1`;

const ProductGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'drinks' | 'cakes'>('drinks');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const itemsUrl = useMemo(() => `${apiBase}/menu.items`, []);

  const fetchItems = async (category?: 'drink' | 'cake') => {
    setLoading(true);
    try {
      const url = category ? `${itemsUrl}?category=${category}` : itemsUrl;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray((data as any)?.result) ? (data as any).result : [];
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems('drink');
  }, []);

  useEffect(() => {
    fetchItems(activeCategory === 'drinks' ? 'drink' : 'cake');
  }, [activeCategory]);

  const productsToShow = items;
  const sectionTitle = activeCategory === 'drinks' ? 'The Popular Drinks' : 'The Delicious Cakes';
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{sectionTitle}</h2>
        <div className="flex justify-center items-center gap-4 mb-10">
          <button
            onClick={() => setActiveCategory('drinks')}
            className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 ${
              activeCategory === 'drinks'
                ? 'bg-[rgba(75,61,35,1)] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drinks
          </button>
          <button
            onClick={() => setActiveCategory('cakes')}
            className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 ${
              activeCategory === 'cakes'
                ? 'bg-[rgba(75,61,35,1)] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cakes
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsToShow.map((product) => (
            <Link href={`/products/${product._id}`} key={product._id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative w-full h-64">
                  <Image
                    src={product.image || '/ProductsHero/image.png'}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h3>
                  <p className="text-lg text-[rgba(75,61,35,1)] font-bold">{product.base_price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {loading && <div className="text-center text-sm text-gray-500 mt-4">Loading...</div>}
      </div>
    </section>
  );
};

export default ProductGrid;
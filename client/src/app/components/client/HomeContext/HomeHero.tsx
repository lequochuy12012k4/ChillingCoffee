'use client';

import Image from 'next/image';
import Link from 'next/link';
import HeroBackgroundImage from '../../../../../public/HomeContext/image.png'; // Import hình ảnh

const HomeHero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center text-white text-center">
      {/* Lớp 1: Hình ảnh nền (Tối ưu hóa) */}
      <Image
        src={HeroBackgroundImage}
        alt="Không gian thưởng thức cà phê tại ChillingCoffee"
        layout="fill"
        objectFit="cover"
        quality={85}
        priority // Rất quan trọng: Ưu tiên tải hình ảnh này đầu tiên để cải thiện tốc độ
        placeholder="blur" // Hiệu ứng mờ khi ảnh đang tải
        className="z-0"
      />
      
      {/* Lớp 2: Lớp phủ Gradient (Hiện đại hơn) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10"></div>

      {/* Lớp 3: Nội dung (Với Animation) */}
      <div className="relative z-20 flex flex-col items-center px-4 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-shadow-lg">
          Find Your Moment of Calm
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-200 mb-8 text-shadow">
          Experience the perfect blend of premium coffee, delightful cakes, and a tranquil atmosphere. Your daily escape awaits.
        </p>
        <Link href="/products">
          <span className="inline-block bg-white text-[rgba(75,61,35,1)] font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-all duration-300 shadow-xl transform hover:scale-105 cursor-pointer">
            Explore Our Menu
          </span>
        </Link>
      </div>
    </section>
  );
};

export default HomeHero;
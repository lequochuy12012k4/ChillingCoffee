'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Import required modules
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';

// --- DỮ LIỆU MẪU CHO SLIDER ---
const featuredProducts = [
  {
    id: 1,
    name: 'Cà Phê Cold Brew Thượng Hạng',
    description: 'Được ủ lạnh trong 20 giờ từ hạt Arabica Cầu Đất, mang đến hương vị mượt mà, sâu lắng và hoàn toàn không đắng gắt.',
    image: '/ProductsHero/image.png',
    link: '/products/cold-brew',
  },
  {
    id: 2,
    name: 'Bánh Tiramisu Ý Nguyên Bản',
    description: 'Sự hòa quyện tinh tế giữa vị đắng nhẹ của espresso, sự ngọt ngào của kem mascarpone và lớp bột cacao phủ mịn.',
    image: '/ProductsHero/image1.png',
    link: '/products/tiramisu',
  },
  {
    id: 3,
    name: 'Trà Sữa Matcha Đỉnh Cao',
    description: 'Bột trà xanh matcha cao cấp từ Uji, Nhật Bản, được đánh tan thủ công và kết hợp cùng sữa tươi thanh trùng.',
    image: '/ProductsHero/image2.png',
    link: '/products/matcha-latte',
  },
];

const ProductsHero: React.FC = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          loop={true}
          effect={'fade'}
          autoplay={{
            delay: 4000, // Tăng thời gian chờ lên 4 giây để người dùng kịp đọc
            disableOnInteraction: false,
          }}
          
          // Kích hoạt lại điều hướng và phân trang
          navigation={true}
          pagination={{ clickable: true }}

          // Sử dụng `group` để điều khiển hiển thị của các nút con khi hover
          className="rounded-lg shadow-lg overflow-hidden group"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="relative w-full aspect-video md:aspect-[2.4/1]">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  priority={product.id === 1}
                />
                
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                
                {/* --- RESPONSIVE CONTENT --- */}
                <div className="absolute inset-0 flex flex-col justify-center md:justify-end text-white
                                p-6 sm:p-8 md:p-12">
                  <div className="max-w-md">
                    {/* Cỡ chữ responsive hơn */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-base sm:text-lg text-gray-200 hidden sm:block">
                      {product.description}
                    </p>
                    <Link href={product.link}>
                      <span className="inline-block mt-6 px-7 py-3 bg-[rgba(75,61,35,1)] text-white font-semibold rounded-full hover:bg-green-600 transition-colors duration-300 shadow-md cursor-pointer">
                        Khám Phá Ngay
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductsHero;
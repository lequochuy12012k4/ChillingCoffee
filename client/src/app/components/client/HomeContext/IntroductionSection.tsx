'use client'
import Image from 'next/image';
import Link from 'next/link';

import introImage from '../../../../../public/HomeContext/image.png'

const IntroductionSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Responsive layout: side-by-side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Cột hình ảnh */}
          <div className="w-full h-80 md:h-full relative rounded-lg overflow-hidden shadow-xl">
            <Image
              src={introImage}
              alt="Không gian bên trong quán ChillingCoffee"
              layout="fill"
              objectFit="cover"
              placeholder="blur" // Hiệu ứng mờ khi tải ảnh
              className="transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Cột nội dung */}
          <div className="text-center md:text-left">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-700 mb-3">
              Về ChillingCoffee
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              Nơi Mỗi Tách Cà Phê Là Một Khoảnh Khắc Thư Giãn
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Tại ChillingCoffee, chúng tôi tin rằng cà phê không chỉ là một thức uống—đó là một trải nghiệm. Chúng tôi tận tâm tìm nguồn cung ứng những hạt cà phê hảo hạng nhất từ khắp nơi trên thế giới và rang xay một cách chuyên nghiệp để mang đến cho bạn hương vị trọn vẹn và tinh tế nhất.
            </p>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Hãy đến với không gian ấm cúng của chúng tôi để tìm một góc yên tĩnh làm việc, gặp gỡ bạn bè, hoặc đơn giản là tận hưởng một phút giây thư thái cho riêng mình.
            </p>
            <Link href="/products">
              <span className="inline-block bg-[rgba(75,61,35,1)] text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-lg cursor-pointer">
                Khám Phá Thực Đơn
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
'use client'
import React from 'react';

// SVG Icons (biểu tượng) - Bạn có thể thay thế bằng các icon của riêng mình
const HistoryIcon = () => (
  <svg className="w-12 h-12 text-[rgba(75,61,35,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.494h18" /></svg>
);

const QualityIcon = () => (
  <svg className="w-12 h-12 text-[rgba(75,61,35,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);

const CommunityIcon = () => (
  <svg className="w-12 h-12 text-[rgba(75,61,35,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);


const AboutUsSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề chính */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Câu Chuyện Đằng Sau Mỗi Tách Cà Phê
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Không chỉ là cà phê, đó là đam mê, nghệ thuật và sự kết nối.
          </p>
        </div>

        {/* Lưới nội dung với 3 cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Phần 1: Câu chuyện của chúng tôi */}
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center items-center mb-4">
              <HistoryIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Câu Chuyện Của Chúng Tôi
            </h3>
            <p className="text-gray-600 leading-relaxed">
              ChillingCoffee ra đời từ một ý tưởng đơn giản: tạo ra một không gian nơi thời gian trôi chậm lại, và mọi người có thể kết nối với nhau qua hương vị cà phê đích thực. Hành trình đó đã đưa chúng tôi đến những vùng trồng cà phê trứ danh, học hỏi và chắt lọc những gì tinh túy nhất.
            </p>
          </div>

          {/* Phần 2: Cam kết về Chất lượng */}
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center items-center mb-4">
              <QualityIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Cam Kết Về Chất Lượng
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Chất lượng là nền tảng của chúng tôi. Từ việc lựa chọn những hạt Arabica 100% thu hoạch thủ công, đến quy trình rang xay được kiểm soát tỉ mỉ và đôi bàn tay tài hoa của các barista, chúng tôi đảm bảo mỗi tách cà phê trao đến bạn đều là một tác phẩm nghệ thuật trọn vẹn.
            </p>
          </div>

          {/* Phần 3: Không gian & Cộng đồng */}
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center items-center mb-4">
              <CommunityIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Không Gian & Cộng Đồng
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi không chỉ xây dựng một quán cà phê, mà còn là một "ngôi nhà thứ hai". Một nơi ấm cúng để bạn làm việc, gặp gỡ bạn bè hay đơn giản là tìm một góc yên tĩnh cho riêng mình. Đây chính là tinh thần "chilling" mà chúng tôi muốn lan tỏa đến cộng đồng.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
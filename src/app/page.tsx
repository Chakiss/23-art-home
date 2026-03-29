'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { COURSE_CATEGORIES } from '@/types';
import { useCart } from '@/hooks/useCart';
import { trackEvent } from '@/lib/utils';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

  useEffect(() => {
    // Track landing page view
    trackEvent('landing_view', {
      source: 'qr_scan',
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-art-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">23</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              23 Art Home
            </h1>
          </div>
          
          {/* Cart Button */}
          <Link 
            href="/cart" 
            className="relative p-2 text-gray-600 hover:text-art-500 transition-colors"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-art-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/arthome1.jpg"
            alt="Art Studio Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/80"></div>
        </div>
        
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          {/* Decorative Elements */}
          <div className="relative mb-8">
            <div className="absolute left-1/4 top-4 w-12 h-12 bg-blue-100 rounded-full opacity-60 animate-bounce-slow"></div>
            <div className="absolute right-1/3 top-8 w-8 h-8 bg-pink-100 rounded-full opacity-40 animate-pulse-slow"></div>
            <div className="absolute left-1/3 bottom-4 w-6 h-6 bg-yellow-100 rounded-full opacity-50"></div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[0.85] tracking-tighter mb-6">
              ออกแบบคอร์สศิลปะให้สนุก
              <br />
              <span className="bg-gradient-to-r from-art-500 to-art-600 bg-clip-text text-transparent drop-shadow-sm">
                มันส์ให้สุด
              </span>
              <br />
              ทุกความฝัน
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            เลือกได้ทั้งแบบจัดคอร์สเอง หรือเลือกคอร์สสำเร็จรูป 
            <br />
            พร้อมอุปกรณ์ศิลปะครบชุด
          </p>

          {/* Age and Duration Info */}
          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-2xl mb-2">👶</div>
                <div className="font-semibold text-gray-900">อายุ 4-6 ปี</div>
                <div className="text-sm text-gray-600">ครั้งละ 1 ชม.</div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-2xl mb-2">🧒</div>
                <div className="font-semibold text-gray-900">อายุ 6-12 ปี</div>
                <div className="text-sm text-gray-600">ครั้งละ 2 ชม.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            เลือกประเภทคอร์สที่ต้องการ
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            เราออกแบบคอร์สให้เหมาะกับความต้องการที่แตกต่างกัน
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {COURSE_CATEGORIES.map((category, index) => (
              <Link
                key={category.id}
                href={category.route}
                onClick={() => trackEvent('category_view', { category: category.id })}
                className="group block"
              >
                <div className="card hover:shadow-xl hover:scale-105 transform transition-all duration-300 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 text-6xl">{category.icon}</div>
                    <div className="absolute bottom-4 left-4 text-8xl font-black text-gray-200">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="text-5xl mb-6 group-hover:animate-bounce">
                      {category.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="inline-flex items-center text-art-600 font-medium group-hover:text-art-700 transition-colors">
                      เลือกคอร์สนี้
                      <svg 
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ทำไมต้อง 23 Art Home
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              เรามุ่งมั่นให้เด็กๆ ได้เรียนรู้และสนุกกับศิลปะอย่างมีคุณภาพ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '👨‍🎨',
                title: 'ครูผู้เชี่ยวชาญ',
                description: 'ครูที่มีประสบการณ์และความเชี่ยวชาญด้านศิลปะ'
              },
              {
                icon: '🎨',
                title: 'อุปกรณ์คุณภาพสูง',
                description: 'อุปกรณ์ศิลปะที่มีคุณภาพและปลอดภัยสำหรับเด็ก'
              },
              {
                icon: '🏆',
                title: 'หลักสูตรมาตรฐาน',
                description: 'หลักสูตรที่ออกแบบเฉพาะตามช่วงอายุ'
              },
              {
                icon: '💝',
                title: 'บรรยากาศอบอุ่น',
                description: 'สภาพแวดล้อมที่เอื้อต่อการเรียนรู้และความคิดสร้างสรรค์'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-art-500 to-art-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            พร้อมเริ่มเรียนกับเราแล้วใช่มั้ย?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            เลือกคอร์สที่เหมาะกับน้องและเริ่มต้นการเรียนรู้ศิลปะที่สนุกสนาน
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/custom-course"
              className="bg-white text-art-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              จัดคอร์สเอง 5 ครั้ง
            </Link>
            <Link 
              href="/predefined-courses"
              className="bg-art-700 hover:bg-art-800 text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              เลือกคอร์สสำเร็จรูป
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-art-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">23</span>
                </div>
                <span className="text-xl font-semibold">23 Art Home</span>
              </div>
              <p className="text-gray-400">
                พัฒนาความคิดสร้างสรรค์และทักษะศิลปะของน้องๆ ในบรรยากาศที่อบอุ่นและเป็นมิตร
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">ติดต่อเรา</h3>
              <div className="space-y-2 text-gray-400">
                <p>📞 โทร: 02-xxx-xxxx</p>
                <p>📧 อีเมล: info@23arthome.com</p>
                <p>📍 ที่อยู่: กรุงเทพฯ</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">เวลาเปิด</h3>
              <div className="space-y-2 text-gray-400">
                <p>จันทร์ - ศุกร์: 09:00 - 18:00</p>
                <p>เสาร์ - อาทิตย์: 09:00 - 17:00</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 23 Art Home. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
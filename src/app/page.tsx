'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { COURSE_CATEGORIES } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useIsMounted } from '@/hooks/useIsMounted';
import { trackEvent } from '@/lib/utils';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { getItemCount } = useCart();
  const isMounted = useIsMounted();
  const cartItemCount = isMounted ? getItemCount() : 0;

  useEffect(() => {
    trackEvent('landing_view', {
      source: 'qr_scan',
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e15d15' }}>
              <span className="text-white font-bold text-xs">23</span>
            </div>
            <span className="text-base font-semibold tracking-tight">23 Art Home</span>
          </Link>

          <Link
            href="/cart"
            className="relative p-1.5 text-gray-600 hover:text-black transition-colors"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium leading-none" style={{ backgroundColor: '#e15d15' }}>
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <p className="text-sm font-medium uppercase tracking-widest mb-5" style={{ color: '#e15d15' }}>
            คอร์สศิลปะสำหรับเด็ก
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-none mb-6">
            ออกแบบคอร์สศิลปะ
            <br />
            <span style={{ color: '#e15d15' }}>ให้เป็นแบบของคุณ</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light max-w-xl mx-auto leading-relaxed mb-10">
            เลือกคอร์สเองหรือเลือกแบบสำเร็จรูป พร้อมอุปกรณ์ศิลปะครบชุด
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/custom-course"
              className="inline-flex items-center justify-center text-white px-8 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#e15d15' }}
            >
              จัดคอร์สเอง
            </Link>
            <Link
              href="/predefined-courses"
              className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              คอร์สสำเร็จรูป
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-72 md:h-96 w-full">
          <Image
            src="/images/arthome1.jpg"
            alt="23 Art Home Studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f5f5f7]/60 to-transparent" />
        </div>
      </section>

      {/* Age info strip */}
      <section className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">อายุ 4–6 ปี</span> · ครั้งละ 1 ชั่วโมง
          </p>
          <span className="hidden sm:block w-px h-4 bg-gray-200" />
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">อายุ 6–12 ปี</span> · ครั้งละ 2 ชั่วโมง
          </p>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: '#e15d15' }}>ประเภทคอร์ส</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              เลือกแบบที่ใช่สำหรับคุณ
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {COURSE_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={category.route}
                onClick={() => trackEvent('category_view', { category: category.id })}
                className="group block bg-[#f5f5f7] rounded-3xl p-8 hover:bg-[#e8e8ed] transition-colors"
              >
                <div className="text-3xl mb-6">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {category.description}
                </p>
                <span className="text-sm font-medium group-hover:underline" style={{ color: '#e15d15' }}>
                  เลือกคอร์สนี้ →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: '#e15d15' }}>ทำไมต้อง 23 Art Home</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              เรียนรู้อย่างมีคุณภาพ
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            {[
              { icon: '👨‍🎨', title: 'ครูผู้เชี่ยวชาญ', description: 'มีประสบการณ์และความเชี่ยวชาญด้านศิลปะ' },
              { icon: '🎨', title: 'อุปกรณ์คุณภาพสูง', description: 'คุณภาพดีและปลอดภัยสำหรับเด็ก' },
              { icon: '🏆', title: 'หลักสูตรมาตรฐาน', description: 'ออกแบบเฉพาะตามช่วงอายุ' },
              { icon: '💝', title: 'บรรยากาศอบอุ่น', description: 'เอื้อต่อการเรียนรู้และความคิดสร้างสรรค์' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 text-center">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            พร้อมเริ่มแล้วหรือยัง?
          </h2>
          <p className="text-xl text-gray-500 font-light mb-10">
            เลือกคอร์สที่เหมาะกับน้อง และเริ่มต้นการเรียนรู้ศิลปะที่สนุกสนาน
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/custom-course"
              className="inline-flex items-center justify-center text-white px-8 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#e15d15' }}
            >
              จัดคอร์สเอง 5 ครั้ง
            </Link>
            <Link
              href="/predefined-courses"
              className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              เลือกคอร์สสำเร็จรูป
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 px-6 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e15d15' }}>
                  <span className="text-white font-bold text-xs">23</span>
                </div>
                <span className="font-semibold tracking-tight">23 Art Home</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                พัฒนาความคิดสร้างสรรค์และทักษะศิลปะของน้องๆ ในบรรยากาศที่อบอุ่นและเป็นมิตร
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">ติดต่อเรา</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="font-medium text-gray-700">คุณอนุรักษ์ สุขนันทศักดิ์</p>
                <p>77/1 ซอยจรัญสนิทวงค์ 13<br />บางแวก บางไผ่ บางแค<br />กรุงเทพฯ 10160<br />(ในทางเข้าหมู่บ้านธีรินทร์)</p>
                <p>📞 085-042-4116, 081-536-4384</p>
                <p>📧 arthomestudio@hotmail.com</p>
                <p>📧 arthomestudio@gmail.com</p>
                <p>LINE: AUM_ART_HOME</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">เวลาเปิด</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <p>จันทร์ – ศุกร์: 09:00 – 18:00</p>
                <p>เสาร์ – อาทิตย์: 09:00 – 17:00</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-xs text-gray-400">&copy; 2026 23 Art Home. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

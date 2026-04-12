'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { COURSE_CATEGORIES } from '@/types';
import { trackEvent } from '@/lib/utils';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Button, SectionHeader } from '@/components/ui';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const FEATURES = [
  { icon: '👨‍🎨', title: 'ครูผู้เชี่ยวชาญ', description: 'มีประสบการณ์และความเชี่ยวชาญด้านศิลปะ' },
  { icon: '🎨', title: 'อุปกรณ์คุณภาพสูง', description: 'คุณภาพดีและปลอดภัยสำหรับเด็ก' },
  { icon: '🏆', title: 'หลักสูตรมาตรฐาน', description: 'ออกแบบเฉพาะตามช่วงอายุ' },
  { icon: '💝', title: 'บรรยากาศอบอุ่น', description: 'เอื้อต่อการเรียนรู้และความคิดสร้างสรรค์' },
];

export default function HomePage() {
  useEffect(() => {
    trackEvent('landing_view', {
      source: 'qr_scan',
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar transparent />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-art-50/60 via-white to-[#f5f5f7]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-art-200/30 rounded-full blur-3xl -z-0" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-art-100/40 rounded-full blur-3xl -z-0" />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-art-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <SparklesIcon className="w-4 h-4 text-art-600" />
            <span className="text-xs font-semibold tracking-wide text-art-700">คอร์สศิลปะสำหรับเด็ก</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-5 text-balance">
            ออกแบบคอร์สศิลปะ
            <br />
            <span className="bg-gradient-to-r from-art-500 to-art-700 bg-clip-text text-transparent">
              ให้เป็นแบบของคุณ
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 font-light max-w-xl mx-auto leading-relaxed mb-8 text-pretty">
            เลือกคอร์สเองหรือเลือกแบบสำเร็จรูป พร้อมอุปกรณ์ศิลปะครบชุด
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button href="/custom-course" size="lg" trailingIcon={<ArrowRightIcon className="w-4 h-4" />}>
              จัดคอร์สเอง
            </Button>
            <Button href="/predefined-courses" variant="secondary" size="lg">
              คอร์สสำเร็จรูป
            </Button>
          </div>
        </div>

        <div className="relative h-64 sm:h-80 md:h-[420px] w-full">
          <Image
            src="/images/arthome1.jpg"
            alt="23 Art Home Studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />
        </div>
      </section>

      {/* Age info strip */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2">
          <div className="inline-flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-art-500" />
            <span className="font-medium text-gray-700">อายุ 4–6 ปี</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">ครั้งละ 1 ชั่วโมง</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-gray-200" />
          <div className="inline-flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-art-600" />
            <span className="font-medium text-gray-700">อายุ 6–12 ปี</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">ครั้งละ 2 ชั่วโมง</span>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="ประเภทคอร์ส"
            title="เลือกแบบที่ใช่สำหรับคุณ"
            subtitle="สามแบบให้เลือก ปรับแต่งได้ตามความสนใจของน้อง"
            className="mb-12 sm:mb-16"
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {COURSE_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={category.route}
                onClick={() => trackEvent('category_view', { category: category.id })}
                className="group relative block bg-[#f5f5f7] rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-transparent hover:border-art-100"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-art-100/0 group-hover:bg-art-100/40 rounded-full blur-2xl transition-all" />
                <div className="relative">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 min-h-[2.5rem]">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-art-600 group-hover:gap-2 transition-all">
                    เลือกคอร์สนี้ <ArrowRightIcon className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24 px-6 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="ทำไมต้อง 23 Art Home"
            title="เรียนรู้อย่างมีคุณภาพ"
            className="mb-12 sm:mb-16"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-6 sm:p-8 text-center rounded-2xl border border-gray-100 hover:border-art-200 hover:shadow-md transition-all"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeader
            title="พร้อมเริ่มแล้วหรือยัง?"
            subtitle="เลือกคอร์สที่เหมาะกับน้อง และเริ่มต้นการเรียนรู้ศิลปะที่สนุกสนาน"
            className="mb-8 sm:mb-10"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/custom-course" size="lg" trailingIcon={<ArrowRightIcon className="w-4 h-4" />}>
              จัดคอร์สเอง 5 ครั้ง
            </Button>
            <Button href="/predefined-courses" variant="secondary" size="lg">
              เลือกคอร์สสำเร็จรูป
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

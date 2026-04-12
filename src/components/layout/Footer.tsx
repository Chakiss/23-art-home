import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12 sm:py-16 px-6 surface">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 md:gap-12 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-art-600 shadow-sm">
                <span className="text-white font-bold text-xs">23</span>
              </div>
              <span className="font-semibold tracking-tight">23 Art Home</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              พัฒนาความคิดสร้างสรรค์และทักษะศิลปะของน้องๆ ในบรรยากาศที่อบอุ่นและเป็นมิตร
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">ติดต่อเรา</h3>
            <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
              <p className="font-medium text-gray-700">คุณอนุรักษ์ สุขนันทศักดิ์</p>
              <p>
                77/1 ซอยจรัญสนิทวงค์ 13
                <br />
                บางแวก บางไผ่ บางแค
                <br />
                กรุงเทพฯ 10160
                <br />
                <span className="text-gray-400">(ในทางเข้าหมู่บ้านธีรินทร์)</span>
              </p>
              <p className="pt-1">📞 085-042-4116, 081-536-4384</p>
              <p>📧 arthomestudio@hotmail.com</p>
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

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">&copy; 2026 23 Art Home. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  );
}

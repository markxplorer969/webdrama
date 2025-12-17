import Link from "next/link";
import { siteConfig, contact, navigation } from "@/config/site";

export default function PrivacyPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-8">
        <Link 
          href={navigation.home} 
          className="text-zinc-400 hover:text-white transition-colors text-sm inline-flex items-center"
        >
          ← Kembali ke Beranda
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-white mb-4">Kebijakan Privasi</h1>
      <p className="text-zinc-400 mb-8">
        Terakhir diperbarui: 1 Januari 2025
      </p>

      <div className="space-y-8 text-zinc-300">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Pendahuluan</h2>
          <p>
            {siteConfig.name} ("kami") berkomitmen untuk melindungi privasi dan keamanan data pribadi pengguna. 
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan platform {siteConfig.name}.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Informasi yang Kami Kumpulkan</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">2.1 Informasi Pribadi</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Alamat email (untuk autentikasi dan komunikasi)</li>
                <li>Nama pengguna (username)</li>
                <li>Kata sandi (dienkripsi dan disimpan secara aman)</li>
                <li>Informasi profil yang Anda berikan secara sukarela</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">2.2 Informasi Penggunaan</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Riwayat menonton drama</li>
                <li>Konten yang Anda sukai atau simpan</li>
                <li>Preferensi dan pengaturan akun</li>
                <li>Waktu dan durasi penggunaan platform</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">2.3 Informasi Teknis</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Alamat IP (anonimisasi)</li>
                <li>Jenis perangkat dan browser</li>
                <li>Sistem operasi</li>
                <li>Informasi lokasi (jika diizinkan)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Tujuan Pengumpulan Data</h2>
          <div className="space-y-2">
            <p><strong>Autentikasi:</strong> Alamat email digunakan untuk tujuan autentikasi dan verifikasi akun.</p>
            <p><strong>Layanan:</strong> Menyediakan akses ke konten dan fitur platform.</p>
            <p><strong>Personalisasi:</strong> Memberikan rekomendasi konten yang sesuai dengan preferensi Anda.</p>
            <p><strong>Keamanan:</strong> Melindungi akun dan mencegah penyalahgunaan.</p>
            <p><strong>Analitik:</strong> Memahami pola penggunaan untuk meningkatkan layanan.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Cookie dan Teknologi Pelacakan</h2>
          <div className="space-y-2">
            <p><strong>Cookie yang Kami Gunakan:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Cookie Essensial:</strong> Untuk menyimpan sesi login dan preferensi pengguna.</li>
              <li><strong>Cookie Analitik:</strong> Untuk memahami bagaimana platform digunakan.</li>
              <li><strong>Cookie Kinerja:</strong> Untuk meningkatkan kecepatan dan pengalaman pengguna.</li>
            </ul>
            <p>Cookie digunakan untuk menyimpan sesi login dan meningkatkan pengalaman pengguna. 
            Anda dapat mengelola preferensi cookie melalui pengaturan browser.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Perlindungan Data</h2>
          <div className="space-y-2">
            <p><strong>Enkripsi:</strong> Semua data pribadi dienkripsi menggunakan teknologi SSL/TLS.</p>
            <p><strong>Penyimpanan Aman:</strong> Data disimpan di server yang aman dengan perlindungan firewall.</p>
            <p><strong>Akses Terbatas:</strong> Hanya personel yang berwenang yang dapat mengakses data pengguna.</p>
            <p><strong>Backup Rutin:</strong> Data di-backup secara rutin untuk mencegah kehilangan data.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Berbagi Data</h2>
          <div className="space-y-2">
            <p><strong>Kami TIDAK menjual data pengguna kepada pihak ketiga.</strong></p>
            <p>Data Anda hanya akan dibagikan dalam keadaan berikut:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dengan persetujuan eksplisit dari Anda</li>
              <li>Untuk memenuhi kewajiban hukum atau perintah pengadilan</li>
              <li>Untuk melindungi hak, properti, atau keselamatan {siteConfig.name} atau pengguna lain</li>
              <li>Dengan penyedia layanan pihak ketiga yang membantu operasi platform (dengan perjanjian kerahasiaan)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Hak Data Pengguna</h2>
          <div className="space-y-2">
            <p>Sebagai pengguna, Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Mengakses:</strong> Meminta salinan data pribadi yang kami simpan.</li>
              <li><strong>Koreksi:</strong> Memperbarui atau memperbaiki data yang tidak akurat.</li>
              <li><strong>Penghapusan:</strong> Meminta penghapusan akun dan data pribadi.</li>
              <li><strong>Portabilitas:</strong> Meminta transfer data ke layanan lain.</li>
              <li><strong>Penolakan:</strong> Menolak pemrosesan data untuk tujuan tertentu.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Retensi Data</h2>
          <div className="space-y-2">
            <p><strong>Data Akun Aktif:</strong> Data disimpan selama akun Anda aktif.</p>
            <p><strong>Data Akun Dihapus:</strong> Data akan dihapus secara permanen dalam 30 hari setelah penghapusan akun.</p>
            <p><strong>Data Anonim:</strong> Data anonim yang digunakan untuk analitik dapat disimpan lebih lama.</p>
            <p><strong>Data Legal:</strong> Data tertentu dapat disimpan untuk memenuhi kewajiban hukum.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">9. Keamanan Anak</h2>
          <p>
            Platform kami tidak ditujukan untuk anak di bawah {siteConfig.app.minAge} tahun. 
            Kami tidak sengaja mengumpulkan informasi pribadi dari anak di bawah {siteConfig.app.minAge} tahun. 
            Jika kami mengetahui bahwa kami telah mengumpulkan informasi dari anak di bawah {siteConfig.app.minAge} tahun, 
            kami akan mengambil langkah-langkah untuk menghapus informasi tersebut segera.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">10. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. 
            Perubahan akan diberitahukan kepada pengguna melalui email atau pemberitahuan di platform. 
            Pengguna disarankan untuk secara berkala meninjau kebijakan ini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">11. Kontak Privasi</h2>
          <div className="space-y-2">
            <p>Jika Anda memiliki pertanyaan atau keluhan tentang privasi data Anda, silakan hubungi:</p>
            <p>
              <strong>Email:</strong> {contact.email}<br/>
              <strong>Subject:</strong> Pertanyaan Privasi
            </p>
            <p>
              Kami akan merespons pertanyaan Anda dalam waktu 7 hari kerja.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">12. Hukum yang Berlaku</h2>
          <p>
            Kebijakan Privasi ini diatur oleh hukum Republik Indonesia, 
            termasuk Undang-Undang Informasi dan Transaksi Elektronik (ITE) dan peraturan perlindungan data pribadi yang berlaku.
          </p>
        </section>
      </div>
    </div>
  );
}
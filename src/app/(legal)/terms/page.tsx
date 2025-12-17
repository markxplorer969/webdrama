import Link from "next/link";
import { siteConfig, contact, navigation } from "@/config/site";

export default function TermsPage() {
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

      <h1 className="text-4xl font-bold text-white mb-4">Syarat & Ketentuan</h1>
      <p className="text-zinc-400 mb-8">
        Terakhir diperbarui: 1 Januari 2025
      </p>

      <div className="space-y-8 text-zinc-300">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Penerimaan Syarat</h2>
          <p>
            Dengan mengakses dan menggunakan platform {siteConfig.name}, Anda setuju untuk terikat oleh syarat dan ketentuan ini. 
            Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh menggunakan layanan kami.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Definisi</h2>
          <div className="space-y-2">
            <p><strong>"Credits"</strong> adalah item virtual yang dapat dibeli pengguna untuk mengakses konten premium di platform {siteConfig.name}.</p>
            <p><strong>"Platform"</strong> merujuk pada situs web dan aplikasi {siteConfig.name}.</p>
            <p><strong>"Konten"</strong> mencakup semua drama pendek, video, dan materi lainnya yang tersedia di platform.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Akun Pengguna</h2>
          <div className="space-y-2">
            <p>• Anda harus berusia minimal {siteConfig.app.minAge} tahun untuk membuat akun.</p>
            <p>• Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi akun Anda.</p>
            <p>• Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda.</p>
            <p>• Anda harus memberikan informasi yang akurat dan lengkap saat pendaftaran.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Credits dan Pembayaran</h2>
          <div className="space-y-2">
            <p><strong>Kebijakan Credits:</strong></p>
            <p>• Credits adalah item virtual dan tidak memiliki nilai moneter dunia nyata.</p>
            <p>• Credits tidak dapat dikonversi menjadi uang tunai atau aset lainnya.</p>
            <p>• Credits yang telah dibeli tidak dapat dikembalikan kecuali ada kesalahan teknis.</p>
            <p>• Credits berlaku selama {siteConfig.app.maxCreditsValidity} dari tanggal pembelian.</p>
            <p>• {siteConfig.name} berhak mengubah harga credits kapan saja tanpa pemberitahuan sebelumnya.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Konten Pengguna</h2>
          <div className="space-y-2">
            <p><strong>Larangan Konten:</strong></p>
            <p>• Pengguna dilarang mengunggah konten ilegal, melanggar hak cipta, atau melanggar hukum.</p>
            <p>• Konten yang mengandung kekerasan, pornografi, atau ujaran kebencian dilarang.</p>
            <p>• Konten yang melanggar privasi pihak ketiga dilarang.</p>
            <p><strong>Hak Kekayaan Intelektual:</strong></p>
            <p>• {siteConfig.name} berhak menghapus konten yang melanggar syarat tanpa pemberitahuan.</p>
            <p>• Pengguna tetap memiliki hak atas konten asli yang mereka unggah.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Peran Platform</h2>
          <p>
            {siteConfig.name} berperan sebagai penyedia platform yang memungkinkan pengguna untuk mengakses dan menikmati konten drama pendek. 
            Kami tidak bertanggung jawab atas konten yang dibuat oleh pengguna pihak ketiga. 
            Kami berhak namun tidak berkewajiban untuk memantau atau mengedit konten pengguna.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Penggunaan yang Diperbolehkan</h2>
          <div className="space-y-2">
            <p>• Mengakses konten untuk penggunaan pribadi dan non-komersial.</p>
            <p>• Mengunduh konten untuk ditonton offline (jika tersedia).</p>
            <p>• Berbagi tautan ke konten di media sosial.</p>
            <p><strong>Larangan:</strong></p>
            <p>• Mendistribusikan ulang konten tanpa izin.</p>
            <p>• Menggunakan konten untuk tujuan komersial.</p>
            <p>• Membuat karya turunan dari konten tanpa izin.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Privasi Data</h2>
          <p>
            Kami mengumpulkan alamat email untuk tujuan autentikasi saja. 
            Kami tidak menjual data pengguna kepada pihak ketiga. 
            Cookie digunakan untuk menyimpan sesi login dan meningkatkan pengalaman pengguna. 
            Informasi lebih lanjut dapat ditemukan dalam Kebijakan Privasi kami.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">9. Pembatasan Tanggung Jawab</h2>
          <p>
            {siteConfig.name} tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari penggunaan platform. 
            Layanan disediakan "sebagaimana adanya" tanpa jaminan apa pun. 
            Kami tidak menjamin ketersediaan platform yang tidak terputus atau bebas dari kesalahan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">10. Perubahan Syarat</h2>
          <p>
            {siteConfig.name} berhak mengubah syarat dan ketentuan ini kapan saja. 
            Perubahan akan berlaku efektif segera setelah dipublikasikan di platform. 
            Pengguna disarankan untuk secara berkala meninjau syarat ini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">11. Pengakhiran</h2>
          <p>
            {siteConfig.name} berhak mengakhiri atau menangguhkan akun pengguna yang melanggar syarat dan ketentuan ini. 
            Pengguna juga dapat menghapus akun mereka kapan saja melalui pengaturan akun.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">12. Hukum yang Berlaku</h2>
          <p>
            Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. 
            Setiap sengketa akan diselesaikan melalui perundingan atau melalui pengadilan yang berwenang di Jakarta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">13. Kontak</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, 
            silakan hubungi kami di {contact.email}
          </p>
        </section>
      </div>
    </div>
  );
}
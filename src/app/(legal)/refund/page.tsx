import Link from "next/link";
import { siteConfig, contact, navigation } from "@/config/site";

export default function RefundPage() {
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

      <h1 className="text-4xl font-bold text-white mb-4">Kebijakan Pengembalian Dana</h1>
      <p className="text-zinc-400 mb-8">
        Terakhir diperbarui: 1 Januari 2025
      </p>

      <div className="space-y-8 text-zinc-300">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Kebijakan Umum</h2>
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 mb-6">
            <p className="text-red-400 font-bold text-lg mb-2">⚠️ PENTING: SEMUA PENJUALAN FINAL</p>
            <p className="text-red-300">
              <strong>ALL SALES ARE FINAL.</strong> Karena {siteConfig.name} menyediakan produk digital (credits dan akses konten), 
              semua penjualan bersifat final dan tidak dapat dikembalikan.
            </p>
          </div>
          <p>
            Produk digital yang dibeli di platform {siteConfig.name} tidak dapat dikembalikan atau ditukar. 
            Ini termasuk namun tidak terbatas pada credits, paket berlangganan, dan akses konten premium.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Kondisi Pengembalian Dana</h2>
          <p>
            Pengembalian dana HANYA akan diproses dalam kondisi berikut:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">2.1 Kesalahan Teknis</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Double Billing:</strong> Anda dikenakan biaya dua kali untuk pembelian yang sama.</li>
                <li><strong>Sistem Error:</strong> Terjadi kesalahan sistem yang menyebabkan pembelian gagal namun dana terpotong.</li>
                <li><strong>Credits Tidak Masuk:</strong> Credits tidak masuk ke akun Anda setelah pembayaran berhasil.</li>
                <li><strong>Akses Gagal:</strong> Tidak dapat mengakses konten yang telah dibayar karena kesalahan teknis dari pihak kami.</li>
              </ul>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">2.2 Kondisi TIDAK Dapat Pengembalian Dana</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Berubah pikiran setelah pembelian</li>
                <li>Tidak suka dengan konten yang dibeli</li>
                <li>Lupa menggunakan credits sebelum masa berlaku habis</li>
                <li>Kesalahan pengguna (salah membeli paket)</li>
                <li>Masalah koneksi internet dari pihak pengguna</li>
                <li>Akun diblokir karena pelanggaran syarat dan ketentuan</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Prosedur Klaim Pengembalian Dana</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">3.1 Waktu Klaim</h3>
              <p>
                Pengguna harus menghubungi layanan pelanggan dalam <strong>{siteConfig.app.refundDeadline} (72 jam)</strong> sejak insiden terjadi. 
                Klaim yang diajukan setelah {siteConfig.app.refundDeadline} tidak akan diproses.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">3.2 Cara Mengajukan Klaim</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Kirim email ke <strong>{contact.email}</strong></li>
                <li>Subject email: <strong>"KLAIM PENGEMBALIAN DANA - [ID Transaksi]"</strong></li>
                <li>Sertakan informasi berikut:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>ID Transaksi (bukti pembayaran)</li>
                    <li>Tanggal dan waktu pembelian</li>
                    <li>Jumlah pembayaran</li>
                    <li>Deskripsi detail masalah</li>
                    <li>Screenshot bukti pembayaran</li>
                    <li>Screenshot error (jika ada)</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">3.3 Proses Verifikasi</h3>
              <p>
                Tim kami akan memverifikasi klaim Anda dalam <strong>2-3 hari kerja</strong>. 
                Kami akan menghubungi Anda jika memerlukan informasi tambahan.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Proses Pengembalian Dana</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">4.1 Metode Pengembalian</h3>
              <p>
                Pengembalian dana akan dilakukan melalui:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Transfer Bank:</strong> Ke rekening yang sama digunakan untuk pembayaran</li>
                <li><strong>E-Wallet:</strong> Ke akun e-wallet asal (OVO, GoPay, Dana, dll)</li>
                <li><strong>Kartu Kredit:</strong> Refund ke kartu kredit yang digunakan</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">4.2 Waktu Proses</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Verifikasi:</strong> 2-3 hari kerja</li>
                <li><strong>Proses Refund:</strong> 5-7 hari kerja</li>
                <li><strong>Total Waktu:</strong> Maksimal 10 hari kerja sejak klaim disetujui</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">4.3 Biaya Administrasi</h3>
              <p>
                {siteConfig.name} tidak mengenakan biaya administrasi untuk pengembalian dana yang disetujui. 
                Namun, biaya transfer dari pihak ketiga (bank atau payment gateway) mungkin berlaku.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Kompensasi Alternatif</h2>
          <p>
            Untuk beberapa kasus tertentu, {siteConfig.name} mungkin menawarkan kompensasi alternatif sebagai ganti pengembalian dana:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Credits Bonus:</strong> Tambahan credits sebagai kompensasi</li>
            <li><strong>Perpanjangan Masa Aktif:</strong> Perpanjangan masa berlaku credits</li>
            <li><strong>Upgrade Paket:</strong> Upgrade ke paket yang lebih tinggi</li>
            <li><strong>Voucher Diskon:</strong> Voucher untuk pembelian berikutnya</li>
          </ul>
          <p className="mt-2">
            Kompensasi alternatif ini bersifat sukarela dan dapat ditolak jika pengguna tetap menginginkan pengembalian dana.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Penyalahgunaan Kebijakan</h2>
          <p>
            {siteConfig.name} berhak menolak klaim pengembalian dana jika:
          </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Terdapat bukti penyalahgunaan kebijakan pengembalian dana</li>
              <li>Pengguna memiliki riwayat klaim yang tidak valid</li>
              <li>Informasi yang diberikan tidak akurat atau palsu</li>
              <li>Klaim diajukan berulang kali untuk transaksi yang sama</li>
            </ul>
          <p className="mt-2">
            Penyalahgunaan kebijakan dapat mengakibatkan pemblokiran akun permanen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Perubahan Kebijakan</h2>
          <p>
            {siteConfig.name} berhak mengubah kebijakan pengembalian dana ini kapan saja. 
            Perubahan akan berlaku efektif segera setelah dipublikasikan di platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Kontak Layanan Pelanggan</h2>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="mb-2">Untuk pertanyaan atau klaim pengembalian dana, hubungi:</p>
            <p>
              <strong>Email:</strong> {contact.email}<br/>
              <strong>WhatsApp:</strong> {contact.whatsappDisplay}<br/>
              <strong>Jam Operasional:</strong> {contact.operatingHours.days}, {contact.operatingHours.hours}<br/>
              <strong>Response Time:</strong> Maksimal 24 jam untuk email pertama
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">9. Hukum yang Berlaku</h2>
          <p>
            Kebijakan pengembalian dana ini diatur oleh hukum Republik Indonesia. 
            Setiap sengketa akan diselesaikan melalui perundingan atau melalui pengadilan yang berwenang di Jakarta.
          </p>
        </section>
      </div>
    </div>
  );
}
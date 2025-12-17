import Link from "next/link";
import { MessageCircle, Mail, ArrowLeft } from "lucide-react";
import { siteConfig, contact, legal, navigation } from "@/config/site";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={navigation.home} 
            className="text-zinc-400 hover:text-white transition-colors text-sm inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Contact Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Hubungi Kami</h1>
            <p className="text-zinc-400">
              Ada pertanyaan? Kami siap membantu Anda.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 mb-8">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Email Support</p>
                  <p className="text-zinc-400 text-sm">{contact.email}</p>
                  <p className="text-zinc-500 text-xs mt-1">Response time: {contact.responseTime.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">WhatsApp Support</p>
                  <p className="text-zinc-400 text-sm">{contact.whatsappDisplay}</p>
                  <p className="text-zinc-500 text-xs mt-1">Response time: {contact.responseTime.whatsapp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="text-center mb-8">
            <p className="text-zinc-400 text-sm mb-2">Jam Operasional</p>
            <p className="text-white font-medium">{contact.operatingHours.days}</p>
            <p className="text-zinc-400">{contact.operatingHours.hours}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={siteConfig.getWhatsappUrl("Halo DramaFlex, saya membutuhkan bantuan")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat via WhatsApp</span>
            </a>

            <a
              href={siteConfig.getMailtoUrl(
                "Pertanyaan - DramaFlex",
                "Halo tim DramaFlex,\n\nSaya memiliki pertanyaan mengenai:\n\n[Namai pertanyaan Anda di sini]\n\nTerima kasih."
              )}
              className="w-full border border-zinc-700 hover:bg-zinc-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email Support</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm mb-3 text-center">Butuh bantuan topik spesifik?</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link 
                href={legal.terms} 
                className="text-zinc-400 hover:text-white transition-colors text-center"
              >
                Syarat & Ketentuan
              </Link>
              <Link 
                href={legal.privacy} 
                className="text-zinc-400 hover:text-white transition-colors text-center"
              >
                Kebijakan Privasi
              </Link>
              <Link 
                href={legal.refund} 
                className="text-zinc-400 hover:text-white transition-colors text-center"
              >
                Pengembalian Dana
              </Link>
              <Link 
                href={legal.faq} 
                className="text-zinc-400 hover:text-white transition-colors text-center"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-zinc-500 text-xs">
            {siteConfig.name} • {siteConfig.description}
          </p>
        </div>
      </div>
    </div>
  );
}
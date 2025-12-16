"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Twitter, Instagram, Youtube } from "lucide-react";
import { siteConfig, contact, links, legal, navigation } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href={navigation.home} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-white font-bold text-xl">{siteConfig.name}</span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex space-x-3">
              <a
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-zinc-400" />
              </a>
              <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-zinc-400" />
              </a>
              <a
                href={links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <Youtube className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Jelajahi</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href={navigation.home} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link 
                  href={navigation.search} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Pencarian
                </Link>
              </li>
              <li>
                <Link 
                  href={navigation.trending} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link 
                  href={navigation.series} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href={legal.terms} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link 
                  href={legal.privacy} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link 
                  href={legal.refund} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Kebijakan Pengembalian Dana
                </Link>
              </li>
              <li>
                <Link 
                  href={legal.contact} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <a 
                  href={siteConfig.getMailtoUrl()}
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <a 
                  href={siteConfig.getWhatsappUrl("Halo DramaFlex, saya membutuhkan bantuan")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  {contact.whatsappDisplay}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="text-zinc-400 text-sm">
                  {contact.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-center text-zinc-400 text-sm">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
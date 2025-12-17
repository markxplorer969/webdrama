export const siteConfig = {
  name: "DramaFlex",
  description: "Platform streaming drama pendek #1 di Indonesia",
  url: "https://dramaflex.xyz",
  
  contact: {
    email: "support@dramaflex.xyz",
    whatsapp: "6287861374108", // Format: Country code without '+'
    whatsappDisplay: "+62 878-6137-4108",
    address: "Karawang, Indonesia",
    operatingHours: {
      days: "Senin - Jumat",
      hours: "09:00 - 18:00 WIB",
    },
    responseTime: {
      email: "24 jam",
      whatsapp: "1-2 jam",
    },
  },
  
  links: {
    instagram: "https://instagram.com/dramaflex",
    tiktok: "https://tiktok.com/@dramaflex.id",
    twitter: "https://twitter.com/dramaflex",
    youtube: "https://youtube.com/@dramaflex",
  },
  
  legal: {
    terms: "/terms",
    privacy: "/privacy", 
    refund: "/refund",
    contact: "/contact",
    faq: "/faq",
  },
  
  navigation: {
    home: "/",
    search: "/search",
    trending: "/trending",
    series: "/series",
    watch: "/watch",
  },
  
  // Helper functions
  getWhatsappUrl: (message: string) => {
    return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  },
  
  getMailtoUrl: (subject?: string, body?: string) => {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    return `mailto:${siteConfig.contact.email}${params.toString() ? `?${params.toString()}` : ''}`;
  },
  
  // Social media sharing
  getShareUrl: (platform: 'twitter' | 'facebook' | 'whatsapp', url: string, title: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'whatsapp':
        return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      default:
        return url;
    }
  },
  
  // SEO and metadata
  metadata: {
    title: "DramaFlex - Platform streaming drama pendek #1 di Indonesia",
    description: "DramaFlex adalah platform streaming drama pendek terbaik di Indonesia dengan ribuan konten berkualitas.",
    keywords: ["streaming", "drama", "drama pendek", "Indonesia", "platform", "konten digital","drama china", " dracin"],
    author: "DramaFlex Team",
    logo: "/logo.svg",
  },
  
  // Business information
  business: {
    companyName: "DramaFlex",
    companyType: "Digital Platform",
    established: "2024",
    version: "2.0.0",
  },
  
  // App configuration
  app: {
    maxCreditsValidity: "12 bulan",
    refundDeadline: "3 hari",
    minAge: 13,
    supportedLanguages: ["id", "en"],
    defaultLanguage: "id",
  }
};

// Export individual sections for easier imports
export const { 
  contact, 
  links, 
  legal, 
  navigation, 
  metadata, 
  business, 
  app 
} = siteConfig;

// Export helper functions
export const { 
  getWhatsappUrl, 
  getMailtoUrl, 
  getShareUrl 
} = siteConfig;

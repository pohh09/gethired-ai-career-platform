class LogoCacheManager {
  constructor() {
    this.brokenLogos = new Set();
    this.knownDomains = {
      flipkart: "flipkart.com",
      razorpay: "razorpay.com",
      zomato: "zomato.com",
      swiggy: "swiggy.in",
      paytm: "paytm.com",
      cred: "cred.club",
      phonepe: "phonepe.com",
      meesho: "meesho.com",
      ola: "olacabs.com",
      zepto: "zeptonow.com",
      blinkit: "blinkit.com",
      groww: "groww.in",
      zerodha: "zerodha.com",
      urbancompany: "urbancompany.com",
      nykaa: "nykaa.com",
      "make-my-trip": "makemytrip.com",
      makemytrip: "makemytrip.com",
      tcs: "tcs.com",
      infosys: "infosys.com",
      wipro: "wipro.com",
      hcl: "hcltech.com",
      techmahindra: "techmahindra.com",
      cognizant: "cognizant.com",
      accenture: "accenture.com",
      stripe: "stripe.com",
      vercel: "vercel.com",
      supabase: "supabase.com",
      linear: "linear.app",
      google: "google.com",
      microsoft: "microsoft.com",
      amazon: "amazon.in",
      meta: "meta.com",
      adobe: "adobe.com",
      salesforce: "salesforce.com",
      atlassian: "atlassian.com",
    };
  }

  markLogoAsBroken(url) {
    if (url && typeof url === "string" && !url.includes("ui-avatars.com")) {
      this.brokenLogos.add(url.trim());
    }
  }

  isLogoBroken(url) {
    if (!url || typeof url !== "string") return true;
    return this.brokenLogos.has(url.trim());
  }

  getCompanyDomain(companyName = "") {
    const clean = companyName.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    if (this.knownDomains[clean]) return this.knownDomains[clean];
    return `${clean}.com`;
  }

  getValidCompanyLogo(companyName = "Tech Employer", rawLogoUrl = "") {
    const cleanCompany = (companyName || "Tech Employer").trim();
    const domain = this.getCompanyDomain(cleanCompany);

    if (rawLogoUrl && typeof rawLogoUrl === "string" && rawLogoUrl.trim() !== "" && !this.isLogoBroken(rawLogoUrl)) {
      return rawLogoUrl.trim();
    }

    const logoDevUrl = `https://img.logo.dev/${domain}?token=pk_anonymous`;
    if (!this.isLogoBroken(logoDevUrl)) {
      return logoDevUrl;
    }

    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    if (!this.isLogoBroken(clearbitUrl)) {
      return clearbitUrl;
    }

    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    if (!this.isLogoBroken(googleFaviconUrl)) {
      return googleFaviconUrl;
    }

    return this.generateInitialsAvatar(cleanCompany);
  }

  generateInitialsAvatar(name) {
    const encoded = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encoded}&background=0284c7&color=fff&bold=true&font-size=0.45`;
  }
}

export const logoCache = new LogoCacheManager();


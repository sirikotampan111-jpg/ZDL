/**
 * English content for the services pages — mirrors services-data.ts by slug.
 * Merged at render time so the Indonesian source of truth stays untouched.
 */
import type { ServiceCategory } from "@/lib/services-data";
import type { Locale } from "@/i18n/config";
import { serviceCategories } from "@/lib/services-data";

type EnCategory = Omit<ServiceCategory, "icon">;

export const serviceCategoriesEn: EnCategory[] = [
  {
    slug: "web-development",
    name: "Web Development",
    shortName: "Web Development",
    tagline: "Fast, polished websites that bring in customers.",
    description:
      "We build websites that don't just look good — they load fast on mobile, are easy to manage, and are designed with the right SEO structure from day one. Every page is developed with conversion in mind: turning visitors into customers.",
    benefits: [
      "Optimized loading speed with green Core Web Vitals",
      "Complete technical SEO: metadata, sitemap, structured data",
      "Mobile-first design that feels right on every screen size",
      "A CMS to manage content without touching code",
    ],
    useCases: [
      "Service businesses that need a credible profile on Google",
      "Brands that want to start earning organic traffic",
      "Companies whose current site is slow and hard to update",
    ],
    items: [
      {
        name: "Landing Page",
        description:
          "A single high-conversion page for ad campaigns, product launches, or specific service offers.",
        benefits: ["Extremely fast to load", "Sales-focused copy structure", "Connected to WhatsApp / a form"],
        examples: ["Product promo landing page", "App pre-launch page", "B2B service offer page"],
      },
      {
        name: "Company Profile",
        description:
          "A complete company website: about, services, portfolio, and articles — building trust with prospective clients.",
        benefits: ["Credibility in clients' eyes", "Content easily updated via CMS", "Local SEO for your service areas"],
        examples: ["Contractor & construction profile", "Professional consultant profile", "School & community profile"],
      },
      {
        name: "Web Application",
        description:
          "Custom web apps that run in the browser: internal systems, booking, data management, up to full business platforms.",
        benefits: ["Accessible from any device", "Automates manual processes", "Scales with your business growth"],
        examples: ["Clinic booking system", "Internal project management app", "Asset lending system"],
      },
      {
        name: "E-Commerce",
        description:
          "An online store with a product catalog, cart, checkout, payment integration, and a complete admin panel.",
        benefits: ["Local payment gateway integration", "Stock & order management", "Mobile-first for phone shoppers"],
        examples: ["SMB online store", "Product catalog + WhatsApp ordering", "Dropshipping & pre-order"],
      },
      {
        name: "Custom Website",
        description:
          "Websites with needs beyond standard templates — designed around your business flow.",
        benefits: ["Features built for your exact needs", "Third-party system integration", "Flexible architecture for growth"],
        examples: ["Community website with membership", "Job board portal", "Business directory & listings"],
      },
    ],
  },
  {
    slug: "application-development",
    name: "Application Development",
    shortName: "App Development",
    tagline: "Custom apps that automate and scale your operations.",
    description:
      "From mobile apps to multi-tenant SaaS, we build applications that replace manual processes and piles of spreadsheets. Every app is designed on a healthy, secure architecture that's ready to grow with your business.",
    benefits: [
      "Business processes automated end-to-end",
      "Centralized, secure data with access control",
      "Modern technology that's easy to maintain long-term",
      "Integration with your existing systems",
    ],
    useCases: [
      "Operations still relying on manual Excel work",
      "Businesses that need an app for field teams",
      "Digital product ideas that want to start from zero",
    ],
    items: [
      {
        name: "Mobile Application",
        description:
          "Android/iOS apps for customers or internal teams — catalogs, attendance, sales tools, up to on-demand services.",
        benefits: ["Can run offline-first", "Push notifications for engagement", "Connected to a central backend"],
        examples: ["Catalog app for sales teams", "Attendance & field patrol app", "Customer service app"],
      },
      {
        name: "SaaS",
        description:
          "Multi-tenant software-as-a-service platforms: your customers subscribe, manage their own accounts, and you control everything from one admin.",
        benefits: ["Multi-tenant & subscriptions", "Admin dashboard & billing", "Scales from 10 to 10,000 users"],
        examples: ["Booking platform for clinics/salons", "Membership management SaaS", "Internal tool sold to a whole industry"],
      },
      {
        name: "CRM",
        description:
          "Customer relationship management shaped around your sales flow — follow-ups, pipelines, and customer interaction history.",
        benefits: ["Pipeline matching your sales process", "Automatic follow-up reminders", "Team performance reports"],
        examples: ["CRM for digital agencies", "Distribution & reseller CRM", "Education/tutoring CRM"],
      },
      {
        name: "Management System",
        description:
          "Operational management systems: inventory, finance, HR, projects, assets — designed from your business's real workflow.",
        benefits: ["Modules tailored to your needs", "Approval workflows", "User activity audit trail"],
        examples: ["Multi-warehouse inventory system", "Construction project management", "Community finance system"],
      },
      {
        name: "Custom Application",
        description:
          "Applications with unique feature combinations not available in off-the-shelf products — built from scratch to your specification.",
        benefits: ["Exact to your specification", "Full ownership of the code", "Evolve module by module"],
        examples: ["Simple IoT monitoring app", "Assessment & online exam system", "Event & ticketing platform"],
      },
    ],
  },
  {
    slug: "business-system",
    name: "Business System",
    shortName: "Business System",
    tagline: "Dashboards and internal systems your team actually uses.",
    description:
      "A good internal system turns scattered data into fast decisions. We build admin dashboards, CMS platforms, monitoring dashboards, database systems, and automation that unite your business data in one source of truth.",
    benefits: [
      "One source of data for the whole team",
      "Real-time reports without manual recap",
      "Role-based access control",
      "Activity history for accountability",
    ],
    useCases: [
      "Sales recaps still assembled manually every morning",
      "Data scattered across many unsynchronized files",
      "Management struggling to monitor operational performance",
    ],
    items: [
      {
        name: "Admin Dashboard",
        description:
          "An admin panel to manage business data: transactions, users, products, content — with a clear KPI summary.",
        benefits: ["KPI summary on the home page", "Full CRUD + search & filters", "Export data to Excel/CSV"],
        examples: ["E-commerce admin panel", "Content management dashboard", "User management panel"],
      },
      {
        name: "CMS",
        description:
          "A custom content management system with a rich text editor, media library, and a draft–review–publish flow.",
        benefits: ["A comfortable article editor", "Centralized media library", "Automatic publishing schedule"],
        examples: ["Corporate journal/article CMS", "Internal news portal CMS", "Product catalog CMS"],
      },
      {
        name: "Monitoring Dashboard",
        description:
          "Real-time monitoring dashboards: sales, occupancy, outlet performance, device status, up to operational KPIs.",
        benefits: ["Data always fresh, automatically", "Alerts when values go out of range", "TV / large-screen display mode"],
        examples: ["Multi-outlet sales monitoring", "Daily production dashboard", "Server/app status monitoring"],
      },
      {
        name: "Database System",
        description:
          "Clean database design and implementation: table structure, relations, backups, and secure access.",
        benefits: ["Healthy & fast data structure", "Backup & recovery plan", "createdAt/updatedAt audit columns"],
        examples: ["Migrate data from Excel to a database", "Redesign a legacy app database", "Simple data warehouse"],
      },
      {
        name: "Automation System",
        description:
          "Workflow automation: automatic notifications, cross-system synchronization, document generation, and simple robotic processes.",
        benefits: ["Saves hours of manual work", "Reduces human error", "Runs 24/7 without supervision"],
        examples: ["Order notifications to WhatsApp", "Automatic invoice generation", "Marketplace → spreadsheet sync"],
      },
    ],
  },
  {
    slug: "productivity",
    name: "Productivity",
    shortName: "Productivity",
    tagline: "Excel and Google Sheets that work for you, not the other way around.",
    description:
      "Spreadsheets are still the main working tool for many businesses — the problem isn't the tool, it's how it's used. We clean up, automate, and turn Excel and Google Sheets into efficient reporting and operational systems.",
    benefits: [
      "Save dozens of manual work hours per month",
      "Consistent reports with a standard format",
      "Clean formulas your team can understand",
      "Runs inside the tools you already have",
    ],
    useCases: [
      "Finance teams still recapping manually at month-end",
      "Sales data scattered across many files",
      "Reports whose format changes every month",
    ],
    items: [
      {
        name: "Microsoft Excel",
        description:
          "Professional Excel modeling: data structure, advanced formulas, pivots, and interactive dashboards.",
        benefits: ["Clean & reusable templates", "Error-proof formulas", "Automatic summary dashboards"],
        examples: ["Monthly financial report", "Per-product sales analysis", "Team commission calculation"],
      },
      {
        name: "Google Sheets",
        description:
          "Collaborative Google Sheets for teams: a simple database, tracking, and integration with Google Forms.",
        benefits: ["Real-time collaboration", "Connected to Forms & Apps Script", "Accessible from anywhere"],
        examples: ["Sales pipeline tracking", "Attendance & shift scheduling", "Warehouse stock monitoring"],
      },
      {
        name: "Excel Automation",
        description:
          "Excel process automation with VBA/Office Scripts: data import, automatic recaps, one-click report generation.",
        benefits: ["One click for the monthly report", "Automatic multi-file consolidation", "Validation of incoming data"],
        examples: ["Auto-recap of daily transactions", "Automatic PO/invoice generation", "Import & cleaning of raw data"],
      },
      {
        name: "Google Sheets Automation",
        description:
          "Automation with Google Apps Script: automatic triggers, notifications, synchronization across sheets and Google services.",
        benefits: ["Automatic email/WhatsApp notifications", "Cross-sheet synchronization", "Runs without being opened"],
        examples: ["Automatic minimum-stock alerts", "Daily reports sent automatically", "Form → database sync"],
      },
      {
        name: "Reporting System",
        description:
          "End-to-end reporting: data collected automatically, processed, and presented as reports management can actually read.",
        benefits: ["Standard, consistent report format", "Report history stored neatly", "Automatic distribution to recipients"],
        examples: ["Weekly sales report", "Monthly operations report", "Management KPI dashboard"],
      },
    ],
  },
  {
    slug: "digital-growth",
    name: "Digital Growth",
    shortName: "Digital Growth",
    tagline: "Organic traffic and ads that are measurable, not just loud.",
    description:
      "A great website needs to be found. We help businesses earn organic traffic through proper SEO — technical, on-page, and off-page — plus digital ad campaigns focused on measurable results, not keyword stuffing.",
    benefits: [
      "A thorough technical SEO audit",
      "Content and structure built for search engines",
      "Transparent progress reporting",
      "Ads with a clear target CPA",
    ],
    useCases: [
      "A good website that never shows up on Google",
      "Wanting leads without depending on continuous ads",
      "Ads running but conversions unclear",
    ],
    items: [
      {
        name: "SEO",
        description:
          "A full SEO strategy: keyword research, content optimization, and technical fixes for the long term.",
        benefits: ["Intent-based keyword research", "Monthly content roadmap", "Position & traffic monitoring"],
        examples: ["Local service SEO", "E-commerce SEO", "B2B SEO"],
      },
      {
        name: "Technical SEO",
        description:
          "Fixing the technical foundation: speed, crawlability, indexing, schema, Core Web Vitals, and internal link structure.",
        benefits: ["A site that's easy to crawl", "Green Core Web Vitals", "Fix indexing errors in Search Console"],
        examples: ["Technical audit of an old site", "Sitemap & robots fixes", "Structured data implementation"],
      },
      {
        name: "On-Page SEO",
        description:
          "On-page optimization: titles, headings, content, internal linking, and information structure matching search intent.",
        benefits: ["Pages that answer search intent", "Metadata that earns clicks", "Correct heading structure"],
        examples: ["Service page optimization", "Rewriting old articles", "Product page optimization"],
      },
      {
        name: "Off-Page SEO & Backlinks",
        description:
          "Building domain authority through quality, relevant backlinks — no spam, no cheap PBNs.",
        benefits: ["Backlinks from relevant sites", "A natural link profile", "Higher domain authority"],
        examples: ["Guest posting in local media", "Business directory listings", "Small-to-mid digital PR"],
      },
      {
        name: "Google Ads & Digital Advertising",
        description:
          "Measurable digital ad campaigns: precise targeting, selling copy, and honest reporting.",
        benefits: ["Precise audience targeting", "Landing pages that match the ad", "Cost-per-result reporting"],
        examples: ["Search Ads for services", "Ads for e-commerce products", "Retargeting website visitors"],
      },
    ],
  },
  {
    slug: "infrastructure",
    name: "Infrastructure",
    shortName: "Infrastructure",
    tagline: "Domain, hosting, professional email — all set up properly.",
    description:
      "The right infrastructure is often invisible — a website that's always online, professional email on your own domain, and SSL that makes visitors feel safe. We set it up and manage it for you.",
    benefits: [
      "Set up right from the start, safe long-term",
      "Professional email on your own domain",
      "SSL & automated deployments",
      "No technical headaches for you",
    ],
    useCases: [
      "A new business about to get its first domain & website",
      "Still using @gmail.com for business communication",
      "A slow website because the hosting doesn't fit",
    ],
    items: [
      {
        name: "Domain",
        description: "Registration and management of domains (.com, .id, .my.id, etc.) under your own name.",
        benefits: ["Ownership under your name", "Clean DNS configuration", "Renewal reminders"],
        examples: ["New domain registration", "Domain migration between registrars", "Subdomain setup for systems"],
      },
      {
        name: "Hosting",
        description: "Hosting recommendations and setup that match your needs and budget — VPS, cloud, or modern platforms.",
        benefits: ["Performance matched to needs", "Scales when traffic grows", "Scheduled backups"],
        examples: ["Hosting for a company profile", "Zero-downtime hosting migration", "Optimizing slow hosting"],
      },
      {
        name: "SSL",
        description: "SSL certificate installation (HTTPS) so your site is trusted and safe in the eyes of visitors and Google.",
        benefits: ["Secure padlock indicator", "An SEO ranking requirement", "Auto-renewal"],
        examples: ["Install a new SSL", "Fix mixed content", "Redirect HTTP → HTTPS"],
      },
      {
        name: "Professional Email",
        description: "Professional email on your own domain (name@yourbusiness.com) using Google Workspace/Zoho.",
        benefits: ["Credible business communication", "Synced across phone & laptop", "Adequate quota and anti-spam"],
        examples: ["Email setup on your domain", "Migrating old email", "Team & alias email setup"],
      },
      {
        name: "Deployment",
        description: "Modern app deployment to cloud platforms (Vercel, VPS) with a clean CI/CD pipeline.",
        benefits: ["Updates without downtime", "Preview environments", "Easy rollback"],
        examples: ["Deploy Next.js to Vercel", "GitHub CI/CD setup", "Deploy to your own VPS"],
      },
    ],
  },
];

/** Services list for the given locale (EN content merged over the ID baseline). */
export function getLocalizedServiceCategories(locale: Locale): ServiceCategory[] {
  if (locale !== "en") return serviceCategories;
  return serviceCategories.map((cat) => {
    const en = serviceCategoriesEn.find((e) => e.slug === cat.slug);
    return en ? { icon: cat.icon, ...en } : cat;
  });
}

export function getLocalizedServiceCategory(slug: string, locale: Locale): ServiceCategory | undefined {
  return getLocalizedServiceCategories(locale).find((c) => c.slug === slug);
}

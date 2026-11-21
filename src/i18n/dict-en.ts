/**
 * English dictionary — mirrors the shape of dict-id.ts.
 * Used for /en/* routes (international visitors).
 */

import type { default as idDict } from "@/i18n/dict-id";

const enDict: typeof idDict = {
  common: {
    menit: "min",
    menitBaca: "min read",
    draft: "Draft",
    share: "Share:",
    shareWA: "Share via WhatsApp",
    shareFB: "Share via Facebook",
    shareX: "Share via X/Twitter",
    copyLink: "Copy article link",
    toc: "Table of contents",
    all: "All",
  },

  nav: {
    consult: "Consult",
    consultProject: "Discuss a project",
    openMenu: "Open navigation menu",
    menuTitle: "Navigation menu",
    ariaMain: "Main navigation",
    brandAria: "ZDL — Home",
    theme: "Toggle theme",
  },

  lang: {
    aria: "Switch language",
    toEn: "Switch to English",
    toId: "Ganti ke Bahasa Indonesia",
    label: "EN",
    labelCurrent: "ID",
  },

  wa: {
    float: "Consult via WhatsApp",
    close: "Dismiss WhatsApp button",
    defaultMsg:
      "Hello ZDL, I'd like to consult about website/app development for my business.",
  },

  footer: {
    blurb:
      "A small web studio in Tangerang, Indonesia. We build and maintain websites, apps, and internal systems for businesses that want a serious digital presence — from local SMBs to industry.",
    navTitle: "Navigation",
    servicesTitle: "Services",
    ariaNav: "Footer links",
    ariaServices: "Services",
    location: "serving all of Indonesia",
    rights: "All rights reserved.",
    websiteBy: "Website by",
  },

  cta: {
    defaultTitle: "Have a plan? Just tell us first",
    defaultDesc:
      "The first consultation is simple: you explain the business problem, we tell you what needs to be built — and what doesn't. If it's a fit, only then do we start.",
    primary: "Chat on WhatsApp",
    secondary: "View Portfolio",
  },

  home: {
    statusNew: "Accepting new projects",
    location: "Tangerang, Indonesia",
    h1Pre: "Websites & business systems that",
    h1Accent: "actually get finished",
    heroBody:
      "ZDL builds and maintains websites, apps, and internal systems for {n} brands — from a Surabaya catering business to oil & gas tank fabrication. Handled directly by people you can actually talk to.",
    ctaPrimary: "Discuss your project",
    ctaDemo: "Try the interactive demos",
    regions: "Tangerang · Jakarta · Jabodetabek — across Indonesia",
    trusted: "Trusted by {n} brands across {m} industries",
    svcEyebrow: "Services",
    svcTitle: "Six service lines, one accountable team",
    svcDesc:
      "Everything is built in-house — nothing is outsourced. When something needs to change, you know exactly who to talk to.",
    whyEyebrow: "Why ZDL",
    whyTitle: "The principles we work by",
    whyDesc: "Not slogans — this is how we work on client projects every day.",
    howEyebrow: "How we work",
    howTitle: "Six stages, no surprises",
    howDesc:
      "From the first conversation to a maintained website — you always know which stage you're in. Projects differ in scale, never in discipline.",
    portEyebrow: "Portfolio",
    portTitle: "Projects that are live, not mockups",
    portDesc:
      "Every website below is live and managed by us. Open the actual sites straight from each project page.",
    demoEyebrow: "Interactive demos",
    demoTitle: "Try it first, then believe it",
    demoDesc:
      "Fully clickable app simulations — point of sale, payroll, warehouse stock, and more. Right in your browser, no sign-up and no install.",
    jrnEyebrow: "ZDL Journal",
    jrnTitle: "Notes from the field",
    jrnDesc:
      "What we learn from building websites for real businesses — written concisely and ready to put into practice.",
    portfolioEmpty:
      "Portfolio coming soon — add your first project through the Admin CMS.",
    journalEmpty: "The first article is coming soon — manage it through the Admin CMS.",
    moreProjects: "+ {n} more projects",
    viewAllPortfolio: "View all portfolio",
    demoCount: "{n} simulations available",
    exploreDemos: "Explore all demos",
    allArticles: "All articles",
    valueProps: [
      {
        title: "Talk to the people who build it",
        description:
          "No account-manager layer. The person in your meeting is the person writing the code — technical decisions happen fast and nothing gets lost in translation.",
      },
      {
        title: "Built to grow, not abandoned",
        description:
          "A modern stack (Next.js, TypeScript, PostgreSQL) with clean documentation. Your website isn't a file you hand over — it's an asset you can move, extend, or audit at any time.",
      },
      {
        title: "Fast on real mobile networks",
        description:
          "Most of your visitors open your site from a phone on 4G. Every page is optimized for that: compressed images, lean JavaScript, server rendering.",
      },
      {
        title: "One accountable team until it's done",
        description:
          "Website, domain, hosting, business email, spreadsheet automation — one place. No coordinating five vendors pointing fingers at each other when something breaks.",
      },
    ],
    processSteps: [
      { name: "Listen", description: "Tell us the problem — we study your business and goals first. Technical talk comes later." },
      { name: "Design", description: "Scope, structure, and priorities agreed in writing before the first line of code." },
      { name: "Build", description: "Progress you can actually see — not a black box for months." },
      { name: "Test", description: "Checked on real phones and real networks: speed, flows, and the corners nobody looks at." },
      { name: "Launch", description: "Deployed with a secure configuration, domain and SSL sorted, ready for visitors." },
      { name: "Maintain", description: "After launch we don't disappear — maintenance, fixes, and continued improvements." },
    ],
  },

  about: {
    metaTitle: "About ZDL — A Digital Development Studio from Tangerang, Indonesia",
    metaDesc:
      "ZDL (Zheng Digital Lab) is a digital development studio helping businesses build websites, apps, internal systems, automation, and digital presence. Based in Tangerang, serving all of Indonesia — and remote-friendly worldwide.",
    ogTitle: "About ZDL — Zheng Digital Lab",
    ogDesc:
      "A digital development studio that helps businesses build websites, apps, internal systems, and automation — with a clear, accountable process.",
    heroEyebrow: "About ZDL",
    heroTitlePre: "A studio that",
    heroTitleAccent: "builds it themselves",
    heroDesc:
      "ZDL (Zheng Digital Lab) is a digital development studio from Tangerang, Indonesia that helps businesses build their digital foundation — websites, apps, internal systems, automation, and digital presence — with a clear process and accountable results.",
    meta: ["Based in Tangerang", "Serving all of Indonesia", "16 active client brands"],
    storyTitle: "It started with a familiar problem",
    story1:
      "Many businesses already know digital matters, but they're stuck between two equally imperfect options: off-the-shelf tools that don't match how the business actually works, or big-vendor budgets that don't make sense yet at their stage of growth.",
    story2:
      "ZDL was built to fill that gap — a development studio that works to solid engineering standards while staying close to the reality of mid-sized businesses: budgets that must be efficient, systems that must ship quickly, and results that must be measurable.",
    story3:
      "We work from {city}, {region} and serve clients across {areas} — most of the process runs online, with in-person meetings available for the Greater Jakarta area.",
    buildTitle: "What we build",
    buildItems: [
      { name: "Websites", detail: "landing pages, company profiles, e-commerce, custom websites" },
      { name: "Applications", detail: "mobile apps, SaaS, CRM, management systems" },
      { name: "Internal systems", detail: "admin dashboards, CMS, monitoring dashboards, database systems" },
      { name: "Automation", detail: "Excel/Google Sheets automation, reporting systems, integrations" },
      { name: "Digital presence", detail: "SEO, digital advertising, domain, hosting, professional email" },
    ],
    buildCta: "Discuss your needs",
    valuesEyebrow: "Principles",
    valuesTitle: "Three things we hold onto",
    valuesDesc:
      "The principles that guide every decision — from how we design systems to how we communicate with you.",
    values: [
      { title: "Solutions, not just products", description: "We routinely turn down unnecessary features. What matters is that the system solves the problem — not that it looks impressive in a demo." },
      { title: "Transparent from day one", description: "Scope, progress, and blockers are communicated as they are. No hidden costs, no promises we can't keep." },
      { title: "Education as part of the work", description: "We explain technical decisions in language you can understand, so you can make better business decisions." },
    ],
    approachEyebrow: "How we work",
    approachTitle: "Seven stages, from listening to maintaining",
    approachDesc:
      "The stages we go through on every project — the scale adapts to complexity, the discipline never changes.",
    approach: [
      { name: "Understand", description: "We start by listening — understanding your business model, operational bottlenecks, and the outcomes you expect. Without the right understanding, any technology just becomes a new cost." },
      { name: "Plan", description: "Requirements become a clear scope, priorities, and work plan. You know what will be built, when, and in which order — before a single line of code is written." },
      { name: "Design", description: "Interfaces and flows are designed for your users, not for feature showcases. Mobile-first, clean, and consistent with your brand." },
      { name: "Develop", description: "Code is written to a maintainable standard: structured, tested, and documented. We use popular modern technologies so future development never depends on one person." },
      { name: "Test", description: "Every feature is checked: cross-device functionality, loading speed on mobile networks, and real usage scenarios — not just 'it works on my laptop'." },
      { name: "Deploy", description: "Launch is done properly: domain, hosting, SSL, and monitoring prepared. Your system goes online securely from day one." },
      { name: "Improve", description: "Digital products aren't one-off projects. We measure usage, maintain the system, and help you develop the next features based on data." },
    ],
    areasBadge: "Service areas",
    areasTitle: "Based in Tangerang, serving all of Indonesia",
    areas1:
      "Our base in {city} puts us in a strategic position to serve {region} and Jakarta — the areas with the highest business activity in Indonesia. For Greater Jakarta (Jabodetabek), in-person meetings can be scheduled around project milestones.",
    areas2:
      "Outside Java, everything runs smoothly online: discovery calls via WhatsApp/Google Meet, written requirement documents, periodic progress demos, and a complete handover with a user guide. Distance never compromises the quality of the work.",
    areasLink: "Discuss a project in your area",
  },

  servicesIndex: {
    metaTitle: "Services — Web Development, Apps, Systems & Digital Growth",
    metaDesc:
      "ZDL services: website development, mobile apps, SaaS, dashboards & internal systems, Excel/Google Sheets automation, SEO, and domain & hosting. Serving Tangerang, Jakarta, all of Indonesia — and remote clients worldwide.",
    ogTitle: "ZDL Services — Web & App Development, Digital Solutions",
    ogDesc:
      "Six end-to-end digital service lines: web development, application development, business systems, productivity, digital growth, and infrastructure.",
    heroEyebrow: "Services",
    heroTitlePre: "One team,",
    heroTitleAccent: "six service lines",
    heroDesc:
      "Websites, apps, internal systems, automation, and digital growth — all built in-house by the same team, no subcontractors. When something needs to change, you know exactly who to talk to.",
    meta: ["6 service lines", "No subcontractors", "Tangerang — across Indonesia"],
    ctaTitle: "Not sure where to start?",
    ctaDesc:
      "That's normal. Most clients arrive with a problem, not a specification. Tell us the problem — we'll help translate it into the right, staged solution.",
    ctaSecondary: "View our portfolio",
  },

  serviceDetail: {
    fitFor: "A good fit for",
    scope: "{name} — service scope",
    benefits: "Benefits",
    examples: "Example use cases",
    consult: "Consult about {name}",
    consultCta: "Discuss your project",
    others: "Other services",
    ctaTitle: "Need {name} for your business?",
    ctaDesc:
      "Tell us what you need via WhatsApp — we'll help map the most suitable solution, with no obligation.",
    ctaSecondary: "Back to all services",
    waCategory: "Hello ZDL, I'm interested in your {name} service. Can we talk first?",
    waItem: "Hello ZDL, I'd like to consult about {name}.",
  },

  portfolio: {
    metaTitle: "Portfolio — ZDL Client Websites Across Industries",
    metaDesc:
      "A portfolio of ZDL client websites across industries: culinary & F&B, property, interior & construction, education, transportation & logistics, industry & energy, and organizations.",
    ogTitle: "ZDL Portfolio — Zheng Digital Lab",
    ogDesc:
      "Client websites built and managed by ZDL — from catering businesses, restaurants, and skincare brands to property developers, sports flooring suppliers, and oil & gas tank fabrication.",
    heroEyebrow: "Client work",
    heroTitlePre: "Websites that are",
    heroTitleAccent: "live today",
    heroTitlePost: " — not mockups",
    heroDesc:
      "{n} client websites that are live and managed by us right now — from a Surabaya catering business to oil & gas tank fabrication. Filter by industry, or open the actual sites from each project page.",
    metaLive: "{n} live projects",
    metaIndustries: "{n} industries",
    metaInhouse: "Built in-house",
    ctaTitle: "Your project could be next",
    ctaDesc:
      "Every project starts with a short conversation. Tell us what you need and see how we would execute it.",
    ctaSecondary: "View our services",
    ariaFilter: "Filter portfolio by category",
    empty: "No projects in this category yet.",
    emptyPre: "Try another category, or",
    emptyLink: "discuss your project",
    emptyPost: "to be the first.",
  },

  portfolioDetail: {
    about: "About the project",
    gallery: "Gallery",
    tech: "Technology",
    client: "Client",
    year: "Year",
    category: "Category",
    viewLive: "View live site",
    sourceCode: "Source code",
    buildSimilar: "Build a similar project",
    back: "Back to portfolio",
    related: "Related projects",
    viewAll: "All portfolio",
    thumbAlt: "Thumbnail of project {name}",
    viewAlt: "Preview of project {name}",
    galleryAlt: "Gallery of project {name}",
    waMsg: "Hello ZDL, I saw the project \"{name}\" on your portfolio. I'd like to build something similar.",
    seoTitle: "{name} — Project Case Study",
    ctaTitle: "Interested in building a project like this?",
    ctaDesc:
      "Tell us your business needs — we help from planning to deployment, with a clear process at every stage.",
    ctaSecondary: "Explore our services",
  },

  journal: {
    metaTitle: "ZDL Journal — Technology, Web Development & Digital Business Articles",
    metaDesc:
      "Read ZDL Journal: web development guides, tutorials, SEO, case studies, and digital business insights from real project experience.",
    ogTitle: "ZDL Journal — Technology & Digital Business Insights",
    ogDesc:
      "Practical articles about web development, apps, SEO, and business systems — written from real project experience.",
    heroEyebrow: "ZDL Journal",
    heroTitlePre: "Notes from",
    heroTitleAccent: "the field",
    heroTitlePost: ", not theory",
    heroDesc:
      "Lessons from building and maintaining websites for 16 real brands — written concisely, without jargon overload, and ready to apply to your business.",
    meta: ["Written from real projects", "Ready to apply"],
    ctaTitle: "Enjoying the read? Wait until we work together.",
    ctaDesc:
      "Our knowledge doesn't stop at articles — discuss your business needs and feel the difference of a technical partner who understands context.",
    ctaSecondary: "View portfolio",
    ariaFilter: "Filter articles by category",
    empty: "No articles in this category yet.",
    emptyPre: "Try another category, or visit the",
    emptyLink: "home page",
    subscribeNote: "New articles are published regularly through ZDL CMS.",
    langNotice:
      "This article was written in Indonesian. Your browser's built-in translation can help you read it.",
  },

  journalDetail: {
    minutes: "{n} min read",
    team: "ZDL Team",
    updated: "Last updated {date}",
    needPartner: "Need a partner to build your business's digital system?",
    needPartnerDesc: "Free consultation via WhatsApp — no strings attached.",
    contact: "Contact ZDL",
    prev: "Previous article",
    next: "Next article",
    ariaPrevNext: "Previous and next articles",
    related: "Related articles",
    featuredAlt: "Article illustration: {name}",
    ctaTitle: "Questions about this topic?",
    ctaDesc:
      "A short WhatsApp chat can answer a lot — tell us your business context and we'll point you in the right direction.",
  },

  demo: {
    metaTitle: "Demos — Try the Systems We Build, Live",
    metaDesc:
      "ZDL's interactive demo lab: try live simulations of point-of-sale apps, booking systems, dashboards, and other systems we can build for your business — no sign-up, no install.",
    ogTitle: "ZDL Demos — Zheng Digital Lab",
    ogDesc:
      "Try live simulations of the apps we build: point of sale, booking, dashboards, and more. All run in the browser, no install.",
    heroEyebrow: "Demo lab",
    heroTitlePre: "Don't just read —",
    heroTitleAccent: "try them live",
    heroDesc:
      "Every demo on this page is a fully working simulation of the systems we most often build for clients — point of sale, payroll, warehouse stock, booking, WhatsApp ordering catalogs. All run in the browser, no sign-up, no install.",
    metaCount: "{n} interactive simulations",
    metaFree: "Free",
    metaMobile: "Mobile friendly",
    ctaTitle: "Want a system like this for your business?",
    ctaDesc:
      "The demos here are lightweight simulations. The real version is built around your business — complete with your data, reports, and integrations.",
    ctaSecondary: "View our services",
    ariaFilter: "Filter demos by category",
    empty: "No demos in this category yet.",
    emptyDesc:
      "New demos are added regularly. Want to see how a specific system works? Contact us — we're happy to set up a live demo session for you.",
  },

  demoDetail: {
    accessWA: "Access via WhatsApp",
    accessPublic: "Try it right away",
    requestAccess: "Request demo access via WhatsApp",
    tryNow: "Try the demo now",
    openNow: "Open the demo",
    reqNote: "This demo requires credentials — they are shared privately via WhatsApp.",
    publicNote: "The demo runs in your browser — no sign-up, no install.",
    about: "About this demo",
    tryThese: "What you can try",
    simNotePre: "Note: all data in this demo is",
    simNoteBold: "simulated data",
    simNotePost:
      " — no real information is stored. The production version is built specifically around your business needs.",
    tech: "Technology",
    category: "Category",
    accessType: "Access type",
    accessWAValue: "Via WhatsApp (credentials)",
    accessPublicValue: "Public — try it now",
    buildReal: "Build the real version for me",
    back: "Back to demo gallery",
    more: "More demos",
    viewAll: "All demos",
    thumbAlt: "Preview of demo {name}",
    seoTitle: "{name} — Interactive Demo by ZDL",
    waReq: "Hello ZDL, I'd like to request access to the \"{name}\" demo. Thank you.",
    waBuild: "Hello ZDL, I saw the \"{name}\" demo. I'd like to build a similar system for my business.",
    ctaTitle: "From simulation to a real system",
    ctaDesc:
      "What you try here is only the surface. The production version includes your business data, reports, security, and integrations — built around your workflow.",
    ctaSecondary: "Explore our services",
  },

  card: {
    demoFallback: "ZDL Demo",
    requestAccess: "Request access",
    canTry: "Try it",
    portfolioFallback: "ZDL Project",
  },

  contact: {
    metaTitle: "Contact — Discuss Your Web & App Project",
    metaDesc:
      "Contact ZDL for website, app, dashboard, and digital system development. WhatsApp, email, or the consultation form — we reply within 1×24 business hours.",
    ogTitle: "Contact ZDL — Zheng Digital Lab",
    ogDesc:
      "Discuss your digital project: websites, apps, internal systems, automation. We reply within 1×24 business hours.",
    heroEyebrow: "Contact",
    heroTitlePre: "Let's discuss",
    heroTitleAccent: "your project",
    heroDesc:
      "Fill in the form below or chat directly via WhatsApp — the first consultation is free and we reply to every request within 1×24 business hours.",
    meta: ["Reply within 1×24 hours", "Mon–Sat 09.00–18.00 WIB (GMT+7)", "First consultation free"],
    formTitle: "Project consultation form",
    requiredNote: "Fields marked with * are required.",
    direct: "Direct contact",
    emailLabel: "Email",
    locationLabel: "Location",
    hoursLabel: "Response hours",
    hours: "Mon–Sat, 09.00–18.00 WIB (GMT+7)",
    social: "Social media",
    beforeTitle: "Before you reach out",
    beforeDesc:
      "No technical documents needed. Just tell us: what your business does, which process you want to improve, and what result you imagine. We'll guide the rest with the right questions.",
    name: "Name",
    namePlaceholder: "Your full name",
    business: "Business / company name",
    businessPlaceholder: "Optional",
    email: "Email",
    whatsapp: "WhatsApp number",
    whatsappPlaceholder: "+62 8xx-xxxx-xxxx",
    projectType: "Project type",
    projectTypePlaceholder: "Choose the type of project you need",
    projectTypes: [
      "Website (Landing Page / Company Profile)",
      "Website (E-Commerce)",
      "Web Application / SaaS",
      "Mobile Application",
      "Dashboard / Internal System",
      "Excel / Google Sheets Automation",
      "SEO / Digital Marketing",
      "Domain / Hosting / Infrastructure",
      "Other / Not sure yet",
    ],
    description: "Project description",
    descriptionPlaceholder:
      "Tell us your business context and what you want to build — the clearer the context, the sharper our recommendation.",
    sending: "Sending...",
    submit: "Discuss Your Project",
    waCta: "Consult via WhatsApp",
    errTitle: "Please check your input",
    errDesc: "Name, a valid email, and a description (min. 10 characters) are required.",
    failTitle: "Failed to send message",
    failDesc: "Something went wrong. Please try again or reach us via WhatsApp.",
    netDesc: "Connection problem. Please try again or reach us via WhatsApp.",
    okTitle: "Message sent!",
    okDesc: "Thank you! The ZDL team will contact you via email/WhatsApp within 1×24 business hours.",
    privacy:
      "By submitting this form, you agree to be contacted by the ZDL team regarding your project. Your data is used for communication purposes only and is never shared with third parties.",
  },

  notFound: {
    title: "Page not found",
    body: "The page you're looking for may have been moved or deleted. Let's get you back on track.",
    home: "Back to Home",
    portfolio: "View Portfolio",
  },
};

export default enDict;

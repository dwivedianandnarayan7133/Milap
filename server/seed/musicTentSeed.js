const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const MusicTentVendor = require("../models/MusicTentVendor");
const MusicTentReview = require("../models/MusicTentReview");

const SEED_VENDORS = [
  {
    name: "Swaraag Royal Symphony & DJ Crew",
    contactPerson: "Arjun Verma",
    phone: "+91 98203 11840",
    email: "arjun@swaraagsymphony.com",
    serviceType: "Music",
    categories: ["DJ", "Live Band", "Sound System", "Stage Lighting", "Microphones"],
    city: "Mumbai",
    locality: "Bandra Kurla Complex (BKC)",
    pinCode: "400051",
    address: "Studio 18, Platinum Enclave, BKC, Mumbai",
    coordinates: { lat: 19.0657, lng: 72.8687 },
    serviceRadiusKm: 60,
    extendedServiceAreas: ["Mumbai", "Thane", "Navi Mumbai", "Lonavala", "Alibaug", "Pune"],
    experienceYears: 11,
    verificationStatus: "Verified",
    rating: 4.9,
    reviewCount: 42,
    description: "Mumbai's most sought-after royal wedding orchestra and high-octane Bollywood & EDM DJ crew. Featuring RCF Line Arrays, intelligent moving-head beams, and multi-instrumentalists.",
    musicPricingBasis: {
      baseHours: 5,
      basePerformers: 4,
      hourlyOvertimeRate: 1500,
      soundCoverageGuests: 800,
      setupTeardownIncluded: true,
      transportIncluded: true,
      transportFeePerKm: 15,
      refundableDeposit: 5000,
    },
    packages: [
      {
        id: "swaraag-pkg-1",
        name: "Royal Sangeet & DJ Bash Package",
        category: "DJ",
        price: 28000,
        isPriceOnRequest: false,
        validityDays: 45,
        durationHours: 5,
        performersCount: 3,
        soundCoverage: "Up to 800 Guests (Dual Line Array)",
        inclusions: [
          "1 Lead Celebrity Bollywood DJ & 1 Emcee",
          "1 Live Punjabi Dhol Master for Baraat & Sangeet",
          "Dual RCF HDL-20 Line Array Sound System",
          "8 Moving-Head Beam Lights & LED Stage Pars",
          "4 Shure SM58 Wireless Microphones",
          "Sound Engineer & Setup/Teardown Crew",
        ],
        exclusions: ["LED Video Wall (available as addon)", "Generator Backup Fuel"],
        optionalExtras: [
          { name: "P3 LED Video Backdrop Wall (16x10 ft)", price: 12000 },
          { name: "Low-Fog Co2 Dry Ice Blast (4 Guns)", price: 4000 },
          { name: "Cold Spark Pyros (8 Fountains)", price: 4500 },
        ],
        isLiveAvailable: true,
        sampleOnly: false,
      },
      {
        id: "swaraag-pkg-2",
        name: "Grand Symphony 7-Piece Live Fusion Band",
        category: "Live Band",
        price: 48000,
        isPriceOnRequest: false,
        validityDays: 30,
        durationHours: 4,
        performersCount: 7,
        soundCoverage: "Up to 1500 Guests",
        inclusions: [
          "7 Musicians: Lead Vocalist, Flutist, Violinist, Keys, Drums, Percussion, Bass",
          "Complete Stage In-Ear Monitors & Digital Mixing Console",
          "Acoustic Tuning & Sound Check 3 Hours Prior",
          "Full Stage Ambience Warm Lighting",
        ],
        exclusions: ["Greenroom Hospitality & Stage Construction"],
        optionalExtras: [
          { name: "Celebrity Guest Vocalist Addition", price: 25000 },
          { name: "Acoustic Cocktail Hours Setup", price: 10000 },
        ],
        isLiveAvailable: true,
        sampleOnly: false,
      },
      {
        id: "swaraag-pkg-3",
        name: "Bespoke Arena Sound & Stadium Audio",
        category: "Event Audio Equipment",
        price: 0,
        isPriceOnRequest: true,
        validityDays: 15,
        durationHours: 8,
        performersCount: 6,
        soundCoverage: "2,000 to 10,000+ Guests",
        inclusions: [
          "Custom Arena Trussing & Rigging",
          "Full Soundcraft Vi3000 Digial Audio Mesh",
          "Dedicated RF Wireless Spectrum Coordinator",
        ],
        exclusions: [],
        optionalExtras: [],
        isLiveAvailable: true,
        sampleOnly: true, // Marked as sample / custom quote needed
      },
    ],
    equipmentDetails: [
      { name: "RCF HDL 20-A Active Line Array", type: "Audio", brand: "RCF Italy", quantity: 8, specs: "1400W Peak, Dual 10-inch Woofers, 2-inch HF Compression Driver" },
      { name: "Pioneer DJM-900NXS2 + CDJ-3000 Set", type: "DJ Console", brand: "Pioneer DJ", quantity: 2, specs: "Flagship 4-channel digital mixer with 96kHz/64-bit digital processing" },
      { name: "Moving Head Sharpie 17R Beams", type: "Lighting", brand: "Clay Paky / Sharpy Clone", quantity: 12, specs: "350W discharge lamp, prism wheel, rainbow effects" },
      { name: "Shure Axient Digital Wireless Mics", type: "Microphones", brand: "Shure", quantity: 6, specs: "Quad-channel digital wireless with AES-256 encryption" },
    ],
    themePortfolios: [
      {
        title: "Sunset Beachside Sangeet - Alibaug",
        category: "DJ",
        description: "Beachfront amphitheatre setup with intelligent warm lighting and 800W deep bass subwoofers for 450 guests.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        tags: ["Beach Wedding", "DJ", "Laser & Moving Heads"],
        estimatedPrice: 75000,
      },
      {
        title: "Royal Taj Palace Live Sufi & Ghazal Evening",
        category: "Live Band",
        description: "Traditional candlelit stage with live sitar, santoor, and tabla resonance for an elite wedding reception.",
        imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
        tags: ["Sufi", "Fusion Band", "Heritage"],
        estimatedPrice: 110000,
      },
    ],
    bookedDates: ["2026-11-28", "2026-12-14"],
  },
  {
    name: "Shehnai Ustad Bismillah Heritage & Nagada Mandal",
    contactPerson: "Ustad Rashid Ali",
    phone: "+91 97110 44521",
    email: "rashid@shehnaiheritage.in",
    serviceType: "Music",
    categories: ["Shehnai", "Dhol", "Singer", "Microphones"],
    city: "Delhi NCR",
    locality: "Chandni Chowk / Connaught Place",
    pinCode: "110001",
    address: "Katra Neel, Chandni Chowk, Delhi",
    coordinates: { lat: 28.6562, lng: 77.2307 },
    serviceRadiusKm: 80,
    extendedServiceAreas: ["Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad", "Jaipur", "Agra"],
    experienceYears: 28,
    verificationStatus: "Verified",
    rating: 4.95,
    reviewCount: 56,
    description: "4th generation classical Shehnai exponents preserving Banaras Gharana auspicious wedding ragas (Raag Bilawal, Raag Bhairav, Raag Yaman). Accompanied by authentic Nagada and Dhol ensembles.",
    musicPricingBasis: {
      baseHours: 4,
      basePerformers: 5,
      hourlyOvertimeRate: 1000,
      soundCoverageGuests: 500,
      setupTeardownIncluded: true,
      transportIncluded: true,
      transportFeePerKm: 12,
      refundableDeposit: 2000,
    },
    packages: [
      {
        id: "shehnai-pkg-1",
        name: "Auspicious Mangal Dhwani Shehnai & Nagada",
        category: "Shehnai",
        price: 14500,
        isPriceOnRequest: false,
        validityDays: 60,
        durationHours: 4,
        performersCount: 5,
        soundCoverage: "Banquet Hall & Courtyard Acoustic",
        inclusions: [
          "2 Master Shehnai Performers (Gharana Classical)",
          "1 Nagada Master & 1 Sur-Petia (Harmonium Drone)",
          "Traditional Brocade Costumes & Royal Turbans",
          "Welcoming Entrance & Mandap Pheras Ragas",
        ],
        exclusions: ["Amplification beyond 4 boundary mics"],
        optionalExtras: [
          { name: "Punjabi Traditional Dhol Duo for Baraat (2 Hours)", price: 6000 },
          { name: "Additional 2 Hours Evening Shehnai Mandap Recital", price: 4000 },
        ],
        isLiveAvailable: true,
        sampleOnly: false,
      },
    ],
    equipmentDetails: [
      { name: "Handcrafted Teakwood Shehnais", type: "Acoustic", brand: "Banaras Heritage", quantity: 6, specs: "Concert pitched in D & E with tuned reeds" },
      { name: "Brass Nagada & Copper Dholaks", type: "Percussion", brand: "Traditional", quantity: 4, specs: "Goatskin hand-tuned rhythm instruments" },
    ],
    themePortfolios: [
      {
        title: "ITC Grand Bharat Welcome Ragas",
        category: "Shehnai",
        description: "Grand gate welcome for 600 wedding guests with traditional morning ragas.",
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
        tags: ["Shehnai", "Traditional", "Delhi Heritage"],
        estimatedPrice: 35000,
      },
    ],
    bookedDates: ["2026-11-22", "2026-12-04"],
  },
  {
    name: "Virasat Royal Mandap & Floral Decorators",
    contactPerson: "Mahendra Singh Chouhan",
    phone: "+91 98290 55198",
    email: "mahendra@virasatmandap.com",
    serviceType: "TentDecor",
    categories: ["Wedding Tent", "Mandap", "Stage", "Floral Decoration", "Entrance", "Reception", "Seating", "Furniture", "Theme Decoration"],
    city: "Jaipur",
    locality: "Amer Road / Vaishali Nagar",
    pinCode: "302021",
    address: "Virasat Art Center, Amer Fort Road, Jaipur",
    coordinates: { lat: 26.9855, lng: 75.8513 },
    serviceRadiusKm: 150,
    extendedServiceAreas: ["Jaipur", "Udaipur", "Jodhpur", "Delhi NCR", "Agra", "Pushkar"],
    experienceYears: 19,
    verificationStatus: "Verified",
    rating: 4.96,
    reviewCount: 68,
    description: "Specialists in Palatial Rajasthani Mandaps, Shekhawati carved arches, pure Rajnigandha & Mogra floral chandeliers, and grand European Glass Orangeries for high-profile weddings.",
    tentPricingBasis: {
      baseAreaSqFt: 3000,
      baseGuestCapacity: 600,
      flowerTypeSupported: ["Fresh Marigold & Mogra", "Dutch Exotic Roses & Carnations", "White Jasmine & Rajnigandha", "Silk Artificial Hybrids"],
      labourIncluded: true,
      transportIncluded: true,
      installationDismantlingIncluded: true,
      extraSqFtRate: 15,
      refundableDeposit: 8000,
    },
    packages: [
      {
        id: "virasat-pkg-1",
        name: "Royal Rajwada 4-Pillar Mandap & Grand Jaimala Stage",
        category: "Mandap",
        price: 48000,
        isPriceOnRequest: false,
        validityDays: 30,
        durationHours: 24,
        performersCount: 0,
        soundCoverage: "N/A",
        inclusions: [
          "Hand-carved 12x12 ft Rajwada Stone-Finish Mandap with Gold Leaf Trim",
          "Fresh Fragrant Mogra & Red Dutch Rose Cascade Chandelier",
          "28x16 ft Elevated Jaimala Stage with Velvet Drapes & Brass Urlis",
          "Bride & Groom Royal High-Back Maharaj Chairs + 8 Havan Stools",
          "Sacred Havan Kund with Smoke Venting Canopy",
          "Installation 18 hours prior with full cleaning and dismantle post-ceremony",
        ],
        exclusions: ["Lawn Grass Protection Flooring (available as addon)"],
        optionalExtras: [
          { name: "50-meter Royal Red Carpet Entrance with 12 Floral Arches", price: 15000 },
          { name: "Moroccan Brass Lantern Night Walkway (40 Lanterns)", price: 7000 },
          { name: "Lotus Floating Basin Water Fountain Centerpiece", price: 5000 },
        ],
        isLiveAvailable: true,
        sampleOnly: false,
      },
      {
        id: "virasat-pkg-2",
        name: "Fairytale Glass Palace Orangerie German Tent",
        category: "Wedding Tent",
        price: 85000,
        isPriceOnRequest: false,
        validityDays: 30,
        durationHours: 36,
        performersCount: 0,
        soundCoverage: "N/A",
        inclusions: [
          "Clear-Span German Aluminium Pagoda Tent (60x40 ft, Waterproof & AC Ready)",
          "Transparent Glass Windows & White Silk Flowing Ceiling Drapes",
          "8 Crystal Chandeliers with Warm Dimmable Ambient Lighting",
          "Engineered Wooden Platform Flooring with Plush Beige Carpet",
          "Round Banquet Tables with Damask Linens & Chiavari Gold Chairs for 250 Guests",
        ],
        exclusions: ["Air Conditioning Units (quoted per tonnage)"],
        optionalExtras: [
          { name: "10-Ton Portable Floor AC Ducting Setup", price: 65000 },
          { name: "Fairy Light Starlight Ceiling Canopy (10,000 Micro LEDs)", price: 30000 },
        ],
        isLiveAvailable: true,
        sampleOnly: false,
      },
      {
        id: "virasat-pkg-3",
        name: "Custom Destination Heritage Palace Decor",
        category: "Theme Decoration",
        price: 0,
        isPriceOnRequest: true,
        validityDays: 20,
        durationHours: 48,
        performersCount: 0,
        soundCoverage: "N/A",
        inclusions: [
          "Full 3D CAD Architectural Venue Rendering",
          "Bespoke Floral Sculptures & Entrance Gateways",
          "Dedicated 40-man Artisan & Carpentry Deployment",
        ],
        exclusions: [],
        optionalExtras: [],
        isLiveAvailable: true,
        sampleOnly: true,
      },
    ],
    equipmentDetails: [
      { name: "German Clear Span Tent Structures", type: "Tent Frame", brand: "Röder Germany", quantity: 4, specs: "Anodized aluminium profile, wind-rated to 100 km/h, flame retardant PVC" },
      { name: "Pure Chiavari Gold Resin Chairs", type: "Furniture", brand: "Luxury Event Ware", quantity: 600, specs: "Ergonomic high-tensile resin with ivory padded cushions" },
      { name: "Bohemian Brass Lanterns & Vintage Urlis", type: "Decor Lighting", brand: "Moradabad Crafts", quantity: 120, specs: "Hand-etched brass with LED flickering candles" },
    ],
    themePortfolios: [
      {
        title: "Amer Fort Midnight Mogra Mandap",
        category: "Mandap",
        description: "Sacred pheras setting overlooking Amer lake with 200kg fresh mogra and golden diya pillars.",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        tags: ["Mandap", "Royal Heritage", "Mogra", "Jaipur"],
        estimatedPrice: 210000,
      },
      {
        title: "Crystal Starlight German Tent Reception",
        category: "Wedding Tent",
        description: "5,000 sq ft weatherproof air-conditioned glass structure with cascading wisteria flowers.",
        imageUrl: "https://images.unsplash.com/photo-1545232979-fbf68fe9ec13?auto=format&fit=crop&w=800&q=80",
        tags: ["German Tent", "Luxury Reception", "Chandeliers"],
        estimatedPrice: 380000,
      },
      {
        title: "Peach & Ivory Vintage Floral Entrance Gate",
        category: "Entrance",
        description: "14-foot monumental arched entry flanked by oversized brass samais and pastel hydrangeas.",
        imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
        tags: ["Entrance", "Pastel", "Exotic Flowers"],
        estimatedPrice: 65000,
      },
    ],
    bookedDates: ["2026-11-20", "2026-12-08", "2026-12-25"],
  },
  {
    name: "Bloom & Canopy Luxury Event Designers",
    contactPerson: "Priya Sundaram",
    phone: "+91 98450 77213",
    email: "priya@bloomcanopy.in",
    serviceType: "Both",
    categories: [
      "Wedding Tent",
      "Mandap",
      "Stage",
      "Floral Decoration",
      "Entrance",
      "DJ",
      "Stage Lighting",
      "Sound System",
      "Theme Decoration",
    ],
    city: "Bengaluru",
    locality: "Indiranagar / Whitefield",
    pinCode: "560038",
    address: "Bloom House, 100 Ft Road, Indiranagar, Bengaluru",
    coordinates: { lat: 12.9784, lng: 77.6408 },
    serviceRadiusKm: 50,
    extendedServiceAreas: ["Bengaluru", "Mysuru", "Coorg", "Chennai", "Hyderabad"],
    experienceYears: 8,
    verificationStatus: "Verified",
    rating: 4.88,
    reviewCount: 35,
    description: "Modern South Indian temple floral concepts with contemporary ambient trussing, state-of-the-art stage lighting, and integrated live sound engineering.",
    musicPricingBasis: {
      baseHours: 4,
      basePerformers: 2,
      hourlyOvertimeRate: 3000,
      soundCoverageGuests: 600,
      setupTeardownIncluded: true,
      transportIncluded: true,
      transportFeePerKm: 30,
      refundableDeposit: 8000,
    },
    tentPricingBasis: {
      baseAreaSqFt: 2500,
      baseGuestCapacity: 500,
      flowerTypeSupported: ["Carnations & Orchids", "Traditional Jasmine & Lotus", "Sunflowers & Greenery"],
      labourIncluded: true,
      transportIncluded: true,
      installationDismantlingIncluded: true,
      extraSqFtRate: 30,
      refundableDeposit: 15000,
    },
    packages: [
      {
        id: "bloom-pkg-1",
        name: "Temple Bells & Lotus South Indian Mandap",
        category: "Mandap",
        price: 42000,
        isPriceOnRequest: false,
        validityDays: 30,
        durationHours: 20,
        performersCount: 0,
        soundCoverage: "N/A",
        inclusions: [
          "Authentic Wooden Pillar Mandap with Traditional Brass Hanging Temple Bells",
          "Fresh Red & White Lotus Pond Surrounds with Mango Leaf Torans",
          "Traditional Brass Kuthu Vilakku Oil Lamps (6 Pairs)",
          "Stage Platform with Banana Trunk & Jasmine Garlands",
        ],
        exclusions: ["Audio Microphones (offered in audio combo)"],
        optionalExtras: [
          { name: "Live Nadaswaram & Thavil Duo (3 Hours)", price: 8000 },
          { name: "Fresh Rose Petal Carpet Shower System", price: 4000 },
        ],
        isLiveAvailable: true,
        sampleOnly: false,
      },
      {
        id: "bloom-pkg-2",
        name: "Sangeet Dance Floor & Moving Intelligent Lighting",
        category: "DJ",
        price: 22000,
        isPriceOnRequest: false,
        validityDays: 30,
        durationHours: 4,
        performersCount: 2,
        soundCoverage: "Up to 500 Guests",
        inclusions: [
          "1 Professional Club & Wedding DJ with Pioneer Console",
          "JBL PRX Series Active Sound (4 Tops + 2 Dual Subs)",
          "Trussing with 6 Sharpy Beams & 12 RGB Stage Flood Lights",
          "Cold Spark Machine (4 Machines for Entry & Ring Exchange)",
        ],
        exclusions: ["Extra Hours beyond 4h"],
        optionalExtras: [
          { name: "Custom Acrylic LED Dance Floor (16x16 ft)", price: 15000 },
        ],
        isLiveAvailable: true,
        sampleOnly: false,
      },
    ],
    equipmentDetails: [
      { name: "JBL Professional PRX 800 Series", type: "Audio", brand: "JBL Pro", quantity: 6, specs: "1500W Wi-Fi controlled powered loudspeaker system" },
      { name: "GrandMA2 Lighting Console", type: "Lighting", brand: "MA Lighting", quantity: 1, specs: "Real-time control of up to 65,536 parameters per session" },
    ],
    themePortfolios: [
      {
        title: "Temple Lotus Pond Mandap - Bangalore Palace",
        category: "Mandap",
        description: "Serene morning wedding setting with thousands of fresh pink lotuses and fragrant tuberose.",
        imageUrl: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80",
        tags: ["Temple Mandap", "Lotus", "South Indian", "Bangalore"],
        estimatedPrice: 160000,
      },
    ],
    bookedDates: ["2026-11-25", "2026-12-18"],
  },
  {
    name: "Rhythm & Bass Local DJ Booth (Community Listing)",
    contactPerson: "Kunal Shinde",
    phone: "+91 99308 92011",
    email: "kunal@rhythmbass.in",
    serviceType: "Music",
    categories: ["DJ", "Sound System"],
    city: "Mumbai",
    locality: "Thane West",
    pinCode: "400601",
    address: "Shop 4, Ram Maruti Road, Thane West",
    coordinates: { lat: 19.1982, lng: 72.9644 },
    serviceRadiusKm: 30,
    extendedServiceAreas: ["Thane", "Mulund", "Kalyan"],
    experienceYears: 4,
    verificationStatus: "Unverified", // Demonstrating unverified listing
    rating: 4.3,
    reviewCount: 9,
    description: "Budget-friendly local DJ and birthday/sangeet sound operator for small to medium gatherings.",
    musicPricingBasis: {
      baseHours: 4,
      basePerformers: 1,
      hourlyOvertimeRate: 1500,
      soundCoverageGuests: 250,
      setupTeardownIncluded: true,
      transportIncluded: false,
      transportFeePerKm: 20,
      refundableDeposit: 2000,
    },
    packages: [
      {
        id: "rhythm-pkg-1",
        name: "Standard Neighborhood Party Sound (Sample Quote)",
        category: "DJ",
        price: 8500,
        isPriceOnRequest: false,
        validityDays: 15,
        durationHours: 4,
        performersCount: 1,
        soundCoverage: "Up to 200 Guests",
        inclusions: [
          "1 Resident DJ with Laptop & Controller",
          "2 JBL 15-inch Powered Speakers on Tripods",
          "2 Wired Microphones",
        ],
        exclusions: ["Stage lighting", "Generator", "Transport beyond 10km"],
        optionalExtras: [
          { name: "Basic Disco Ball & 2 LED Par Cans", price: 1500 },
        ],
        isLiveAvailable: false,
        sampleOnly: true, // Non-live sample price to show "Request quotation" & distinguish verified vs unverified
      },
    ],
    equipmentDetails: [
      { name: "JBL EON 15-inch Powered Speakers", type: "Audio", brand: "JBL", quantity: 2, specs: "Portable 1000W active speaker" },
    ],
    themePortfolios: [],
    bookedDates: [],
  },
];

const SEED_REVIEWS = [
  {
    vendorName: "Swaraag Royal Symphony & DJ Crew",
    customerName: "Rohan & Sneha Singhal",
    rating: 5,
    eventDate: "2026-10-18",
    serviceUsed: "DJ & Live Band",
    comment: "Arjun and his team blew everyone away at our BKC reception! The RCF line arrays had breathtaking clarity and no painful ear fatigue. Every guest stayed on the dance floor until 2 AM.",
    isVerifiedBooking: true,
  },
  {
    vendorName: "Swaraag Royal Symphony & DJ Crew",
    customerName: "Vikramaditya Roy",
    rating: 5,
    eventDate: "2026-09-24",
    serviceUsed: "Sangeet DJ Package",
    comment: "Transparent quotation from day one with all sound coverage and lighting options clearly separated. Zero surprise charges.",
    isVerifiedBooking: true,
  },
  {
    vendorName: "Virasat Royal Mandap & Floral Decorators",
    customerName: "Divya & Kabir Rathore",
    rating: 5,
    eventDate: "2026-10-12",
    serviceUsed: "Royal Rajwada Mandap",
    comment: "The Rajwada stone finish Mandap at our Jaipur wedding felt like something out of a royal fairy tale. Fresh mogra scent filled the entire palace lawn.",
    isVerifiedBooking: true,
  },
  {
    vendorName: "Bloom & Canopy Luxury Event Designers",
    customerName: "Aditi Rao",
    rating: 5,
    eventDate: "2026-10-05",
    serviceUsed: "Temple Bells Mandap",
    comment: "Priya's floral styling and subtle background lighting created such a divine and serene atmosphere for our muhurtham.",
    isVerifiedBooking: true,
  },
];

async function seedMusicTentData() {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb+srv://ananddev:PpxXIVSYPILYgBWf@cluster0.ovdb4wk.mongodb.net/milap?retryWrites=true&w=majority";

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB for Music & Tent seed.");
    }

    // Update existing vendors with new reduced prices
    await MusicTentVendor.deleteMany({});
    await MusicTentReview.deleteMany({});

    console.log("Seeding Music & Tent vendors with reduced pocket-friendly prices...");
    for (const vData of SEED_VENDORS) {
      const vendor = await MusicTentVendor.create(vData);

      // Create reviews for this vendor
      const matchedReviews = SEED_REVIEWS.filter(
        (r) => r.vendorName === vendor.name
      );
      for (const r of matchedReviews) {
        await MusicTentReview.create({
          vendor: vendor._id,
          customerName: r.customerName,
          rating: r.rating,
          eventDate: r.eventDate,
          serviceUsed: r.serviceUsed,
          comment: r.comment,
          isVerifiedBooking: r.isVerifiedBooking,
        });
      }
    }

    console.log("✓ Successfully seeded Music & Tent vendors and reviews!");
  } catch (err) {
    console.error("Seed error:", err.message);
  }
}

module.exports = {
  SEED_VENDORS,
  SEED_REVIEWS,
  seedMusicTentData,
};

if (require.main === module) {
  seedMusicTentData().then(() => {
    mongoose.disconnect();
  });
}

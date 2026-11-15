const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const MusicTentVendor = require("../models/MusicTentVendor");
const MusicTentReview = require("../models/MusicTentReview");

const SEED_VENDORS = [
  {
    "name": "Swaraag Royal Symphony & DJ Crew",
    "contactPerson": "Arjun Verma",
    "phone": "+91 98203 11840",
    "email": "arjun@swaraagsymphony.com",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting",
      "Microphones"
    ],
    "city": "Mumbai",
    "locality": "Bandra Kurla Complex (BKC)",
    "pinCode": "400051",
    "address": "Studio 18, Platinum Enclave, BKC, Mumbai",
    "coordinates": {
      "lat": 19.0657,
      "lng": 72.8687
    },
    "serviceRadiusKm": 60,
    "extendedServiceAreas": [
      "Mumbai",
      "Thane",
      "Navi Mumbai",
      "Lonavala",
      "Alibaug",
      "Pune"
    ],
    "experienceYears": 11,
    "verificationStatus": "Verified",
    "rating": 4.9,
    "reviewCount": 42,
    "description": "Mumbai premier royal wedding DJ and high-octane Bollywood sangeet crew featuring dual RCF Line Arrays and moving-head beam lighting.",
    "packages": [
      {
        "id": "dj-pkg-1",
        "name": "Royal Sangeet & DJ Bash Package",
        "category": "DJ",
        "price": 24000,
        "isPriceOnRequest": false,
        "validityDays": 45,
        "durationHours": 5,
        "performersCount": 3,
        "soundCoverage": "Up to 800 Guests (Dual Line Array)",
        "inclusions": [
          "Lead Bollywood & Punjabi DJ + Emcee",
          "Dual RCF HDL-20 Line Array Sound Rig",
          "8 Moving-Head Sharpy Beams & LED Stage Pars",
          "4 Shure Wireless Microphones & Sound Engineer"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Royal Sangeet Night",
        "category": "DJ",
        "description": "Intelligent lighting and bass for 650 wedding guests.",
        "imageUrl": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Sangeet",
          "Mumbai"
        ],
        "estimatedPrice": 24000
      }
    ],
    "bookedDates": [
      "2026-11-28",
      "2026-12-14"
    ]
  },
  {
    "name": "BassDroppers Visuals & Club DJ Set",
    "contactPerson": "Kabir Malhotra",
    "phone": "+91 98110 54321",
    "email": "kabir@bassdroppers.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Delhi NCR",
    "locality": "Connaught Place / Gurugram",
    "pinCode": "110001",
    "address": "Regal Building, Connaught Place, New Delhi",
    "coordinates": {
      "lat": 28.6315,
      "lng": 77.2167
    },
    "serviceRadiusKm": 50,
    "extendedServiceAreas": [
      "Delhi",
      "Gurugram",
      "Noida",
      "Faridabad",
      "Ghaziabad"
    ],
    "experienceYears": 8,
    "verificationStatus": "Verified",
    "rating": 4.85,
    "reviewCount": 38,
    "description": "Club-grade sound rigs, custom laser mapping, and high-energy Bollywood & Punjabi dance floors for modern wedding parties.",
    "packages": [
      {
        "id": "dj-pkg-2",
        "name": "Electric Sangeet & Cocktail DJ Set",
        "category": "DJ",
        "price": 22000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 4,
        "performersCount": 2,
        "soundCoverage": "Up to 600 Guests",
        "inclusions": [
          "Professional Club DJ & Sound Technician",
          "JBL SRX800 4-Top Sound Rig + 2 Dual Subs",
          "6 Intelligent Moving Sharpy Lights & Strobes",
          "2 Cordless Mics & Setup Crew"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Club Vibe Cocktail Night",
        "category": "DJ",
        "description": "Illuminated DJ console and laser trussing.",
        "imageUrl": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "Club DJ",
          "Cocktail",
          "Delhi"
        ],
        "estimatedPrice": 22000
      }
    ],
    "bookedDates": [
      "2026-11-24",
      "2026-12-10"
    ]
  },
  {
    "name": "DJ NYK Style Bollywood & EDM Remix Rig",
    "contactPerson": "Gaurav Narang",
    "phone": "+91 98188 32190",
    "email": "gaurav@nykremix.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Delhi NCR",
    "locality": "South Extension & Noida",
    "pinCode": "110049",
    "address": "Ring Road, South Extension II, New Delhi",
    "coordinates": {
      "lat": 28.5729,
      "lng": 77.2227
    },
    "serviceRadiusKm": 55,
    "extendedServiceAreas": [
      "Delhi",
      "Noida",
      "Gurugram",
      "Faridabad",
      "Ghaziabad"
    ],
    "experienceYears": 9,
    "verificationStatus": "Verified",
    "rating": 4.9,
    "reviewCount": 51,
    "description": "Renowned electronic & Bollywood dance remixes, heavy bass subs, and synchronous DMX light programming for sangeet & cocktail nights.",
    "packages": [
      {
        "id": "dj-pkg-3",
        "name": "Bollywood Remixes & Visual DJ Console",
        "category": "DJ",
        "price": 18000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 5,
        "performersCount": 2,
        "soundCoverage": "Up to 700 Guests",
        "inclusions": [
          "Senior Wedding & Party DJ",
          "Pioneer Nexus DJ Setup + 4 JBL Tops",
          "2 High-Output 18-inch Subwoofers",
          "Full Stage Truss with LED Pars"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Sangeet Dance Mashup",
        "category": "DJ",
        "description": "Heavy bass wedding party.",
        "imageUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Remix",
          "Delhi"
        ],
        "estimatedPrice": 18000
      }
    ],
    "bookedDates": [
      "2026-11-29"
    ]
  },
  {
    "name": "Rhythm & Bass Local DJ Booth",
    "contactPerson": "Kunal Shinde",
    "phone": "+91 99308 92011",
    "email": "kunal@rhythmbass.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System"
    ],
    "city": "Mumbai",
    "locality": "Thane West & Mulund",
    "pinCode": "400601",
    "address": "Shop 4, Ram Maruti Road, Thane West",
    "coordinates": {
      "lat": 19.1982,
      "lng": 72.9644
    },
    "serviceRadiusKm": 30,
    "extendedServiceAreas": [
      "Thane",
      "Mulund",
      "Kalyan",
      "Navi Mumbai",
      "Mumbai"
    ],
    "experienceYears": 5,
    "verificationStatus": "Unverified",
    "rating": 4.7,
    "reviewCount": 22,
    "description": "Budget-friendly, high-energy local DJ with punchy party speakers for intimate sangeet, haldi, and apartment community celebrations.",
    "packages": [
      {
        "id": "dj-pkg-4",
        "name": "Haldi & Intimate Sangeet DJ Setup",
        "category": "DJ",
        "price": 8500,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 4,
        "performersCount": 1,
        "soundCoverage": "Up to 250 Guests",
        "inclusions": [
          "1 Event DJ with curated Bollywood tracklist",
          "2 Yamaha DXR15 Active Speakers (1100W)",
          "2 Wireless Microphones + Basic Party Lights",
          "Sound Operator and Setup Included"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Terrace Haldi Party",
        "category": "DJ",
        "description": "Compact sound and lively dance tunes.",
        "imageUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Budget",
          "Mumbai"
        ],
        "estimatedPrice": 8500
      }
    ],
    "bookedDates": []
  },
  {
    "name": "Bloom & Canopy Sangeet DJ & Audio Rig",
    "contactPerson": "Siddharth Rao",
    "phone": "+91 98450 78219",
    "email": "sid@bloomcanopyaudio.com",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Bengaluru",
    "locality": "Indiranagar & Whitefield",
    "pinCode": "560038",
    "address": "100 Feet Road, Indiranagar, Bengaluru",
    "coordinates": {
      "lat": 12.9784,
      "lng": 77.6408
    },
    "serviceRadiusKm": 45,
    "extendedServiceAreas": [
      "Bengaluru",
      "Mysuru",
      "Hosur"
    ],
    "experienceYears": 7,
    "verificationStatus": "Verified",
    "rating": 4.88,
    "reviewCount": 33,
    "description": "Versatile wedding DJ blending Bollywood, Punjabi hits, retro disco, and South Indian party beats with crystal clear Bose & JBL sound.",
    "packages": [
      {
        "id": "dj-pkg-5",
        "name": "Cosmopolitan Sangeet Audio & DJ Package",
        "category": "DJ",
        "price": 20000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 5,
        "performersCount": 2,
        "soundCoverage": "Up to 600 Guests",
        "inclusions": [
          "1 Pro Bilingual DJ (Hindi, English, Regional)",
          "Bose ShowMatch Array Speaker System",
          "4 Sharpies + 8 Amber Mood Wash Lights",
          "Wireless Handheld Mics & DJ Console"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Bangalore Palace Lawn Sangeet",
        "category": "DJ",
        "description": "Outdoor open lawn DJ sound and lighting.",
        "imageUrl": "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Bose",
          "Bengaluru"
        ],
        "estimatedPrice": 20000
      }
    ],
    "bookedDates": [
      "2026-12-05"
    ]
  },
  {
    "name": "Desi Beats Dhol & Punjabi Sangeet DJ",
    "contactPerson": "Harpreet Singh",
    "phone": "+91 98112 90123",
    "email": "harpreet@desibeatsdj.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Dhol",
      "Sound System"
    ],
    "city": "Delhi NCR",
    "locality": "West Delhi & Rajouri Garden",
    "pinCode": "110027",
    "address": "Ring Road, Rajouri Garden, New Delhi",
    "coordinates": {
      "lat": 28.6472,
      "lng": 77.1219
    },
    "serviceRadiusKm": 50,
    "extendedServiceAreas": [
      "Delhi",
      "Noida",
      "Gurugram",
      "Chandigarh",
      "Ludhiana"
    ],
    "experienceYears": 12,
    "verificationStatus": "Verified",
    "rating": 4.92,
    "reviewCount": 64,
    "description": "The ultimate big-fat-wedding experience! Live thunderous Punjabi Dhol synchronized with a non-stop Bollywood & Bhangra DJ dance floor.",
    "packages": [
      {
        "id": "dj-pkg-6",
        "name": "Punjabi Dhol + Sangeet DJ Blast",
        "category": "DJ",
        "price": 16000,
        "isPriceOnRequest": false,
        "validityDays": 45,
        "durationHours": 5,
        "performersCount": 4,
        "soundCoverage": "Up to 750 Guests",
        "inclusions": [
          "1 Lead Club & Punjabi Wedding DJ",
          "2 Live Punjabi Dhol Artists for baraat & dance floor",
          "4 High-Power Bass Tops + Dual Subs",
          "RGB Stage Lighting + Wireless Mics"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Bhangra & Bollywood Sangeet Bash",
        "category": "DJ",
        "description": "High energy live dhol and DJ combo.",
        "imageUrl": "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Dhol",
          "Delhi"
        ],
        "estimatedPrice": 16000
      }
    ],
    "bookedDates": [
      "2026-11-20",
      "2026-12-12"
    ]
  },
  {
    "name": "DJ Shadow Style Royal Wedding Beats",
    "contactPerson": "Sameer Sheikh",
    "phone": "+91 98210 65432",
    "email": "sameer@shadowweddingbeats.com",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Mumbai",
    "locality": "Juhu & Bandra West",
    "pinCode": "400049",
    "address": "JVPD Scheme, Juhu, Mumbai",
    "coordinates": {
      "lat": 19.1075,
      "lng": 72.8263
    },
    "serviceRadiusKm": 60,
    "extendedServiceAreas": [
      "Mumbai",
      "Goa",
      "Udaipur",
      "Jaipur",
      "Pune"
    ],
    "experienceYears": 14,
    "verificationStatus": "Verified",
    "rating": 4.96,
    "reviewCount": 78,
    "description": "International wedding DJ specialist performing at luxury destination weddings with multi-genre mashups and concert-grade acoustics.",
    "packages": [
      {
        "id": "dj-pkg-7",
        "name": "Celebrity Wedding DJ Experience",
        "category": "DJ",
        "price": 26000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 5,
        "performersCount": 3,
        "soundCoverage": "Up to 1000 Guests",
        "inclusions": [
          "Celebrity Style DJ & Master Emcee",
          "Dual L-Acoustics Sound System",
          "12 Intelligent Beam Lights & Hazer",
          "Custom Monogram Projection & Shure Mics"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Luxury Destination Sangeet",
        "category": "DJ",
        "description": "Concert grade lighting and sound.",
        "imageUrl": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Celebrity",
          "Mumbai"
        ],
        "estimatedPrice": 26000
      }
    ],
    "bookedDates": [
      "2026-12-01"
    ]
  },
  {
    "name": "SonicWave Line Array Arena Audio & DJ",
    "contactPerson": "Nitin Patel",
    "phone": "+91 98205 77123",
    "email": "nitin@sonicwaveaudio.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Mumbai",
    "locality": "Lower Parel & Worli",
    "pinCode": "400013",
    "address": "Senapati Bapat Marg, Lower Parel, Mumbai",
    "coordinates": {
      "lat": 18.9986,
      "lng": 72.8306
    },
    "serviceRadiusKm": 50,
    "extendedServiceAreas": [
      "Mumbai",
      "Navi Mumbai",
      "Thane",
      "Pune"
    ],
    "experienceYears": 10,
    "verificationStatus": "Verified",
    "rating": 4.86,
    "reviewCount": 45,
    "description": "Stadium sound engineering scaled for grand banquets. Line array columns, deep sub-bass distribution, and DJ consoles for zero audio delay.",
    "packages": [
      {
        "id": "dj-pkg-8",
        "name": "Stadium Line Array & Sangeet DJ Rig",
        "category": "DJ",
        "price": 25000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 6,
        "performersCount": 4,
        "soundCoverage": "Up to 1200 Guests",
        "inclusions": [
          "Lead DJ + Audio System Engineer",
          "Full Line Array Hanging Rig (RCF/DB)",
          "Digital Soundcraft Mixing Console",
          "Moving Beams, Warm White Pars & Cordless Mics"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Grand Banquet Sound & DJ",
        "category": "DJ",
        "description": "Massive line array setup for 1000 guests.",
        "imageUrl": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Sound System",
          "Mumbai"
        ],
        "estimatedPrice": 25000
      }
    ],
    "bookedDates": [
      "2026-12-18"
    ]
  },
  {
    "name": "Sunset Groove Beachside DJ & Live Sax",
    "contactPerson": "Rohan D Souza",
    "phone": "+91 98200 44321",
    "email": "rohan@sunsetgroove.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Live Band"
    ],
    "city": "Mumbai",
    "locality": "Alibaug, Juhu & Versova",
    "pinCode": "400061",
    "address": "Versova Beach Road, Andheri West, Mumbai",
    "coordinates": {
      "lat": 19.1351,
      "lng": 72.8142
    },
    "serviceRadiusKm": 70,
    "extendedServiceAreas": [
      "Mumbai",
      "Alibaug",
      "Lonavala",
      "Goa",
      "Daman"
    ],
    "experienceYears": 9,
    "verificationStatus": "Verified",
    "rating": 4.93,
    "reviewCount": 52,
    "description": "Chic sundowner & cocktail wedding entertainment. Tropical house, retro Bollywood, and live saxophone playing alongside the DJ console.",
    "packages": [
      {
        "id": "dj-pkg-9",
        "name": "Sundowner Cocktail DJ + Live Saxophone",
        "category": "DJ",
        "price": 22000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 4,
        "performersCount": 2,
        "soundCoverage": "Up to 500 Guests",
        "inclusions": [
          "Specialist Sundowner & Dance DJ",
          "1 Live Saxophone Artist jamming with DJ",
          "Weather-Resistant Outdoor Acoustic Sound Rig",
          "Warm Ambient Bistro Stage Lighting"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Alibaug Villa Sundowner",
        "category": "DJ",
        "description": "Beachfront wedding cocktail party.",
        "imageUrl": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Saxophone",
          "Mumbai"
        ],
        "estimatedPrice": 22000
      }
    ],
    "bookedDates": [
      "2026-11-27"
    ]
  },
  {
    "name": "DJ Chetas Style Bollywood Mashup DJ",
    "contactPerson": "Vikram Joshi",
    "phone": "+91 98220 18456",
    "email": "vikram@mashupdj.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Pune",
    "locality": "Koregaon Park & Baner",
    "pinCode": "411001",
    "address": "North Main Road, Koregaon Park, Pune",
    "coordinates": {
      "lat": 18.5362,
      "lng": 73.894
    },
    "serviceRadiusKm": 45,
    "extendedServiceAreas": [
      "Pune",
      "Lonavala",
      "Pimpri-Chinchwad",
      "Mumbai"
    ],
    "experienceYears": 8,
    "verificationStatus": "Verified",
    "rating": 4.84,
    "reviewCount": 39,
    "description": "High energy non-stop Bollywood mashups, Punjabi anthems, and retro remixes designed to keep every uncle, aunty, and youngster on the dance floor.",
    "packages": [
      {
        "id": "dj-pkg-10",
        "name": "Non-Stop Bollywood Mashup Sangeet Set",
        "category": "DJ",
        "price": 19000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 5,
        "performersCount": 2,
        "soundCoverage": "Up to 600 Guests",
        "inclusions": [
          "1 Non-Stop Mashup Party DJ",
          "4 Active QSC Tops + 2 Subwoofers",
          "Full Moving Heads Truss System",
          "Special Dance-Floor Fog Machine"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Pune Resort Sangeet Night",
        "category": "DJ",
        "description": "Packed dance floor with custom mashups.",
        "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Mashup",
          "Pune"
        ],
        "estimatedPrice": 19000
      }
    ],
    "bookedDates": [
      "2026-12-04"
    ]
  },
  {
    "name": "Electra Club DJ & Cold Spark FX",
    "contactPerson": "Aditya Kulkarni",
    "phone": "+91 98225 33441",
    "email": "aditya@electraclubdj.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Pune",
    "locality": "Viman Nagar & Kalyani Nagar",
    "pinCode": "411014",
    "address": "Clover Park, Viman Nagar, Pune",
    "coordinates": {
      "lat": 18.5679,
      "lng": 73.9143
    },
    "serviceRadiusKm": 40,
    "extendedServiceAreas": [
      "Pune",
      "Mahabaleshwar",
      "Lonavala"
    ],
    "experienceYears": 6,
    "verificationStatus": "Verified",
    "rating": 4.82,
    "reviewCount": 29,
    "description": "Special effects integrated DJ rig! Cold pyrotechnic spark fountains, low-lying dry ice fog for bridal entry, and booming bass.",
    "packages": [
      {
        "id": "dj-pkg-11",
        "name": "Cold Spark Entry & Sangeet DJ Combo",
        "category": "DJ",
        "price": 18500,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 4,
        "performersCount": 3,
        "soundCoverage": "Up to 500 Guests",
        "inclusions": [
          "Party DJ with Bollywood & Commercial tracks",
          "4 Sparkular Cold Pyros for couple entry",
          "Heavy Fog Machine for clouds effect",
          "JBL Sound System + Stage Lighting"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Bridal Entry with Cold Sparks",
        "category": "DJ",
        "description": "Pyrotechnic and DJ entrance effect.",
        "imageUrl": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Sparks",
          "Pune"
        ],
        "estimatedPrice": 18500
      }
    ],
    "bookedDates": []
  },
  {
    "name": "Royal Rajputana Sangeet DJ & Sound System",
    "contactPerson": "Bhawani Singh Rathore",
    "phone": "+91 94140 88219",
    "email": "bhawani@rajputanadj.in",
    "serviceType": "Music",
    "categories": [
      "DJ",
      "Sound System",
      "Stage Lighting"
    ],
    "city": "Jaipur",
    "locality": "C-Scheme & Vaishali Nagar",
    "pinCode": "302001",
    "address": "MI Road, C-Scheme, Jaipur",
    "coordinates": {
      "lat": 26.9157,
      "lng": 75.8035
    },
    "serviceRadiusKm": 70,
    "extendedServiceAreas": [
      "Jaipur",
      "Udaipur",
      "Jodhpur",
      "Pushkar",
      "Delhi"
    ],
    "experienceYears": 13,
    "verificationStatus": "Verified",
    "rating": 4.95,
    "reviewCount": 68,
    "description": "Palace wedding sound specialist! Royal Rajasthani welcome folk tunes transitioning into explosive Bollywood & Punjabi DJ dance floors.",
    "packages": [
      {
        "id": "dj-pkg-12",
        "name": "Royal Heritage Palace DJ & Sound Package",
        "category": "DJ",
        "price": 17000,
        "isPriceOnRequest": false,
        "validityDays": 45,
        "durationHours": 5,
        "performersCount": 3,
        "soundCoverage": "Up to 800 Guests",
        "inclusions": [
          "Lead Wedding DJ + Folk Music Curator",
          "High-Output Electro-Voice Sound System",
          "8 Moving Sharpy Lights & Amber Washers",
          "Heritage Stage Backdrop Lighting"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Jaipur Palace Courtyard Sangeet",
        "category": "DJ",
        "description": "Heritage sound and light for royal wedding.",
        "imageUrl": "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80",
        "tags": [
          "DJ",
          "Palace",
          "Jaipur"
        ],
        "estimatedPrice": 17000
      }
    ],
    "bookedDates": [
      "2026-11-26"
    ]
  },
  {
    "name": "Royal Rajwada Canopy Tent Decorators",
    "contactPerson": "Devendra Rathore",
    "phone": "+91 98201 44556",
    "email": "devendra@rajwadamandap.com",
    "serviceType": "TentDecor",
    "categories": [
      "Tent & Canopy",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Mumbai",
    "locality": "Bandra West & Juhu",
    "pinCode": "400050",
    "address": "Linking Road, Bandra West, Mumbai",
    "coordinates": {
      "lat": 19.0596,
      "lng": 72.8295
    },
    "serviceRadiusKm": 60,
    "extendedServiceAreas": [
      "Mumbai",
      "Thane",
      "Navi Mumbai",
      "Alibaug",
      "Lonavala",
      "Pune"
    ],
    "experienceYears": 18,
    "verificationStatus": "Verified",
    "rating": 4.97,
    "reviewCount": 84,
    "description": "Specialists in royal red velvet canopy tents, gold-embroidered valances, chandeliers, and luxury indoor/outdoor wedding canopy setups.",
    "packages": [
      {
        "id": "tent-pkg-1",
        "name": "Royal Red Rajwada Velvet Canopy Setup",
        "category": "Tent & Canopy",
        "price": 28000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "Handcrafted Crimson Red Velvet Royal Canopy Tent (20x20 ft)",
          "Pure Zari Embroidered Ceiling Valance & Golden Tassels",
          "Centerpiece Crystal Chandelier with Warm Dimmable Ambient Glow",
          "Low Maharaja Diwan Baithak with Silk Bolsters & Cushions"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Royal Rajwada Canopy Tent Decorators",
        "category": "Tent & Canopy",
        "description": "Specialists in royal red velvet canopy tents, gold-embroidered valances, chandeliers, and luxury indoor/outdoor wedding canopy setups.",
        "imageUrl": "/images/tents/tent-1.jpg",
        "tags": [
          "Tent & Canopy",
          "Wedding"
        ],
        "estimatedPrice": 28000
      }
    ],
    "bookedDates": [
      "2026-11-21",
      "2026-12-07"
    ]
  },
  {
    "name": "Grand Floral Jaimala Stage & Backdrop",
    "contactPerson": "Mahendra Singh Chouhan",
    "phone": "+91 98290 55198",
    "email": "mahendra@virasatmandap.com",
    "serviceType": "TentDecor",
    "categories": [
      "Jaimala Stage",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Jaipur",
    "locality": "Amer Road & C-Scheme",
    "pinCode": "302001",
    "address": "Virasat Art Center, Amer Fort Road, Jaipur",
    "coordinates": {
      "lat": 26.9855,
      "lng": 75.8513
    },
    "serviceRadiusKm": 120,
    "extendedServiceAreas": [
      "Jaipur",
      "Udaipur",
      "Jodhpur",
      "Pushkar",
      "Delhi NCR"
    ],
    "experienceYears": 21,
    "verificationStatus": "Verified",
    "rating": 4.96,
    "reviewCount": 92,
    "description": "Exquisite luxury floral wall backdrops, poolside wedding stages, royal velvet sofa seating, and ambient warm spotlights.",
    "packages": [
      {
        "id": "tent-pkg-2",
        "name": "Grand Floral Jaimala Stage & Royal Sofa Setup",
        "category": "Jaimala Stage",
        "price": 26000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "24x12 ft Grand Fresh Floral Stage Wall (Roses, Carnations & Lilies)",
          "Royal Carved High-Back Maharaja Double Sofa Couch",
          "Carpeted Wooden Platform Stage with Golden Fascia Border",
          "Warm LED Focus Stage Spotlights & Candle Pedestals"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Grand Floral Jaimala Stage & Backdrop",
        "category": "Jaimala Stage",
        "description": "Exquisite luxury floral wall backdrops, poolside wedding stages, royal velvet sofa seating, and ambient warm spotlights.",
        "imageUrl": "/images/tents/tent-2.jpg",
        "tags": [
          "Jaimala Stage",
          "Wedding"
        ],
        "estimatedPrice": 26000
      }
    ],
    "bookedDates": [
      "2026-11-25",
      "2026-12-15"
    ]
  },
  {
    "name": "Circular Floral Ring Jaimala Stage",
    "contactPerson": "Poonam Saxena",
    "phone": "+91 94142 66311",
    "email": "poonam@marigoldmagic.in",
    "serviceType": "TentDecor",
    "categories": [
      "Jaimala Stage",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Delhi NCR",
    "locality": "West Delhi & Chandni Chowk",
    "pinCode": "110027",
    "address": "Ring Road, Rajouri Garden, New Delhi",
    "coordinates": {
      "lat": 28.6472,
      "lng": 77.1219
    },
    "serviceRadiusKm": 50,
    "extendedServiceAreas": [
      "Delhi",
      "Noida",
      "Gurugram",
      "Faridabad"
    ],
    "experienceYears": 10,
    "verificationStatus": "Verified",
    "rating": 4.94,
    "reviewCount": 68,
    "description": "Modern circular floral ring arch with hanging Edison bulbs, golden flower pedestals, and customized romantic couple stage decor.",
    "packages": [
      {
        "id": "tent-pkg-3",
        "name": "Circular Floral Ring Arch & Edison Light Stage",
        "category": "Jaimala Stage",
        "price": 24000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 12,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "10-Foot Circular Steel Frame Clad with Dense Fresh White & Red Roses",
          "Hanging Vintage Edison Bulb Clusters with Dimmable Warm Glow",
          "Twin Golden Cylindrical Pedestals with Floral Urns",
          "Designer Couple Sofa / Velvet Love Seat with Stage Carpeting"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Circular Floral Ring Jaimala Stage",
        "category": "Jaimala Stage",
        "description": "Modern circular floral ring arch with hanging Edison bulbs, golden flower pedestals, and customized romantic couple stage decor.",
        "imageUrl": "/images/tents/tent-3.jpg",
        "tags": [
          "Jaimala Stage",
          "Wedding"
        ],
        "estimatedPrice": 24000
      }
    ],
    "bookedDates": [
      "2026-11-20",
      "2026-12-01"
    ]
  },
  {
    "name": "Boho Chic Mehndi Canopy & Baithak Lounge",
    "contactPerson": "Pandit Rameshwar Sharma",
    "phone": "+91 94500 81234",
    "email": "rameshwar@kashimandap.in",
    "serviceType": "TentDecor",
    "categories": [
      "Baithak & Shamiana",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Lucknow",
    "locality": "Varanasi Cantt & Lucknow",
    "pinCode": "221002",
    "address": "Cantonment Road, Varanasi / Lucknow",
    "coordinates": {
      "lat": 25.3283,
      "lng": 82.981
    },
    "serviceRadiusKm": 100,
    "extendedServiceAreas": [
      "Varanasi",
      "Lucknow",
      "Prayagraj",
      "Gorakhpur"
    ],
    "experienceYears": 20,
    "verificationStatus": "Verified",
    "rating": 4.97,
    "reviewCount": 88,
    "description": "Vibrant ethnic printed canopies, low diwan floor baithak with round bolsters, colorful pom-poms, and Rajasthani umbrellas.",
    "packages": [
      {
        "id": "tent-pkg-4",
        "name": "Boho Mehndi Canopy & Low Baithak Lounge",
        "category": "Baithak & Shamiana",
        "price": 20000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "Multi-Colored Ethnic Block-Printed Canopy Tent (18x18 ft)",
          "12 Floor Mattresses (Gaddas) with Saffron & Teal Silk Covers",
          "24 Round Ethnic Bolsters & Tasseled Floor Cushions",
          "Hanging Mirror-Work Parasols & Festive Tassels"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Boho Chic Mehndi Canopy & Baithak Lounge",
        "category": "Baithak & Shamiana",
        "description": "Vibrant ethnic printed canopies, low diwan floor baithak with round bolsters, colorful pom-poms, and Rajasthani umbrellas.",
        "imageUrl": "/images/tents/tent-4.jpg",
        "tags": [
          "Baithak & Shamiana",
          "Wedding"
        ],
        "estimatedPrice": 20000
      }
    ],
    "bookedDates": [
      "2026-11-19",
      "2026-12-14"
    ]
  },
  {
    "name": "Yellow Marigold Haldi Canopy & Urli Setup",
    "contactPerson": "Rajesh Mehra",
    "phone": "+91 98118 76543",
    "email": "rajesh@shahitoren.com",
    "serviceType": "TentDecor",
    "categories": [
      "Haldi & Floral Decor",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Delhi NCR",
    "locality": "Chattarpur Farms & Mehrauli",
    "pinCode": "110074",
    "address": "Main Chattarpur Road, New Delhi",
    "coordinates": {
      "lat": 28.5023,
      "lng": 77.1818
    },
    "serviceRadiusKm": 60,
    "extendedServiceAreas": [
      "Delhi",
      "Gurugram",
      "Noida",
      "Faridabad"
    ],
    "experienceYears": 16,
    "verificationStatus": "Verified",
    "rating": 4.93,
    "reviewCount": 74,
    "description": "Fresh yellow and orange marigold drapes canopy, dual brass urlis on green turf, floral backdrop, and ritual seating stools.",
    "packages": [
      {
        "id": "tent-pkg-5",
        "name": "Traditional Yellow Marigold Haldi & Urli Package",
        "category": "Haldi & Floral Decor",
        "price": 16000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "14x14 ft Yellow & White Sheer Drapery Cube Canopy",
          "500 Fresh Marigold (Genda Phool) Hanging Floral Garlands",
          "Pair of Large Traditional Brass Urlis Filled with Rose Petals",
          "Green Artificial Grass Carpet Base & Ritual Wooden Stools (Patlas)"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Yellow Marigold Haldi Canopy & Urli Setup",
        "category": "Haldi & Floral Decor",
        "description": "Fresh yellow and orange marigold drapes canopy, dual brass urlis on green turf, floral backdrop, and ritual seating stools.",
        "imageUrl": "/images/tents/tent-5.jpg",
        "tags": [
          "Haldi & Floral Decor",
          "Wedding"
        ],
        "estimatedPrice": 16000
      }
    ],
    "bookedDates": [
      "2026-11-23",
      "2026-12-05"
    ]
  },
  {
    "name": "Royal Floral Entrance Gate & Red Carpet Walkway",
    "contactPerson": "Nikhil Kapoor",
    "phone": "+91 98101 77334",
    "email": "nikhil@sheeshmahaldecor.com",
    "serviceType": "TentDecor",
    "categories": [
      "Entrance & Passage",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Delhi NCR",
    "locality": "Aerocity, Gurugram & Dwarka",
    "pinCode": "110037",
    "address": "Hospitality District, Aerocity, New Delhi",
    "coordinates": {
      "lat": 28.5501,
      "lng": 77.1215
    },
    "serviceRadiusKm": 60,
    "extendedServiceAreas": [
      "Delhi",
      "Gurugram",
      "Noida",
      "Faridabad"
    ],
    "experienceYears": 14,
    "verificationStatus": "Verified",
    "rating": 4.95,
    "reviewCount": 81,
    "description": "Grand arched floral toran dwar entrance, dramatic fabric draping, fairy light tunnel, and 80-foot red carpet walkway.",
    "packages": [
      {
        "id": "tent-pkg-6",
        "name": "Grand Floral Toran Gate & 80-Foot Red Carpet Passage",
        "category": "Entrance & Passage",
        "price": 22000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "20-Foot Grand Arched Welcome Gate with Fresh Pink & Yellow Florals",
          "80-Foot Luxury Crimson Red Carpet Runway Aisle",
          "Dramatic Side Draping with Golden Tassels & 16 Vintage Lanterns",
          "Overhead Fairy Light Starlit Tunnel with Welcome Floral Urns"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Royal Floral Entrance Gate & Red Carpet Walkway",
        "category": "Entrance & Passage",
        "description": "Grand arched floral toran dwar entrance, dramatic fabric draping, fairy light tunnel, and 80-foot red carpet walkway.",
        "imageUrl": "/images/tents/tent-6.jpg",
        "tags": [
          "Entrance & Passage",
          "Wedding"
        ],
        "estimatedPrice": 22000
      }
    ],
    "bookedDates": [
      "2026-12-02",
      "2026-12-16"
    ]
  },
  {
    "name": "Illuminated Royal Jaimala Throne Stage",
    "contactPerson": "Syed Tariq Mirza",
    "phone": "+91 94150 12890",
    "email": "tariq@awadhidastarkhwan.in",
    "serviceType": "TentDecor",
    "categories": [
      "Jaimala Stage",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Lucknow",
    "locality": "Gomti Nagar & Hazratganj",
    "pinCode": "226010",
    "address": "Vipin Khand, Gomti Nagar, Lucknow",
    "coordinates": {
      "lat": 26.8532,
      "lng": 80.9984
    },
    "serviceRadiusKm": 80,
    "extendedServiceAreas": [
      "Lucknow",
      "Kanpur",
      "Ayodhya",
      "Varanasi"
    ],
    "experienceYears": 17,
    "verificationStatus": "Verified",
    "rating": 4.91,
    "reviewCount": 55,
    "description": "Multi-tiered grand wedding stage with carved golden throne chairs, floral arches, crystal chandelier headers, and stage pyros.",
    "packages": [
      {
        "id": "tent-pkg-7",
        "name": "Illuminated Grand Royal Jaimala Throne Stage",
        "category": "Jaimala Stage",
        "price": 34000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "30x16 ft Multi-Tiered Carpeted Grand Stage Platform",
          "Pair of Golden Carved Royal King & Queen Throne Chairs",
          "Three-Arch Floral Truss Crown with Cascading White & Red Flowers",
          "Three Crystal Chandeliers & Warm LED Backlit Pillars"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Illuminated Royal Jaimala Throne Stage",
        "category": "Jaimala Stage",
        "description": "Multi-tiered grand wedding stage with carved golden throne chairs, floral arches, crystal chandelier headers, and stage pyros.",
        "imageUrl": "/images/tents/tent-7.jpg",
        "tags": [
          "Jaimala Stage",
          "Wedding"
        ],
        "estimatedPrice": 34000
      }
    ],
    "bookedDates": [
      "2026-11-30"
    ]
  },
  {
    "name": "Traditional Red & Gold Bridal Mandap Canopy",
    "contactPerson": "Ananya Swaminathan",
    "phone": "+91 98451 90123",
    "email": "ananya@rajnigandhalawn.com",
    "serviceType": "TentDecor",
    "categories": [
      "Mandap",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Bengaluru",
    "locality": "Palace Grounds & Hebbal",
    "pinCode": "560006",
    "address": "Bellary Road, Gate 4 Palace Grounds, Bengaluru",
    "coordinates": {
      "lat": 13.0067,
      "lng": 77.5813
    },
    "serviceRadiusKm": 50,
    "extendedServiceAreas": [
      "Bengaluru",
      "Mysuru",
      "Nandi Hills"
    ],
    "experienceYears": 12,
    "verificationStatus": "Verified",
    "rating": 4.92,
    "reviewCount": 63,
    "description": "Traditional deep red velvet and zari embroidered bridal canopy, hanging fresh mogra garlands, sacred havankund, and brass lamps.",
    "packages": [
      {
        "id": "tent-pkg-8",
        "name": "Shahi Red & Gold Vedic Bridal Mandap Canopy",
        "category": "Mandap",
        "price": 30000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "Traditional 4-Pillar Carved Wooden Mandap with Red Velvet Draping",
          "Golden Zari Embroidered Overhead Ceiling Canopy (Chhatra)",
          "Hanging Fresh Mogra & Tuberoses Floral Toran Garlands",
          "Copper Havankund with Ghee Stools & 4 Traditional Low Phera Chowkis"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Traditional Red & Gold Bridal Mandap Canopy",
        "category": "Mandap",
        "description": "Traditional deep red velvet and zari embroidered bridal canopy, hanging fresh mogra garlands, sacred havankund, and brass lamps.",
        "imageUrl": "/images/tents/tent-8.jpg",
        "tags": [
          "Mandap",
          "Wedding"
        ],
        "estimatedPrice": 30000
      }
    ],
    "bookedDates": [
      "2026-11-23",
      "2026-12-11"
    ]
  },
  {
    "name": "Luxury White Shamiana & Low Diwan Lounge",
    "contactPerson": "Venkatesh Iyer",
    "phone": "+91 98402 33118",
    "email": "venkat@dakshinvivah.in",
    "serviceType": "TentDecor",
    "categories": [
      "Baithak & Shamiana",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Bengaluru",
    "locality": "Jayanagar & Malleshwaram",
    "pinCode": "560011",
    "address": "Kanmari Road, 4th Block, Jayanagar, Bengaluru",
    "coordinates": {
      "lat": 12.9299,
      "lng": 77.5833
    },
    "serviceRadiusKm": 60,
    "extendedServiceAreas": [
      "Bengaluru",
      "Mysuru",
      "Chennai",
      "Coimbatore"
    ],
    "experienceYears": 22,
    "verificationStatus": "Verified",
    "rating": 4.98,
    "reviewCount": 110,
    "description": "Scalloped white royal canvas shamiana with royal blue floor gaddas, low diwan cushions, lanterns, and open lawn starlit canopy.",
    "packages": [
      {
        "id": "tent-pkg-9",
        "name": "Luxury White Scalloped Shamiana & Blue Diwan Baithak",
        "category": "Baithak & Shamiana",
        "price": 25000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "Premium Scalloped White Canvas Shamiana with Tasseled Valance (25x25 ft)",
          "16 Floor Mattresses (Gaddas) in Rich Royal Blue Velvet Sheen",
          "32 Round Silk Bolsters & Floor Cushions for Guest Lounge Seating",
          "Vintage Iron Lanterns with Warm Fairy Lights along Border"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Luxury White Shamiana & Low Diwan Lounge",
        "category": "Baithak & Shamiana",
        "description": "Scalloped white royal canvas shamiana with royal blue floor gaddas, low diwan cushions, lanterns, and open lawn starlit canopy.",
        "imageUrl": "/images/tents/tent-9.jpg",
        "tags": [
          "Baithak & Shamiana",
          "Wedding"
        ],
        "estimatedPrice": 25000
      }
    ],
    "bookedDates": [
      "2026-11-22",
      "2026-12-03"
    ]
  },
  {
    "name": "Pastel Welcome Arch & Floral Photo Booth",
    "contactPerson": "Karan Salgaonkar",
    "phone": "+91 98204 90112",
    "email": "karan@swarnamahal.in",
    "serviceType": "TentDecor",
    "categories": [
      "Photo Booth & Entrance",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Mumbai",
    "locality": "Lower Parel & Juhu",
    "pinCode": "400013",
    "address": "Senapati Bapat Marg, Lower Parel, Mumbai",
    "coordinates": {
      "lat": 18.9986,
      "lng": 72.8306
    },
    "serviceRadiusKm": 50,
    "extendedServiceAreas": [
      "Mumbai",
      "Thane",
      "Navi Mumbai",
      "Pune"
    ],
    "experienceYears": 13,
    "verificationStatus": "Verified",
    "rating": 4.94,
    "reviewCount": 71,
    "description": "Pastel blush and eucalyptus floral frame, customized couple name easel stand, vintage lanterns, and photo-booth corner.",
    "packages": [
      {
        "id": "tent-pkg-10",
        "name": "Pastel Garden Welcome Arch & Floral Photo Booth",
        "category": "Photo Booth & Entrance",
        "price": 18000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "Pastel Geometric Wooden Frame with Blush Roses & Eucalyptus Leaves",
          "Customized Wooden Welcome Easel Board with Couple Initials & Date",
          "Vintage White Floor Lanterns & Pillar Candles Base",
          "Dedicated Warm Backlighting for Social Media Smartphone Photography"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Pastel Welcome Arch & Floral Photo Booth",
        "category": "Photo Booth & Entrance",
        "description": "Pastel blush and eucalyptus floral frame, customized couple name easel stand, vintage lanterns, and photo-booth corner.",
        "imageUrl": "/images/tents/tent-10.jpg",
        "tags": [
          "Photo Booth & Entrance",
          "Wedding"
        ],
        "estimatedPrice": 18000
      }
    ],
    "bookedDates": [
      "2026-12-06"
    ]
  },
  {
    "name": "Hydraulic Revolving Jaimala Stage Decorators",
    "contactPerson": "Jignesh Shah",
    "phone": "+91 98250 91823",
    "email": "jignesh@megatents.in",
    "serviceType": "TentDecor",
    "categories": [
      "Jaimala Stage",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Ahmedabad",
    "locality": "SG Highway & Bopal",
    "pinCode": "380054",
    "address": "SG Highway, Bodakdev, Ahmedabad",
    "coordinates": {
      "lat": 23.0338,
      "lng": 72.5073
    },
    "serviceRadiusKm": 150,
    "extendedServiceAreas": [
      "Ahmedabad",
      "Vadodara",
      "Surat",
      "Rajkot",
      "Udaipur"
    ],
    "experienceYears": 17,
    "verificationStatus": "Verified",
    "rating": 4.89,
    "reviewCount": 79,
    "description": "Motorized 12-foot revolving hydraulic stage, floral ring skirtings, dual entry ramp, synchronized cold pyros, and dry-ice fog.",
    "packages": [
      {
        "id": "tent-pkg-11",
        "name": "12-Foot Motorized Revolving Hydraulic Stage Setup",
        "category": "Jaimala Stage",
        "price": 38000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 36,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "Heavy Duty 12-Foot Rotating Hydraulic Stage with Smooth Speed Control",
          "Dense Fresh Carnation & Orchid Floral Skirting along Revolving Edge",
          "Twin Entry Elevated Stairway with Golden Railings & Red Carpet",
          "Technician On-Site + 4 Synchronized Cold Pyro Sparkulars for Varmala"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Hydraulic Revolving Jaimala Stage Decorators",
        "category": "Jaimala Stage",
        "description": "Motorized 12-foot revolving hydraulic stage, floral ring skirtings, dual entry ramp, synchronized cold pyros, and dry-ice fog.",
        "imageUrl": "/images/tents/tent-11.jpg",
        "tags": [
          "Jaimala Stage",
          "Wedding"
        ],
        "estimatedPrice": 38000
      }
    ],
    "bookedDates": [
      "2026-12-08"
    ]
  },
  {
    "name": "Golden Satin Wedding Celebration Pandal",
    "contactPerson": "Bhawani Singh Rathore",
    "phone": "+91 94140 88219",
    "email": "bhawani@vrindavanmandap.in",
    "serviceType": "TentDecor",
    "categories": [
      "Pandal & Stage",
      "Wedding Decor",
      "Theme Decor"
    ],
    "city": "Jaipur",
    "locality": "Vaishali Nagar & Mansarovar",
    "pinCode": "302020",
    "address": "Queens Road, Vaishali Nagar, Jaipur",
    "coordinates": {
      "lat": 26.9084,
      "lng": 75.7487
    },
    "serviceRadiusKm": 70,
    "extendedServiceAreas": [
      "Jaipur",
      "Mathura",
      "Vrindavan",
      "Delhi NCR",
      "Agra"
    ],
    "experienceYears": 15,
    "verificationStatus": "Verified",
    "rating": 4.96,
    "reviewCount": 82,
    "description": "Grand golden-yellow satin pleated backdrop, royal double sofa, crystal chandeliers, floral borders, and full VIP dining shamiana.",
    "packages": [
      {
        "id": "tent-pkg-12",
        "name": "Grand Golden Satin Celebration Pandal & Stage",
        "category": "Pandal & Stage",
        "price": 42000,
        "isPriceOnRequest": false,
        "validityDays": 30,
        "durationHours": 24,
        "performersCount": 0,
        "soundCoverage": "N/A",
        "inclusions": [
          "40x20 ft Golden Yellow Satin Pleated Drapery Stage Backdrop",
          "Royal Carved Double High-Back Golden Sofa Couch",
          "Four Large Crystal Chandeliers & Warm Halo Focus Lighting",
          "Fresh Lily, Rose & Carnation Border Headers along Whole Stage"
        ]
      }
    ],
    "themePortfolios": [
      {
        "title": "Golden Satin Wedding Celebration Pandal",
        "category": "Pandal & Stage",
        "description": "Grand golden-yellow satin pleated backdrop, royal double sofa, crystal chandeliers, floral borders, and full VIP dining shamiana.",
        "imageUrl": "/images/tents/tent-12.jpg",
        "tags": [
          "Pandal & Stage",
          "Wedding"
        ],
        "estimatedPrice": 42000
      }
    ],
    "bookedDates": [
      "2026-11-26"
    ]
  }
];

async function seedMusicTentData(disconnectOnDone = true) {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/milap";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB for Music & Tent seed.");
    }

    console.log("Seeding Music & Tent vendors (12 DJ & Sound + 12 Tent Decoration in 100% English)...");

    // Clear existing vendors
    await MusicTentVendor.deleteMany({});
    await MusicTentReview.deleteMany({});

    const createdVendors = await MusicTentVendor.insertMany(SEED_VENDORS);
    console.log(`✓ Successfully seeded ${createdVendors.length} Music & Tent vendors!`);

    // Add sample reviews
    const reviewsToInsert = [];
    for (const v of createdVendors) {
      reviewsToInsert.push({
        vendor: v._id,
        customerName: "Aakash Sharma",
        rating: 5,
        comment: `Exceptional service by ${v.name}! The arrangements were breathtaking and the crowd loved it.`,
        serviceUsed: v.serviceType === "Music" ? "DJ & Sound" : "Tent & Decoration",
        isVerifiedBooking: true,
      });
      reviewsToInsert.push({
        vendor: v._id,
        customerName: "Priyanka Roy",
        rating: 4.8,
        comment: "Punctual, professional, and completely stress-free coordination. Highly recommended for family events!",
        serviceUsed: v.serviceType === "Music" ? "DJ & Sound" : "Tent & Decoration",
        isVerifiedBooking: true,
      });
    }

    await MusicTentReview.insertMany(reviewsToInsert);
    console.log(`✓ Seeded ${reviewsToInsert.length} reviews for Music & Tent vendors!`);

    if (disconnectOnDone) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
    }
  } catch (err) {
    console.error("Error seeding Music & Tent data:", err);
    throw err;
  }
}

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
    vendorName: "Royal Rajwada Canopy Tent Decorators",
    customerName: "Kavita & Aditya Mathur",
    rating: 5,
    eventDate: "2026-10-25",
    serviceUsed: "Tent & Decoration",
    comment: "The crimson velvet canopy and crystal chandelier were absolutely majestic. All our guests complimented the royal palace ambiance!",
    isVerifiedBooking: true,
  }
];

if (require.main === module) {
  seedMusicTentData(true)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedMusicTentData, SEED_VENDORS, SEED_REVIEWS };

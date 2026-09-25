export const seedCategories = [
  {
    name: 'Dental Materials',
    slug: 'dental-materials',
    icon: 'Sparkles',
    description: 'Direct and indirect restorative materials, composites, cements, bonding agents, and impression compounds.',
    subcategories: [
      { name: 'Composite', slug: 'composite', description: 'Light-cure hybrid, flowable, and nanofill restorative composites.' },
      { name: 'Bonding Agents', slug: 'bonding-agents', description: '7th gen universal adhesives and total-etch dental bonding agents.' },
      { name: 'Impression Materials', slug: 'impression-materials', description: 'Alginates, A-silicones, polyethers, and bite registration.' },
      { name: 'Cement', slug: 'cement', description: 'Glass ionomer, resin cements, and temporary luting cements.' },
      { name: 'Etching Materials', slug: 'etching-materials', description: 'Phosphoric acid etching gels and surface conditioners.' },
      { name: 'Temporary Filling', slug: 'temporary-filling', description: 'Premixed cavity sealing pastes and temporary cements.' },
      { name: 'Matrices & Wedges', slug: 'matrices-wedges', description: 'Sectional matrices, saddle matrix kits, and fender wedges.' }
    ]
  },
  {
    name: 'Dental Instruments',
    slug: 'dental-instruments',
    icon: 'Wrench',
    description: 'Surgical, diagnostic, restorative hand instruments, handpieces, and scaler tips.',
    subcategories: [
      { name: 'Handpieces', slug: 'handpieces', description: 'High speed push button airotor and E-generator LED handpieces.' },
      { name: 'Scalers & Tips', slug: 'scalers-tips', description: 'Ultrasonic scaler tips G1, G2, G4, P1 and tip packs.' },
      { name: 'Burs & Trimmers', slug: 'burs-trimmers', description: 'Stone burs, carbide metal trimming burs, and finishers.' },
      { name: 'Trays', slug: 'trays', description: 'Stainless steel metal trays and autoclavable plastic impression trays.' },
      { name: 'Light Cure Units', slug: 'light-cure-units', description: 'High-power cordless broadband LED curing lights.' }
    ]
  },
  {
    name: 'Endodontics',
    slug: 'endodontics',
    icon: 'Activity',
    description: 'Root canal rotary & hand files, obturation materials, endomotors, apex locators, and canal medicaments.',
    subcategories: [
      { name: 'Endo Equipment', slug: 'endo-equipment', description: 'Cordless endomotors with LED, apex locators, and obturation pluggers.' },
      { name: 'Files', slug: 'files', description: 'NiTi rotary files, reciprocating files, and hand K-files.' },
      { name: 'Gutta Percha & Paper Points', slug: 'gutta-percha-paper-points', description: 'Standardized and taper GP points and absorbent paper points.' },
      { name: 'Medicaments & Pastes', slug: 'medicaments-pastes', description: 'Calcium hydroxide (Cal, Cal-Plus with iodoform), EDTA gels.' },
      { name: 'Irrigation Needles', slug: 'irrigation-needles', description: 'Dual side-vented endodontic canal irrigation needles.' }
    ]
  },
  {
    name: 'Infection Control',
    slug: 'infection-control',
    icon: 'ShieldCheck',
    description: 'Medical examination gloves, surgical sutures, barrier sleeves, and equipment maintenance sprays.',
    subcategories: [
      { name: 'Gloves', slug: 'gloves', description: 'Medical grade latex examination and blue powder-free nitrile gloves.' },
      { name: 'Surgical Sutures', slug: 'surgical-sutures', description: 'Medsilk black braided silk, Medcryl absorbable polyglactin sutures.' },
      { name: 'Barrier Sleeves', slug: 'barrier-sleeves', description: 'Digital X-Ray RVG sensor protective barrier sleeves.' },
      { name: 'Equipment Sprays', slug: 'equipment-sprays', description: 'Handpiece lubricant cleaning sprays and surface disinfectants.' }
    ]
  },
  {
    name: 'Consumables',
    slug: 'consumables',
    icon: 'Package',
    description: 'Daily clinical disposables, saliva ejector suction tips, cotton rolls, mixing pads, and syringes.',
    subcategories: [
      { name: 'Suction Tips', slug: 'suction-tips', description: 'Disposable saliva ejectors and surgical aspirator tips.' },
      { name: 'Cotton Products', slug: 'cotton-products', description: '100% pure absorbent dental cotton rolls (Pack of 1000).' },
      { name: 'Syringes & Needles', slug: 'syringes-needles', description: 'Unolok 2.5ml disposable Luer lock syringes with needles.' },
      { name: 'Applicator Tips', slug: 'applicator-tips', description: 'Micro-applicator brush tips for bonding and etching.' },
      { name: 'Mixing Pads', slug: 'mixing-pads', description: 'Non-stick waterproof coated dental mixing pads.' },
      { name: 'Local Anaesthesia', slug: 'local-anaesthesia', description: 'Lignocaine 2% with Adrenaline 30ml vials.' }
    ]
  },
  {
    name: 'Prophylaxis & Oral Care',
    slug: 'prophylaxis-oral-care',
    icon: 'Sparkles',
    description: 'Tooth whitening bleaching kits, air polishing prophylaxis powders, polishing pastes, and fluoride gels.',
    subcategories: [
      { name: 'Bleaching & Whitening', slug: 'bleaching-whitening', description: 'In-office tooth whitening bleaching kits with gingival barrier.' },
      { name: 'Prophy Powders', slug: 'prophy-powders', description: 'Aero Blast sodium bicarbonate and glycine air polishing powders.' },
      { name: 'Polishing Pastes', slug: 'polishing-pastes', description: 'Diamond fine grit composite & enamel polishing pastes.' },
      { name: 'Fluoride Gels', slug: 'fluoride-gels', description: 'Topical thixotropic fluoride gels with strawberry flavour.' }
    ]
  }
];

export const seedProducts = [
  // ==========================================
  // PAGE 1: COVER & SPECIAL FEATURED PRODUCTS
  // ==========================================
  {
    name: 'True Endo Cordless Endomotor with LED & Built-in Apex Locator',
    slug: 'true-endo-cordless-endomotor-led',
    brand: 'True Endo Medical',
    sku: 'IE-TE-EM-LED',
    hsnCode: '90184900',
    categorySlug: 'endo-equipment',
    price: 7500,
    mrp: 9900,
    discount: 24,
    gstPercent: 18,
    stock: 35,
    lowStockThreshold: 5,
    packSize: '1 Complete Unit (Handpiece + Charging Base + Contra-angle Head)',
    manufacturer: 'Integrity Enterprises / True Endo',
    expiryInfo: '24 Months Comprehensive Manufacturer Warranty',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-endomotor-led.jpg',
      '/images/products/true-endo-endomotor-p2-card.jpg'
    ],
    description: 'High-precision brushless cordless endodontic motor with 16:1 mini contra-angle, 360° rotatable head, integrated OLED screen, continuous rotation & reciprocating angles for ProTaper, WaveOne, and True Endo files.',
    specifications: {
      'Speed Range': '100 - 1000 RPM',
      'Torque Range': '0.4 - 5.0 N.cm',
      'Battery': '1500mAh Lithium-ion (8 hours continuous battery life)',
      'Display': 'OLED Screen with Real-Time Torque Auto-Reverse',
      'Warranty': '24 Months Replacement Warranty'
    }
  },
  {
    name: 'Prime Luting Tempute Eugenol-Free Temporary Luting Cement',
    slug: 'prime-luting-tempute-temporary-cement',
    brand: 'Prime Dental Products',
    sku: 'IE-PRIME-TEMPUTE',
    hsnCode: '30064000',
    categorySlug: 'cement',
    price: 480,
    mrp: 650,
    discount: 26,
    gstPercent: 12,
    stock: 60,
    lowStockThreshold: 10,
    packSize: 'Paste-Paste Tubes (1 x 25g Base + 1 x 25g Catalyst)',
    manufacturer: 'Prime Dental Products Pvt Ltd',
    expiryInfo: '36 Months from Mfg',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/prime-tempute-cement.jpg',
      '/images/products/prime-tempute-cement-p4-card.jpg'
    ],
    description: 'Non-eugenol zinc oxide temporary luting cement designed for provisional crowns, bridges, inlays, onlays, and splints. Will not inhibit the polymerization of resin-based permanent luting cements or bonding adhesives.',
    specifications: {
      'Type': 'Eugenol-Free Zinc Oxide Temporary Cement',
      'Mixing Ratio': '1:1 Base to Catalyst Paste',
      'Setting Time': '4 - 5 minutes intraorally',
      'Film Thickness': '< 20 microns'
    }
  },
  {
    name: 'Topical Fluoride Thixotropic Gel (Strawberry Flavour 500ml)',
    slug: 'topical-fluoride-thixotropic-gel-strawberry',
    brand: 'Integrity Dental Care',
    sku: 'IE-TF-GEL-500ML',
    hsnCode: '33069000',
    categorySlug: 'fluoride-gels',
    price: 650,
    mrp: 850,
    discount: 23,
    gstPercent: 12,
    stock: 45,
    lowStockThreshold: 8,
    packSize: '500ml Bottle (Strawberry Flavour)',
    manufacturer: 'Integrity Enterprises Silvassa',
    expiryInfo: '36 Months from Mfg',
    isFeatured: true,
    isBestseller: false,
    images: [
      '/images/products/topical-fluoride-gel.jpg'
    ],
    description: '1.23% Acidulated Phosphate Fluoride (APF) thixotropic gel with pleasant strawberry flavor. Thixotropic consistency stays in tray without running or causing patient gag reflex, delivering 12,300 ppm fluoride ion in 60 seconds.',
    specifications: {
      'Active Ingredient': '1.23% APF (Sodium Fluoride + HF)',
      'Application Time': '1 to 4 minutes in dual arch tray',
      'Volume': '500 ml Bottle'
    }
  },
  {
    name: 'Blue Shade Lute Glass Ionomer Luting Cement (Type I)',
    slug: 'blue-shade-lute-glass-ionomer-cement',
    brand: 'Integrity Dental Materials',
    slug2: 'blue-shade-lute-gic',
    sku: 'IE-BS-LUTE-GIC',
    hsnCode: '30064000',
    categorySlug: 'cement',
    price: 680,
    mrp: 900,
    discount: 24,
    gstPercent: 12,
    stock: 50,
    lowStockThreshold: 10,
    packSize: '1-1 Package: 15g Powder + 10ml Liquid + Mixing Pad',
    manufacturer: 'Integrity Enterprises Silvassa',
    expiryInfo: '36 Months from Mfg',
    isFeatured: true,
    isBestseller: false,
    images: [
      '/images/products/blue-shade-lute-gic.jpg'
    ],
    description: 'High-strength biocompatible Type I Glass Ionomer Luting Cement with high fluoride release, ultra-low film thickness (15 µm), and chemical adhesion to enamel and dentin for permanent crown, bridge, and band cementation.',
    specifications: {
      'Type': 'Glass Ionomer Type I (Luting)',
      'Compressive Strength': '> 130 MPa',
      'Film Thickness': '15 microns',
      'Net Contents': '15g Powder, 10ml Liquid'
    }
  },

  // ==========================================
  // PAGE 2 PRODUCTS
  // ==========================================
  {
    name: 'True Endo Disposable Suction Tips (100 Pcs Pack)',
    slug: 'true-endo-disposable-suction-tips-100',
    brand: 'True Endo Medical',
    sku: 'IE-TE-SUCTION-100',
    hsnCode: '90184900',
    categorySlug: 'suction-tips',
    price: 160,
    mrp: 250,
    discount: 36,
    gstPercent: 5,
    stock: 200,
    lowStockThreshold: 20,
    packSize: 'Pack of 100 Pcs with Non-Removable Soft Tips',
    manufacturer: 'True Endo / Integrity Enterprises',
    expiryInfo: '5 Years Shelf Life',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-suction-tips.jpg',
      '/images/products/true-endo-suction-tips-card.jpg'
    ],
    description: 'Medical-grade pliable disposable saliva ejector suction tubes with non-detachable smooth rounded tips to prevent tissue aspiration and patient discomfort. Easily bends into any required shape without kinking.',
    specifications: {
      'Material': 'Non-toxic medical grade PVC with copper-coated wire',
      'Quantity': '100 pieces per bag',
      'Tip': 'Soft rounded non-removable tip'
    }
  },
  {
    name: 'Ultrasonic Scaler Tips (Stainless Steel Universal G1 / G2 / P1)',
    slug: 'ultrasonic-scaler-tips-universal',
    brand: 'True Endo Instruments',
    sku: 'IE-TE-SCALER-TIP-1',
    hsnCode: '90184900',
    categorySlug: 'scalers-tips',
    price: 250,
    mrp: 350,
    discount: 28,
    gstPercent: 18,
    stock: 120,
    lowStockThreshold: 15,
    packSize: '1 Tip (EMS / Woodpecker Compatible)',
    manufacturer: 'True Endo Instruments',
    expiryInfo: 'Autoclavable Stainless Steel',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/scaler-tips-universal.jpg',
      '/images/products/scaler-tips-universal-card.jpg'
    ],
    description: 'Precision engineered medical surgical-grade stainless steel ultrasonic scaler tips for supragingival calculus removal, subgingival scaling, and interdental plaque elimination. Compatible with EMS and Woodpecker handpieces.',
    specifications: {
      'Compatibility': 'EMS / Woodpecker / DentaKart Scalers',
      'Material': 'Special Hardened Surgical Stainless Steel',
      'Autoclave': 'Fully Autoclavable at 134°C'
    }
  },
  {
    name: 'True Endo Stone Trimming Bur for Acrylic & Models',
    slug: 'true-endo-stone-trimming-bur',
    brand: 'True Endo Instruments',
    sku: 'IE-TE-BUR-STONE',
    hsnCode: '90184900',
    categorySlug: 'burs-trimmers',
    price: 40,
    mrp: 75,
    discount: 46,
    gstPercent: 18,
    stock: 150,
    lowStockThreshold: 25,
    packSize: '1 Piece (HP Shank for Laboratory & Clinic Handpiece)',
    manufacturer: 'True Endo Instruments',
    expiryInfo: 'Durable Abrasive Stone',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-stone-bur.jpg',
      '/images/products/true-endo-stone-bur-card.jpg'
    ],
    description: 'Mounted abrasive stone bur for fast trimming and smoothing of dental study models, plaster casts, acrylic dentures, and provisional crowns without overheating or clogging.',
    specifications: {
      'Shank Type': 'HP (Handpiece 2.35mm shank)',
      'Grit': 'Medium Abrasive Alumina Stone'
    }
  },
  {
    name: 'True Endo Tungsten Carbide Metal Trimming Bur',
    slug: 'true-endo-metal-trimming-bur',
    brand: 'True Endo Instruments',
    sku: 'IE-TE-BUR-METAL',
    hsnCode: '90184900',
    categorySlug: 'burs-trimmers',
    price: 200,
    mrp: 300,
    discount: 33,
    gstPercent: 18,
    stock: 90,
    lowStockThreshold: 15,
    packSize: '1 Piece (FG / HP Shank Tungsten Carbide)',
    manufacturer: 'True Endo Instruments',
    expiryInfo: 'Precision Carbide Blade',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-stone-bur.jpg',
      '/images/products/true-endo-stone-bur-card.jpg'
    ],
    description: 'Cross-cut fluted tungsten carbide metal trimming bur designed for effortless cutting and contouring of metal copings, porcelain-fused-to-metal crowns, gold alloys, and composite restorations.',
    specifications: {
      'Material': 'High-Density Tungsten Carbide Blade',
      'Cut': 'Cross-cut Multi-fluted',
      'Max Speed': '30,000 RPM'
    }
  },
  {
    name: 'True Endo NiTi Rotary Endodontic Files (Assorted 6 Pcs Pack)',
    slug: 'true-endo-niti-rotary-files-pack',
    brand: 'True Endo Medical',
    sku: 'IE-TE-FILES-ASSORTED',
    hsnCode: '90184900',
    categorySlug: 'files',
    price: 950,
    mrp: 1450,
    discount: 34,
    gstPercent: 12,
    stock: 80,
    lowStockThreshold: 15,
    packSize: 'Pack of 6 Assorted NiTi Files (SX, S1, S2, F1, F2, F3 - 25mm)',
    manufacturer: 'True Endo Medical Innovations',
    expiryInfo: 'Sterile Blister Pack (Autoclavable)',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-niti-files.jpg',
      '/images/products/true-endo-niti-files-card.jpg'
    ],
    description: 'Gold-treated heat-activated Nickel-Titanium (NiTi) rotary files featuring extreme cyclic fatigue resistance, controlled memory flexibility to navigate curved canals without ledging or zipping, and superior cutting efficiency.',
    specifications: {
      'Material': 'Gold Heat-Treated NiTi Alloy',
      'Lengths Available': '21mm and 25mm',
      'Assortment': 'SX (Orifice Opener), S1, S2 (Shaping), F1, F2, F3 (Finishing)',
      'Recommended Speed': '250 - 350 RPM',
      'Recommended Torque': '1.5 - 3.0 N.cm'
    }
  },
  {
    name: 'High Speed Standard Push Button Airotor Handpiece',
    slug: 'high-speed-standard-push-button-handpiece',
    brand: 'Integrity Instruments',
    sku: 'IE-HP-STANDARD-AIROTOR',
    hsnCode: '90184900',
    categorySlug: 'handpieces',
    price: 1600,
    mrp: 2400,
    discount: 33,
    gstPercent: 18,
    stock: 40,
    lowStockThreshold: 8,
    packSize: '1 Handpiece + Bur Changer + Maintenance Guide',
    manufacturer: 'Integrity Enterprises Silvassa',
    expiryInfo: '1 Year Warranty on Cartridge',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/high-speed-airotor-handpiece.jpg',
      '/images/products/high-speed-airotor-handpiece-card.jpg'
    ],
    description: 'Single water spray high-speed dental turbine airotor handpiece featuring smooth push-button bur chucking mechanism, ceramic bearings for low vibration (under 65dB), and standard 2-hole Bordon connection.',
    specifications: {
      'Operating Air Pressure': '0.22 - 0.25 MPa',
      'Speed': '350,000 - 400,000 RPM',
      'Chucking': 'Push Button Chuck',
      'Bearing Type': 'High Precision Ceramic Ball Bearings'
    }
  },
  {
    name: 'True Endo E-Generator LED High Speed Handpiece (Self-Illuminating)',
    slug: 'true-endo-e-generator-led-handpiece',
    brand: 'True Endo Medical',
    sku: 'IE-TE-HP-LED-4600',
    hsnCode: '90184900',
    categorySlug: 'handpieces',
    price: 4600,
    mrp: 6500,
    discount: 29,
    gstPercent: 18,
    stock: 25,
    lowStockThreshold: 5,
    packSize: '1 Complete LED Handpiece (Integrated Micro-Generator)',
    manufacturer: 'True Endo Innovations',
    expiryInfo: '12 Months Manufacturer Warranty',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-led-handpiece.jpg',
      '/images/products/true-endo-led-handpiece-card.jpg'
    ],
    description: 'Autonomous E-generator LED high speed push button handpiece that generates its own bright daylight illumination without requiring fiber optic tubing or electricity. Features triple water spray cooling and anti-retraction clean head system.',
    specifications: {
      'Light Source': 'Self-Powered Micro E-Generator DayLight LED (25,000 Lux)',
      'Water Spray': 'Triple Water Spray + Triple Air Flow',
      'Noise Level': '≤ 60 dB',
      'Head Type': 'Super Torque Push Button'
    }
  },
  {
    name: 'True Endo EDTA 17% Root Canal Lubricating Gel Syringe (3g)',
    slug: 'true-endo-edta-17-canal-gel',
    brand: 'True Endo Medical',
    sku: 'IE-TE-EDTA-GEL',
    hsnCode: '30064000',
    categorySlug: 'medicaments-pastes',
    price: 200,
    mrp: 300,
    discount: 33,
    gstPercent: 12,
    stock: 110,
    lowStockThreshold: 20,
    packSize: '1 x 3g Syringe + 3 Applicator Tips',
    manufacturer: 'True Endo Chemical Lab',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-edta-gel.jpg',
      '/images/products/true-endo-edta-gel-card.jpg'
    ],
    description: '17% Ethylenediaminetetraacetic acid (EDTA) gel with 10% Carbamide Peroxide for chemical debridement, chelation of calcified root canals, smear layer removal, and smooth lubrication during rotary file instrumentation.',
    specifications: {
      'Composition': '17% Disodium EDTA + 10% Carbamide Peroxide',
      'Syringe Size': '3 grams with dispensing tips',
      'Action': 'Effervescent release of oxygen cleans canal debris'
    }
  },
  {
    name: 'True Endo Flowable Light Cure Restorative Composite (2g Syringe)',
    slug: 'true-endo-flow-composite-syringe',
    brand: 'True Endo Dental',
    sku: 'IE-TE-FLOW-COMP',
    hsnCode: '30064000',
    categorySlug: 'composite',
    price: 400,
    mrp: 600,
    discount: 33,
    gstPercent: 12,
    stock: 95,
    lowStockThreshold: 15,
    packSize: '1 x 2g Syringe + 5 Delivery Tips (Shade A2 / A3)',
    manufacturer: 'True Endo Polymer Lab',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-flow-composite.jpg',
      '/images/products/true-endo-flow-composite-card.jpg'
    ],
    description: 'Low-viscosity microhybrid flowable composite resin with excellent adaptation to cavity floors, high radiopacity, minimum polymerization shrinkage, and superior wear resistance for Class III, Class V, and pit & fissure sealants.',
    specifications: {
      'Filler Content': '65% by weight nano-hybrid particles',
      'Curing Time': '20 seconds LED',
      'Shade': 'Universal Enamel A2 / A3'
    }
  },
  {
    name: 'True Endo Cem LC Light Cure Glass Ionomer Cement',
    slug: 'true-endo-cem-lc-gi-cement',
    brand: 'True Endo Dental',
    sku: 'IE-TE-CEM-LC',
    hsnCode: '30064000',
    categorySlug: 'cement',
    price: 400,
    mrp: 650,
    discount: 38,
    gstPercent: 12,
    stock: 75,
    lowStockThreshold: 12,
    packSize: '1-1 Kit (10g Powder + 7ml Liquid + Scoop & Pad)',
    manufacturer: 'True Endo Dental Materials',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-cem-lc-gic.jpg',
      '/images/products/true-endo-cem-lc-gic-card.jpg'
    ],
    description: 'Resin-modified light-cure glass ionomer restorative cement providing rapid set on command (20s), continuous fluoride protection, chemical bonding to tooth structure, and high moisture resistance.',
    specifications: {
      'Type': 'Resin-Modified Light Cure GIC',
      'Cure Depth': '2.0 mm in 20 seconds',
      'Indications': 'Class III/V restorations, cervical erosion, pediatric fillings'
    }
  },
  {
    name: 'True Endo Aura Spray Handpiece Lubricant Cleaner (500ml)',
    slug: 'true-endo-aura-spray-lubricant-500ml',
    brand: 'True Endo Medical',
    sku: 'IE-TE-AURA-SPRAY',
    hsnCode: '27101990',
    categorySlug: 'equipment-sprays',
    price: 550,
    mrp: 750,
    discount: 26,
    gstPercent: 18,
    stock: 85,
    lowStockThreshold: 10,
    packSize: '500ml Aerosol Can with Multiple Brass Nozzles',
    manufacturer: 'True Endo / Integrity Enterprises',
    expiryInfo: '5 Years Shelf Life',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-aura-spray.jpg',
      '/images/products/true-endo-aura-spray-card.jpg'
    ],
    description: 'High-grade synthetic mineral lubricant spray formulated specifically for maintenance, flushing debris, and lubrication of high-speed airotors, low-speed contra-angles, and micromotors prior to autoclaving.',
    specifications: {
      'Volume': '500 ml pressurized aerosol canister',
      'Nozzles Included': 'Airotor nozzle, E-type contra-angle nozzle',
      'Heat Resistance': 'Withstands autoclave cycle at 134°C'
    }
  },
  {
    name: 'True Endo Waterproof Coated Dental Mixing Pad (50 Sheets)',
    slug: 'true-endo-dental-mixing-pad-50',
    brand: 'True Endo Consumables',
    sku: 'IE-TE-MIXING-PAD',
    hsnCode: '48201090',
    categorySlug: 'mixing-pads',
    price: 70,
    mrp: 120,
    discount: 41,
    gstPercent: 12,
    stock: 250,
    lowStockThreshold: 30,
    packSize: 'Pad of 50 Poly-Coated Non-Stick Tear-Off Sheets',
    manufacturer: 'True Endo Consumables',
    expiryInfo: 'Non-Perishable',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-mixing-pad.jpg',
      '/images/products/true-endo-mixing-pad-card.jpg'
    ],
    description: 'Special polyethylene coated heavy paper sheets designed for spatulating cements, composites, impression materials, and liners without soaking or tearing. Features non-skid rubber backing.',
    specifications: {
      'Sheet Dimensions': '7.5 cm x 7.5 cm',
      'Leaf Count': '50 sheets per pad',
      'Surface': 'Wax-free gloss plastic coating'
    }
  },
  {
    name: 'True Endo Temp Fill Cavity Temporary Filling Material (30g Jar)',
    slug: 'true-endo-temp-fill-material-30g',
    brand: 'True Endo Dental',
    sku: 'IE-TE-TEMP-FILL',
    hsnCode: '30064000',
    categorySlug: 'temporary-filling',
    price: 250,
    mrp: 380,
    discount: 34,
    gstPercent: 12,
    stock: 120,
    lowStockThreshold: 20,
    packSize: '30g Hermetically Sealed Jar (White / Pink Paste)',
    manufacturer: 'True Endo Dental Materials',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-temp-fill.jpg',
      '/images/products/true-endo-temp-fill-card.jpg'
    ],
    description: 'Ready-to-use moisture-activated temporary filling paste for intermediate cavity sealing, endodontic access closures, and inlay preparations. Expands slightly during setting to create an airtight hermetic seal.',
    specifications: {
      'Setting Mechanism': 'Self-curing on contact with saliva (20-30 mins)',
      'Net Weight': '30 grams jar',
      'Removal': 'Easily excavated with probe/spoon excavator without rotary bur'
    }
  },
  {
    name: 'True Endo Universal Hybrid Composite Syringe 4g (Shade A2/A3)',
    slug: 'true-endo-universal-composite-4g',
    brand: 'True Endo Dental',
    sku: 'IE-TE-COMP-4G',
    hsnCode: '30064000',
    categorySlug: 'composite',
    price: 400,
    mrp: 600,
    discount: 33,
    gstPercent: 12,
    stock: 140,
    lowStockThreshold: 20,
    packSize: '1 x 4g Syringe (Shade A2 / A3)',
    manufacturer: 'True Endo Polymer Lab',
    expiryInfo: '36 Months from Mfg',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-composite-p2.jpg',
      '/images/products/true-endo-composite-p2-card.jpg'
    ],
    description: 'Sub-micron hybrid restorative composite resin combining superior strength (380 MPa compressive strength) with excellent polishability and chameleon color-matching effect for anterior veneers and posterior load-bearing fillings.',
    specifications: {
      'Filler Load': '78% inorganic barium glass filler',
      'Shrinkage': '< 1.8% volumetric shrinkage',
      'Shades': 'Vita Shade A1, A2, A3, B2'
    }
  },
  {
    name: 'True Endo Micro Applicator Brush Tips (100 Pcs Cylinder)',
    slug: 'true-endo-micro-applicator-tips-100',
    brand: 'True Endo Consumables',
    sku: 'IE-TE-APP-TIPS',
    hsnCode: '90184900',
    categorySlug: 'applicator-tips',
    price: 150,
    mrp: 250,
    discount: 40,
    gstPercent: 5,
    stock: 180,
    lowStockThreshold: 25,
    packSize: '100 Pcs Dispenser Cylinder (Regular / Fine)',
    manufacturer: 'True Endo Consumables',
    expiryInfo: '5 Years Shelf Life',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-applicator-tips.jpg',
      '/images/products/true-endo-applicator-tips-card.jpg'
    ],
    description: 'Non-linting bendable micro applicator brush tips for precise application of bonding agents, etchants, sealants, desensitizers, and cavity varnishes without dripping or soaking excess material.',
    specifications: {
      'Head Size': 'Regular (2.0mm) & Fine (1.5mm) non-absorbent spherical fibers',
      'Packaging': 'Convenient pop-up dispenser cylinder of 100 pcs'
    }
  },
  {
    name: 'True Endo Stainless Steel Perforated Impression Trays (Set of 6)',
    slug: 'true-endo-metal-impression-trays-set',
    brand: 'True Endo Instruments',
    sku: 'IE-TE-METAL-TRAY-SET',
    hsnCode: '90184900',
    categorySlug: 'trays',
    price: 400,
    mrp: 650,
    discount: 38,
    gstPercent: 18,
    stock: 65,
    lowStockThreshold: 10,
    packSize: 'Set of 6 Trays (Upper & Lower: S, M, L)',
    manufacturer: 'True Endo Instruments',
    expiryInfo: 'Fully Autoclavable Stainless Steel',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-metal-trays.jpg',
      '/images/products/true-endo-metal-trays-card.jpg'
    ],
    description: 'Medical-grade rigid stainless steel perforated dental impression trays designed for taking accurate anatomical impressions with alginate or elastomeric putty. Perforations ensure mechanical interlocking of material.',
    specifications: {
      'Material': 'Surgical Grade 304 Stainless Steel',
      'Sizes Included': 'Upper (S, M, L) + Lower (S, M, L)',
      'Cleaning': '100% Autoclavable up to 134°C'
    }
  },

  // ==========================================
  // PAGE 3 PRODUCTS
  // ==========================================
  {
    name: 'Medsilk Black Braided Silk Surgical Suture (Box of 12)',
    slug: 'medsilk-black-braided-silk-suture',
    brand: 'Medsilk Surgical',
    sku: 'IE-MEDSILK-30-BOX',
    hsnCode: '30061010',
    categorySlug: 'surgical-sutures',
    price: 550,
    mrp: 800,
    discount: 31,
    gstPercent: 12,
    stock: 85,
    lowStockThreshold: 15,
    packSize: 'Box of 12 Sterile Foil Packs (3-0 Reverse Cutting 3/8 Circle 19mm)',
    manufacturer: 'Medsilk Healthcare',
    expiryInfo: '5 Years Sterile Shelf Life',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/medsilk-suture.jpg',
      '/images/products/medsilk-suture-card.jpg'
    ],
    description: 'Non-absorbable natural silk suture coated with medical-grade silicone for smooth tissue passage, exceptional knot security, and reduced capillary drag during dental extraction and periodontal flap closure.',
    specifications: {
      'Material': '100% Natural Braided Silk Protein (Fibroin)',
      'Needle': '19mm 3/8 Circle Reverse Cutting Stainless Steel Needle',
      'Length': '75 cm thread'
    }
  },
  {
    name: 'Medcryl Polyglactin 910 Synthetic Absorbable Suture (Box of 12)',
    slug: 'medcryl-polyglactin-absorbable-suture',
    brand: 'Medcryl Surgical',
    sku: 'IE-MEDCRYL-910-BOX',
    hsnCode: '30061010',
    categorySlug: 'surgical-sutures',
    price: 1100,
    mrp: 1500,
    discount: 26,
    gstPercent: 12,
    stock: 50,
    lowStockThreshold: 10,
    packSize: 'Box of 12 Sterile Foil Packs (3-0 / 4-0 Reverse Cutting)',
    manufacturer: 'Medcryl Surgical Sutures',
    expiryInfo: '5 Years Sterile Shelf Life',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/medcryl-suture-1100.jpg',
      '/images/products/medcryl-suture-1100-card.jpg'
    ],
    description: 'Braided synthetic absorbable suture (90% glycolide + 10% L-lactide) coated with polyglactin 370 and calcium stearate. Retains 75% tensile strength at 14 days and absorbs completely by hydrolysis within 56-70 days without tissue irritation.',
    specifications: {
      'Composition': 'Polyglactin 910 (Vicryl Equivalent)',
      'Absorption Time': '56 to 70 days complete absorption',
      'Needle': '3/8 Circle 16mm / 19mm Precision Cutting Needle'
    }
  },
  {
    name: 'Medcryl Monofilament Rapid Absorbable Surgical Suture',
    slug: 'medcryl-monofilament-rapid-suture',
    brand: 'Medcryl Surgical',
    sku: 'IE-MEDCRYL-MONO',
    hsnCode: '30061010',
    categorySlug: 'surgical-sutures',
    price: 1200,
    mrp: 1650,
    discount: 27,
    gstPercent: 12,
    stock: 40,
    lowStockThreshold: 8,
    packSize: 'Box of 12 Foil Packs (4-0 Undyed Monofilament)',
    manufacturer: 'Medcryl Surgical Sutures',
    expiryInfo: '5 Years Sterile Shelf Life',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/medcryl-suture-1200.jpg',
      '/images/products/medcryl-suture-1200-card.jpg'
    ],
    description: 'Irradiated fast-absorbing monofilament suture ideal for oral mucosal closure, pediatric dental surgery, and frenectomy where suture removal is traumatic or unnecessary. Retains 50% tensile strength at 5 days.',
    specifications: {
      'Absorption': 'Rapid (Complete within 42 days)',
      'Structure': 'Smooth Monofilament (Zero bacterial wicking)'
    }
  },
  {
    name: 'Healix In-Office Tooth Whitening Bleaching Kit (Patient Kit)',
    slug: 'healix-in-office-bleaching-kit',
    brand: 'Healix Dental Care',
    sku: 'IE-HX-BLEACH-KIT',
    hsnCode: '33069000',
    categorySlug: 'bleaching-whitening',
    price: 1250,
    mrp: 1800,
    discount: 30,
    gstPercent: 18,
    stock: 45,
    lowStockThreshold: 10,
    packSize: 'Complete Kit: 35% H2O2 Dual Syringe + Gingival Dam + Desensitizer',
    manufacturer: 'Healix Bio-Innovations',
    expiryInfo: '24 Months (Cold-Chain Protected)',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/healix-bleaching-kit.jpg',
      '/images/products/healix-bleaching-kit-card.jpg'
    ],
    description: 'Professional chairside in-office tooth whitening kit containing 35% Hydrogen Peroxide auto-mix gel, light-curing blue gingival barrier resin, and potassium nitrate desensitizing gel. Delivers up to 6-8 shades lighter in a 30-minute session.',
    specifications: {
      'Peroxide Concentration': '35% Stabilized Hydrogen Peroxide',
      'Activation': 'Light activated or chemical auto-activated',
      'Kit Contents': '2 x 2.5ml Bleaching Gel, 1.2ml Gingival Dam, 1.2ml Relief Gel'
    }
  },
  {
    name: 'Healix 37% Phosphoric Acid Dental Etchant Gel Syringe (5ml)',
    slug: 'healix-37-phosphoric-acid-etchant-gel',
    brand: 'Healix Dental Care',
    sku: 'IE-HX-ETCH-5ML',
    hsnCode: '30064000',
    categorySlug: 'etching-materials',
    price: 200,
    mrp: 320,
    discount: 37,
    gstPercent: 12,
    stock: 130,
    lowStockThreshold: 20,
    packSize: '1 x 5ml Syringe + 5 Angled Dispensing Tips',
    manufacturer: 'Healix Bio-Innovations',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/healix-etchant-gel.jpg',
      '/images/products/healix-etchant-gel-card.jpg'
    ],
    description: 'Thixotropic 37% phosphoric acid etching gel for enamel conditioning and dentin demineralization prior to adhesive bonding. Vibrant blue color provides high contrast on tooth surface and washes away cleanly without residue.',
    specifications: {
      'Acid Concentration': '37% Phosphoric Acid (H3PO4)',
      'Viscosity': 'Thixotropic (Stays precisely where applied)',
      'Etch Time': 'Enamel: 15-20s, Dentin: 10-15s'
    }
  },
  {
    name: 'Aero Blast Sodium Bicarbonate Air Polishing Powder (300g)',
    slug: 'aero-blast-prophy-powder-300g',
    brand: 'Aero Blast Dental',
    sku: 'IE-AB-POWDER-300',
    hsnCode: '33069000',
    categorySlug: 'prophy-powders',
    price: 700,
    mrp: 950,
    discount: 26,
    gstPercent: 18,
    stock: 60,
    lowStockThreshold: 10,
    packSize: '300g Bottle (Mint / Lemon Flavour)',
    manufacturer: 'Aero Blast Prophylaxis Labs',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/aero-blast-powder.jpg',
      '/images/products/aero-blast-powder-card.jpg'
    ],
    description: 'High-purity sodium bicarbonate supragingival air polishing powder engineered for air-flow units. Rapidly removes stubborn tobacco, tea, coffee stains, and bio-film without abrading enamel surface.',
    specifications: {
      'Particle Size': '40 - 65 microns spherical particles',
      'Flavors': 'Fresh Spearmint / Citrus Lemon',
      'Net Weight': '300 grams bottle'
    }
  },
  {
    name: 'Aero Blast Glycine Gentle Subgingival Prophy Powder (1kg Bulk)',
    slug: 'aero-blast-glycine-powder-1kg',
    brand: 'Aero Blast Dental',
    sku: 'IE-AB-POWDER-1KG',
    hsnCode: '33069000',
    categorySlug: 'prophy-powders',
    price: 1300,
    mrp: 1800,
    discount: 27,
    gstPercent: 18,
    stock: 35,
    lowStockThreshold: 5,
    packSize: '1000g (1 Kg) Clinic Economy Canister',
    manufacturer: 'Aero Blast Prophylaxis Labs',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/aero-blast-powder.jpg',
      '/images/products/aero-blast-powder-card.jpg'
    ],
    description: 'Ultra-fine glycine-based air polishing powder safe for subgingival periodontal pocket decontamination, implant titanium surface cleaning, and orthodontic bracket maintenance without scratching enamel or cementum.',
    specifications: {
      'Base': 'Pure Pharmaceutical Grade Glycine (25 µm)',
      'Indication': 'Subgingival & Implant Maintenance',
      'Net Weight': '1000 grams economy jar'
    }
  },
  {
    name: 'Healix X3 Cordless High-Power Broadband LED Light Cure Unit',
    slug: 'healix-x3-cordless-led-light-cure',
    brand: 'Healix Dental Care',
    sku: 'IE-HX-LC-X3',
    hsnCode: '90184900',
    categorySlug: 'light-cure-units',
    price: 2800,
    mrp: 3900,
    discount: 28,
    gstPercent: 18,
    stock: 30,
    lowStockThreshold: 5,
    packSize: '1 Complete Unit (Handpiece + Light Guide + Charging Base + Shield)',
    manufacturer: 'Healix Bio-Innovations',
    expiryInfo: '12 Months Manufacturer Warranty',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/healix-x3-light-cure.jpg',
      '/images/products/healix-x3-light-cure-card.jpg'
    ],
    description: 'Ergonomic lightweight cordless LED curing light producing up to 2300 mW/cm² optical output. Features dual-wavelength broadband LED (385 - 515 nm) to cure all dental composites (Camphorquinone and Lucirin TPO/Ivocerin initiators) in 1 second.',
    specifications: {
      'Light Intensity': '1000 - 2300 mW/cm²',
      'Wavelength Range': '385 - 515 nm Broadband',
      'Working Modes': 'Full Power, Ramping, Pulse (1s, 3s, 5s, 10s cycles)',
      'Battery': 'High Capacity Li-ion (over 400 cures per charge)'
    }
  },
  {
    name: 'Smart Saddle Matrices Kit with Universal Spring Clip (18 Pcs)',
    slug: 'smart-saddle-matrices-kit',
    brand: 'SmartDent Dental',
    sku: 'IE-SMT-SADDLE-KIT',
    hsnCode: '90184900',
    categorySlug: 'matrices-wedges',
    price: 950,
    mrp: 1400,
    discount: 32,
    gstPercent: 18,
    stock: 65,
    lowStockThreshold: 10,
    packSize: 'Complete Kit: 18 Anatomical Saddle Matrix Bands + 1 Spring Clip Clamp',
    manufacturer: 'SmartDent Dental Products',
    expiryInfo: 'Autoclavable Stainless Steel',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/smart-saddle-matrices-kit.jpg',
      '/images/products/smart-saddle-matrices-kit-card.jpg'
    ],
    description: 'Innovative saddle matrix system providing tight anatomical contact points and natural cervical contouring for Class II MOD and MO/DO composite restorations. Spring clip provides stable 360° interproximal retention.',
    specifications: {
      'Matrix Thickness': '0.035 mm ultra-thin hardened steel',
      'Sizes Included': 'Small, Medium, Large, Extra-Large Saddle Bands',
      'Autoclave': 'Fully Autoclavable up to 134°C'
    }
  },
  {
    name: 'Dual Side-Vented Endodontic Canal Irrigation Needles 30G (Box of 100)',
    slug: 'dual-side-vented-irrigation-needles-30g',
    brand: 'True Endo Medical',
    sku: 'IE-TE-SIDEVENT-30G',
    hsnCode: '90183200',
    categorySlug: 'irrigation-needles',
    price: 450,
    mrp: 650,
    discount: 30,
    gstPercent: 12,
    stock: 90,
    lowStockThreshold: 15,
    packSize: 'Box of 100 Sterile Packed 30G Needles (Luer Lock)',
    manufacturer: 'True Endo Medical Innovations',
    expiryInfo: '5 Years Sterile Shelf Life',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/dual-sidevent-needles.jpg',
      '/images/products/dual-sidevent-needles-card.jpg'
    ],
    description: 'Closed-end dual lateral side-port irrigation needles that direct NaOCl and EDTA irrigant laterally onto canal walls while preventing dangerous apical extrusion of solution through the apical foramen.',
    specifications: {
      'Gauge': '30 Gauge (0.3mm diameter)',
      'Tip Design': 'Closed rounded end with 2 opposing lateral ports',
      'Connection': 'Universal Luer Lock fitting'
    }
  },
  {
    name: 'Smart Nanofill Hybrid Composite Restorative Kit (7 Syringes + Bond)',
    slug: 'smart-nanofill-hybrid-composite-kit',
    brand: 'SmartDent Dental',
    sku: 'IE-SMT-NANO-KIT',
    hsnCode: '30064000',
    categorySlug: 'composite',
    price: 1590,
    mrp: 2650,
    discount: 40,
    gstPercent: 12,
    stock: 55,
    lowStockThreshold: 10,
    packSize: 'Master Kit (7 x 4g Syringes A1, A2, A3, B2, C2, OA2, OA3 + 5ml Bond + Etch)',
    manufacturer: 'SmartDent Biopolymer Lab',
    expiryInfo: '36 Months from Mfg',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/smart-nanofill-composite-kit.jpg',
      '/images/products/smart-nanofill-composite-kit-card.jpg'
    ],
    description: 'Complete aesthetic composite restorative kit containing 7 universal and opaque shades, 5th gen bonding adhesive, 37% etchant gel, and dispensing tips. Ultra-fine sub-micron hybrid filler delivers glass-smooth polish retention.',
    specifications: {
      'Shades Included': 'A1, A2, A3, B2, C2, Opaque A2, Opaque A3',
      'Compressive Strength': '390 MPa',
      'Flexural Strength': '145 MPa'
    }
  },
  {
    name: 'True Endo Cem Resin-Reinforced Luting Glass Ionomer Cement Kit',
    slug: 'true-endo-cem-resin-reinforced-luting-kit',
    brand: 'True Endo Dental',
    sku: 'IE-TE-CEM-RESIN-KIT',
    hsnCode: '30064000',
    categorySlug: 'cement',
    price: 1590,
    mrp: 2400,
    discount: 33,
    gstPercent: 12,
    stock: 45,
    lowStockThreshold: 8,
    packSize: '1-1 Kit (15g Powder + 8ml Liquid + Mixing Pad + Dropper)',
    manufacturer: 'True Endo Dental Materials',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-cem-resin-kit.jpg',
      '/images/products/true-endo-cem-resin-kit-card.jpg'
    ],
    description: 'Resin-reinforced glass ionomer luting cement engineered for final cementation of metal-ceramic crowns, zirconia copings, orthodontic bands, and fiber posts. Features near-zero post-operative sensitivity and excellent marginal seal.',
    specifications: {
      'Bond Strength to Dentin': '> 12 MPa',
      'Film Thickness': '12 microns',
      'Working Time': '2.5 minutes, Setting Time: 4.5 minutes'
    }
  },
  {
    name: 'Sectional Contoured Matrix System Starter Kit (Bands + Ring + Wedges)',
    slug: 'sectional-contoured-matrix-system-kit',
    brand: 'SmartDent Dental',
    sku: 'IE-SMT-SEC-MATRIX',
    hsnCode: '90184900',
    categorySlug: 'matrices-wedges',
    price: 550,
    mrp: 850,
    discount: 35,
    gstPercent: 18,
    stock: 75,
    lowStockThreshold: 12,
    packSize: 'Starter Kit: 30 Mylar/Steel Contoured Bands + 1 Separator Ring + 20 Wedges',
    manufacturer: 'SmartDent Dental Products',
    expiryInfo: 'Autoclavable Steel Ring',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/sectional-matrix-kit.jpg',
      '/images/products/sectional-matrix-kit-card.jpg'
    ],
    description: 'Anatomically pre-curved sectional matrix system for restoring proximal contours and natural tight contact points on bicuspids and molars without food lodgement issues.',
    specifications: {
      'Sizes': 'Small (Premolar), Medium (Molar), Large (Deep Subgingival)',
      'Ring Material': 'Spring Nickel-Titanium alloy with high separation force'
    }
  },
  {
    name: 'Smart Temp Ready-to-Use Cavity Temporary Filling (30g Jar)',
    slug: 'smart-temp-cavity-temporary-filling-30g',
    brand: 'SmartDent Dental',
    sku: 'IE-SMT-TEMP-JAR',
    hsnCode: '30064000',
    categorySlug: 'temporary-filling',
    price: 120,
    mrp: 200,
    discount: 40,
    gstPercent: 12,
    stock: 160,
    lowStockThreshold: 20,
    packSize: '30g Hermetic Screw Cap Jar',
    manufacturer: 'SmartDent Dental Products',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/smart-temp-filling.jpg',
      '/images/products/smart-temp-filling-card.jpg'
    ],
    description: 'Eugenol-free, zinc oxide and calcium sulphate based temporary cavity sealant that sets rapidly in the presence of saliva to prevent bacterial leakage between root canal appointments.',
    specifications: {
      'Weight': '30 grams jar',
      'Cure': 'Chemical hydration with saliva in 20 minutes',
      'Seal': 'Zero dye penetration'
    }
  },
  {
    name: 'Standardized Gutta Percha & Absorbent Paper Points Combo Pack',
    slug: 'standardized-gutta-percha-paper-points-combo',
    brand: 'True Endo Medical',
    sku: 'IE-TE-GP-PP-COMBO',
    hsnCode: '30064000',
    categorySlug: 'gutta-percha-paper-points',
    price: 230,
    mrp: 350,
    discount: 34,
    gstPercent: 12,
    stock: 140,
    lowStockThreshold: 25,
    packSize: '1 Box GP Points (120 Pcs) + 1 Box Paper Points (200 Pcs)',
    manufacturer: 'True Endo Medical Innovations',
    expiryInfo: '5 Years Shelf Life',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/gp-paper-points-combo.jpg',
      '/images/products/gp-paper-points-combo-card.jpg'
    ],
    description: 'ISO color-coded standardized root canal gutta percha points (0.02 / 0.04 / 0.06 taper) and ultra-absorbent millimetre-marked paper points for rapid drying and 3D warm/cold obturation.',
    specifications: {
      'ISO Sizes': '#15 to #40 Assorted / Individual',
      'GP Radiopacity': '> 6.0 mm Aluminum',
      'Paper Point Absorbency': '100% pure lint-free cellulose'
    }
  },
  {
    name: 'Fender Wedges Interproximal Tooth Shield Matrix Wedges (Box of 36)',
    slug: 'fender-wedges-interproximal-shield-box',
    brand: 'SmartDent Dental',
    sku: 'IE-SMT-FENDER-36',
    hsnCode: '90184900',
    categorySlug: 'matrices-wedges',
    price: 550,
    mrp: 800,
    discount: 31,
    gstPercent: 18,
    stock: 70,
    lowStockThreshold: 10,
    packSize: 'Box of 36 Pcs (Small, Medium, Large Assorted Colors)',
    manufacturer: 'SmartDent Dental Products',
    expiryInfo: 'Autoclavable Plastic + Steel Shield',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/fender-wedges.jpg',
      '/images/products/fender-wedges-card.jpg'
    ],
    description: 'Combination plastic wedge with built-in stainless steel shield plate that protects adjacent teeth from bur damage during Class II cavity preparations and separates teeth for tight contact restorations.',
    specifications: {
      'Sizes': 'Small (Orange), Medium (Green), Large (Purple)',
      'Quantity': '36 wedges per box'
    }
  },
  {
    name: 'Endo Plug NiTi Hand Endodontic Condenser Pluggers Set (4 Pcs)',
    slug: 'endo-plug-niti-hand-condenser-pluggers',
    brand: 'True Endo Instruments',
    sku: 'IE-TE-PLUG-HAND',
    hsnCode: '90184900',
    categorySlug: 'endo-equipment',
    price: 750,
    mrp: 1100,
    discount: 31,
    gstPercent: 18,
    stock: 55,
    lowStockThreshold: 8,
    packSize: 'Set of 4 Double-Ended Pluggers (#35/70, #40/80, #50/100, #60/120)',
    manufacturer: 'True Endo Instruments',
    expiryInfo: 'Autoclavable NiTi + Stainless Steel',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/endo-plug-niti.jpg',
      '/images/products/endo-plug-niti-card.jpg'
    ],
    description: 'Double-ended endodontic pluggers with flexible Nickel-Titanium tip on one end for curved canals and rigid stainless steel on the other for vertical warm or cold gutta-percha condensation.',
    specifications: {
      'Tips': 'NiTi Flexible Tip + Stainless Steel Rigid Tip with 5mm depth markings',
      'Autoclave': '134°C Autoclavable'
    }
  },
  {
    name: 'Endo Plug NiTi Thermal Obturation Downpack Pluggers Set (Electric)',
    slug: 'endo-plug-niti-thermal-obturation-pluggers',
    brand: 'True Endo Medical',
    sku: 'IE-TE-PLUG-ELEC',
    hsnCode: '90184900',
    categorySlug: 'endo-equipment',
    price: 2800,
    mrp: 3900,
    discount: 28,
    gstPercent: 18,
    stock: 25,
    lowStockThreshold: 5,
    packSize: 'Set of 4 Electric Heating Tips (F, FM, M, ML)',
    manufacturer: 'True Endo Innovations',
    expiryInfo: '24 Months Warranty',
    isFeatured: true,
    isBestseller: false,
    images: [
      '/images/products/endo-plug-niti.jpg',
      '/images/products/endo-plug-niti-card.jpg'
    ],
    description: 'Fast-heating thermal obturation pluggers compatible with cordless gutta-percha heating systems. Reaches 200°C in 0.5 seconds for instant cut-off and apical 3D warm vertical compaction.',
    specifications: {
      'Heating Time': '0.5 seconds to 200°C',
      'Tip Sizes': 'Fine, Fine-Medium, Medium, Medium-Large'
    }
  },

  // ==========================================
  // PAGE 4 PRODUCTS
  // ==========================================
  {
    name: 'True Endo Diamond Polishing Paste for Composite & Enamel (50g)',
    slug: 'true-endo-diamond-polishing-paste-50g',
    brand: 'True Endo Dental',
    sku: 'IE-TE-POLISH-PASTE',
    hsnCode: '33069000',
    categorySlug: 'polishing-pastes',
    price: 250,
    mrp: 400,
    discount: 37,
    gstPercent: 18,
    stock: 90,
    lowStockThreshold: 15,
    packSize: '50g Screw Top Jar (Micro-fine Diamond Powder)',
    manufacturer: 'True Endo Dental Materials',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-polishing-paste.jpg',
      '/images/products/true-endo-polishing-paste-card.jpg'
    ],
    description: 'High-luster micro-fine diamond finishing and polishing paste formulated with water-soluble medium for imparting an enamel-like glaze on composite restorations, ceramic crowns, and natural teeth.',
    specifications: {
      'Grit Size': '0.5 to 1.0 micron diamond particles',
      'Water Solubility': '100% Water Washable without oily film'
    }
  },
  {
    name: 'True Endo H-Bond 7 (7th Gen Single-Step Self-Etch Dental Adhesive 5ml)',
    slug: 'true-endo-h-bond-7-self-etch-adhesive',
    brand: 'True Endo Dental',
    sku: 'IE-TE-BOND-7',
    hsnCode: '30064000',
    categorySlug: 'bonding-agents',
    price: 500,
    mrp: 750,
    discount: 33,
    gstPercent: 12,
    stock: 110,
    lowStockThreshold: 20,
    packSize: '1 x 5ml Dropper Bottle',
    manufacturer: 'True Endo Polymer Lab',
    expiryInfo: '24 Months from Mfg (Refrigerated storage recommended)',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-h-bond-7.jpg',
      '/images/products/true-endo-h-bond-7-card.jpg'
    ],
    description: '7th Generation single-bottle light-cure self-etch bonding adhesive containing 10-MDP monomer. Etches, primes, and bonds in one step with zero post-operative sensitivity and over 28 MPa shear bond strength to dentin and enamel.',
    specifications: {
      'Monomer': '10-MDP + 4-META + HEMA',
      'Shear Bond Strength': 'Dentin: 28.5 MPa, Enamel: 31.0 MPa',
      'Application Time': 'Apply for 10s, dry for 5s, cure for 10s'
    }
  },
  {
    name: 'True Endo Autoclavable Plastic Impression Trays Set (10 Pcs)',
    slug: 'true-endo-autoclavable-plastic-impression-trays',
    brand: 'True Endo Instruments',
    sku: 'IE-TE-PLASTIC-TRAYS',
    hsnCode: '90184900',
    categorySlug: 'trays',
    price: 250,
    mrp: 400,
    discount: 37,
    gstPercent: 18,
    stock: 80,
    lowStockThreshold: 15,
    packSize: 'Set of 10 Trays (Upper & Lower: #1 to #5 Assorted Sizes)',
    manufacturer: 'True Endo Instruments',
    expiryInfo: 'Autoclavable Medical Polypropylene',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-plastic-trays.jpg',
      '/images/products/true-endo-plastic-trays-card.jpg'
    ],
    description: 'Rigid medical polypropylene perforated dental impression trays with anatomical palatal vaults and retentive rim locks to prevent alginate distortion. Fully autoclavable up to 121°C.',
    specifications: {
      'Sizes': 'Full arch upper and lower, quadrant, and anterior trays (10 Pcs)',
      'Material': 'Heat-resistant medical polymer'
    }
  },
  {
    name: 'True Endo Digital RVG X-Ray Sensor Protective Sleeves (Box of 500)',
    slug: 'true-endo-rvg-sensor-protective-sleeves-500',
    brand: 'True Endo Medical',
    sku: 'IE-TE-RVG-SLEEVES',
    hsnCode: '39269099',
    categorySlug: 'barrier-sleeves',
    price: 1890,
    mrp: 2500,
    discount: 24,
    gstPercent: 18,
    stock: 45,
    lowStockThreshold: 10,
    packSize: 'Box of 500 Pcs Disposable Barrier Sleeves (Size 1 & Size 2 Compatible)',
    manufacturer: 'True Endo / Integrity Enterprises',
    expiryInfo: '5 Years Shelf Life',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-rvg-sleeves.jpg',
      '/images/products/true-endo-rvg-sleeves-card.jpg'
    ],
    description: 'Ultra-thin soft polyethylene barrier envelopes tailored for digital RVG sensors (Carestream, Vatech, Dexis, Woodpecker). Protects expensive digital sensors from saliva contamination, blood, and cross-infection.',
    specifications: {
      'Dimensions': 'Universal 20 cm x 4.5 cm with easy peel-off paper backing',
      'Compatibility': 'Size 1 and Size 2 intraoral digital radiography sensors',
      'Quantity': '500 custom barrier sleeves per box'
    }
  },
  {
    name: 'True Endo 100% Pure Absorbent Dental Cotton Rolls (Pack of 1000)',
    slug: 'true-endo-absorbent-cotton-rolls-1000',
    brand: 'True Endo Consumables',
    sku: 'IE-TE-COTTON-1000',
    hsnCode: '56012110',
    categorySlug: 'cotton-products',
    price: 300,
    mrp: 450,
    discount: 33,
    gstPercent: 12,
    stock: 150,
    lowStockThreshold: 25,
    packSize: 'Bulk Pack of 1000 Pcs (Size #2 Standard 1.5 inch)',
    manufacturer: 'True Endo Consumables',
    expiryInfo: '5 Years Shelf Life',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-cotton-rolls.jpg',
      '/images/products/true-endo-cotton-rolls-card.jpg'
    ],
    description: '100% pure bleached virgin cotton rolls held together with silky non-woven threads. Retains shape and structure when wet, will not stick to oral mucosa, and provides superior salivary isolation.',
    specifications: {
      'Material': '100% Purified Natural Cotton (Latex-free)',
      'Absorbency': 'Absorbs up to 15 times its weight in saliva',
      'Pack Size': '1000 pieces sealed hygiene bag'
    }
  },
  {
    name: 'True Endo Medical Powder-Free Blue Nitrile Gloves (Box of 100)',
    slug: 'true-endo-nitrile-examination-gloves-100',
    brand: 'True Endo Medical',
    sku: 'IE-TE-NITRILE-BOX',
    hsnCode: '40151100',
    categorySlug: 'gloves',
    price: 300,
    mrp: 450,
    discount: 33,
    gstPercent: 5,
    stock: 180,
    lowStockThreshold: 30,
    packSize: 'Box of 100 Gloves (Sizes: S, M, L available)',
    manufacturer: 'True Endo Medical Protective',
    expiryInfo: '5 Years from Mfg',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-nitrile-gloves.jpg',
      '/images/products/true-endo-nitrile-gloves-card.jpg'
    ],
    description: 'Medical examination grade powder-free blue nitrile gloves with micro-textured fingertips for positive tactile grip in wet oral environments. 100% latex-free to prevent Type I protein allergies.',
    specifications: {
      'Material': '100% Acrylonitrile Butadiene (Latex-Free)',
      'Thickness': '4.0 mil puncture-resistant barrier',
      'Tensile Strength': '> 18 MPa'
    }
  },
  {
    name: 'True Endo Medical Grade Latex Examination Gloves (Box of 100)',
    slug: 'true-endo-latex-examination-gloves-100',
    brand: 'True Endo Medical',
    sku: 'IE-TE-LATEX-BOX',
    hsnCode: '40151100',
    categorySlug: 'gloves',
    price: 260,
    mrp: 380,
    discount: 31,
    gstPercent: 5,
    stock: 160,
    lowStockThreshold: 25,
    packSize: 'Box of 100 Gloves (Sizes: S, M, L)',
    manufacturer: 'True Endo Medical Protective',
    expiryInfo: '5 Years from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-latex-gloves.jpg',
      '/images/products/true-endo-latex-gloves-card.jpg'
    ],
    description: 'High-elasticity natural rubber latex examination gloves with beaded cuffs and micro-roughened surface providing exceptional dexterity, elastic comfort, and reliable pathogen protection.',
    specifications: {
      'Material': 'Premium Natural Rubber Latex',
      'AQL Level': 'AQL 1.5 Medical Grade Compliance',
      'Quantity': '100 pieces per dispenser box'
    }
  },
  {
    name: 'True Endo Cal Premixed Calcium Hydroxide Paste Syringe (3g)',
    slug: 'true-endo-cal-calcium-hydroxide-paste',
    brand: 'True Endo Medical',
    sku: 'IE-TE-CAL-PASTE',
    hsnCode: '30064000',
    categorySlug: 'medicaments-pastes',
    price: 250,
    mrp: 380,
    discount: 34,
    gstPercent: 12,
    stock: 95,
    lowStockThreshold: 15,
    packSize: '1 x 3g Syringe + 4 Flexible Delivery Tips',
    manufacturer: 'True Endo Chemical Lab',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-cal-paste.jpg',
      '/images/products/true-endo-cal-paste-card.jpg'
    ],
    description: 'Water-soluble premixed calcium hydroxide paste with barium sulphate radiopacifier. High alkaline pH (> 12.5) provides potent bactericidal action for direct pulp capping, weeping root canals, and temporary canal disinfection.',
    specifications: {
      'pH': '> 12.5 Alkaline Antimicrobial',
      'Radiopacity': 'High radiopacity with Barium Sulphate',
      'Solubility': 'Easily washed out with saline or EDTA before obturation'
    }
  },
  {
    name: 'True Endo Cem Automix Dual-Cure Self-Adhesive Resin Cement Syringe (8g)',
    slug: 'true-endo-cem-automix-resin-cement-8g',
    brand: 'True Endo Dental',
    sku: 'IE-TE-CEM-AUTOMIX-8G',
    hsnCode: '30064000',
    categorySlug: 'cement',
    price: 1590,
    mrp: 2400,
    discount: 33,
    gstPercent: 12,
    stock: 45,
    lowStockThreshold: 8,
    packSize: '1 x 8g Automix Syringe (Base + Catalyst) + 10 Mixing Tips',
    manufacturer: 'True Endo Polymer Lab',
    expiryInfo: '24 Months from Mfg',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/true-endo-cem-automix.jpg',
      '/images/products/true-endo-cem-automix-card.jpg'
    ],
    description: 'Self-adhesive dual-curing universal resin cement requiring no separate etching or bonding primer. Perfect for zirconia, lithium disilicate, porcelain veneers, cast metal crowns, and fiber post luting.',
    specifications: {
      'Curing Mode': 'Dual-Cure (Self-cure setting in 4 mins + Light-cure in 20s)',
      'Automix Ratio': '1:1 homogeneous mixing without air entrapment',
      'Shade': 'Universal A2 Translucent'
    }
  },
  {
    name: 'True Endo Cal-Plus Calcium Hydroxide with Iodoform Oily Paste (2g)',
    slug: 'true-endo-cal-plus-iodoform-paste',
    brand: 'True Endo Medical',
    sku: 'IE-TE-CAL-PLUS',
    hsnCode: '30064000',
    categorySlug: 'medicaments-pastes',
    price: 250,
    mrp: 400,
    discount: 37,
    gstPercent: 12,
    stock: 85,
    lowStockThreshold: 15,
    packSize: '1 x 2g Syringe + 4 Fine Delivery Cannulas',
    manufacturer: 'True Endo Chemical Lab',
    expiryInfo: '36 Months from Mfg',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/true-endo-cal-plus.jpg',
      '/images/products/true-endo-cal-plus-card.jpg'
    ],
    description: 'Silicone oil-based calcium hydroxide paste enriched with 40% Iodoform for extended antimicrobial action. Highly recommended for pulpectomy in primary deciduous teeth, apexification, internal root resorption, and weeping canals.',
    specifications: {
      'Composition': 'Calcium Hydroxide (30%) + Iodoform (40%) in Silicone Oil Base',
      'Resorption': 'Resorbs at the same rate as deciduous roots',
      'Disinfection': 'Extended antimicrobial action'
    }
  },
  {
    name: 'Lignospan Local Anaesthetic LA Vials 30ml (Lignocaine 2% with Adrenaline)',
    slug: 'lignospan-local-anaesthetic-30ml-vial',
    brand: 'Speciality Pharma',
    sku: 'IE-LA-VIAL-30ML',
    hsnCode: '30049099',
    categorySlug: 'local-anaesthesia',
    price: 35,
    mrp: 50,
    discount: 30,
    gstPercent: 12,
    stock: 300,
    lowStockThreshold: 50,
    packSize: '30ml Multi-Dose Glass Vial with Rubber Septum',
    manufacturer: 'Speciality Pharmaceuticals',
    expiryInfo: '24 Months from Mfg (Store below 25°C protected from light)',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/la-lignocaine-vials.jpg',
      '/images/products/la-lignocaine-vials-card.jpg'
    ],
    description: 'Gold standard dental infiltration and nerve block local anaesthetic containing Lignocaine Hydrochloride 2% (20mg/ml) with Adrenaline (Epinephrine) 1:200,000 for prolonged anesthesia and local hemostasis during extractions and oral surgery.',
    specifications: {
      'Active Ingredients': 'Lignocaine HCl 21.3 mg/ml (2%) + Adrenaline Bitartrate 0.005 mg/ml',
      'Onset Time': '2 to 3 minutes',
      'Duration': 'Pulp anesthesia: 60 mins, Soft tissue: 2.5 to 3 hours'
    }
  },
  {
    name: 'Unolok Disposable Luer Lock Syringes 2.5ml with Needle (Box of 100)',
    slug: 'unolok-disposable-luer-lock-syringes-2-5ml',
    brand: 'Unolok Medical',
    sku: 'IE-UNOLOK-25ML-100',
    hsnCode: '90183100',
    categorySlug: 'syringes-needles',
    price: 300,
    mrp: 450,
    discount: 33,
    gstPercent: 12,
    stock: 150,
    lowStockThreshold: 20,
    packSize: 'Box of 100 Sterile Blister-Packed Syringes with 24G Needle',
    manufacturer: 'Hindustan Syringes & Medical Devices (HMD)',
    expiryInfo: '5 Years Sterile Shelf Life',
    isFeatured: false,
    isBestseller: true,
    images: [
      '/images/products/unolok-syringes-25ml.jpg',
      '/images/products/unolok-syringes-25ml-card.jpg'
    ],
    description: 'Medical-grade 3-piece disposable 2.5ml Luer Lock syringes with siliconized plunger for ultra-smooth fluid delivery and positive lock to prevent needle blow-off during high-pressure anaesthetic injection or canal irrigation.',
    specifications: {
      'Volume': '2.5 ml with 0.1ml high-clarity graduation',
      'Needle': '24 Gauge x 1.0 inch ultra-sharp silicone coated needle',
      'Locking': 'Threaded Luer Lock collar'
    }
  },
  {
    name: 'Drikam Neoalgin Dust-Free Chromatic Fast-Set Alginate (450g Pack)',
    slug: 'drikam-neoalgin-chromatic-alginate-450g',
    brand: 'Drikam Dental',
    sku: 'IE-DRIKAM-NEOALGIN',
    hsnCode: '30064000',
    categorySlug: 'impression-materials',
    price: 450,
    mrp: 650,
    discount: 30,
    gstPercent: 12,
    stock: 120,
    lowStockThreshold: 20,
    packSize: '450g Hermetic Aluminum Foil Pouch (Mint Flavour)',
    manufacturer: 'Drikam Dental Products',
    expiryInfo: '36 Months from Mfg',
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/drikam-neoalgin-alginate.jpg',
      '/images/products/drikam-neoalgin-alginate-card.jpg'
    ],
    description: 'High-precision chromatic fast-setting dust-free dental alginate impression material. Changes color through 3 distinct visual phases (Purple: Mixing ➔ Pink: Tray Loading ➔ White: Intraoral Setting) for error-free impression timing.',
    specifications: {
      'Detail Reproduction': '50 microns',
      'Color Indicator': 'Purple (Mix) ➔ Pink (Load) ➔ White (Set in mouth at 2m 10s)',
      'Flavor': 'Pleasant Spearmint',
      'Net Weight': '450 grams'
    }
  },
  {
    name: 'True Endo Universal Scaler Tips Replacement Set (Pack of 5 Assorted)',
    slug: 'true-endo-universal-scaler-tips-pack-5',
    brand: 'True Endo Instruments',
    sku: 'IE-TE-SCALER-PACK5',
    hsnCode: '90184900',
    categorySlug: 'scalers-tips',
    price: 300,
    mrp: 480,
    discount: 37,
    gstPercent: 18,
    stock: 80,
    lowStockThreshold: 15,
    packSize: 'Pack of 5 Tips (G1, G2, G3, G4, P1)',
    manufacturer: 'True Endo Instruments',
    expiryInfo: 'Autoclavable Stainless Steel',
    isFeatured: false,
    isBestseller: false,
    images: [
      '/images/products/true-endo-scaler-tips-pack5.jpg',
      '/images/products/true-endo-scaler-tips-pack5-card.jpg'
    ],
    description: 'Assorted set of 5 ultrasonic scaler tips (G1 supragingival, G2 heavy calculus, G3 interdental, G4 stain removal, P1 subgingival perio tip) compatible with EMS, Woodpecker, and DentaKart piezo scalers.',
    specifications: {
      'Tips Included': 'G1, G2, G3, G4, P1',
      'Thread Type': 'Standard M3 thread (EMS / Woodpecker compatible)',
      'Material': 'High-tensile tempered stainless steel'
    }
  }
];

export const seedCoupons = [
  {
    code: 'WELCOME10',
    description: '10% instant discount on your first dental clinic order',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 1000,
    maxDiscount: 1500,
    isActive: true
  },
  {
    code: 'DENTA100',
    description: 'Flat ₹100 off on emergency 15-min express orders over ₹1,000',
    discountType: 'FIXED',
    discountValue: 100,
    minOrderValue: 1000,
    isActive: true
  },
  {
    code: 'DENTAL500',
    description: 'Flat ₹500 discount on bulk clinical stock orders over ₹5,000',
    discountType: 'FIXED',
    discountValue: 500,
    minOrderValue: 5000,
    isActive: true
  },
  {
    code: 'FREESHIP',
    description: 'Free instant 15-minute express priority courier on all orders',
    discountType: 'FIXED',
    discountValue: 100,
    minOrderValue: 500,
    isActive: true
  },
  {
    code: 'WELCOME20',
    description: '20% welcome discount for newly registered clinic accounts',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 2000,
    maxDiscount: 2000,
    isActive: true
  }
];

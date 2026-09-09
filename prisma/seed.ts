import { PrismaClient, Role, VerificationStatus, StockStatus, ProductCondition, FreshnessState, AttributeType, IdentifierType, AlertStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PriceRadar Kenya database seed...');

  // 1. Create Users (Admin, Demo Merchants, Demo Customer)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@priceradar.co.ke' },
    update: {},
    create: {
      email: 'admin@priceradar.co.ke',
      passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjO988v1pXz.Gz9E90K1X6/P2Fp0W50c1K', // hashed 'Admin123!'
      name: 'System Admin',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: 'customer@example.co.ke' },
    update: {},
    create: {
      email: 'customer@example.co.ke',
      passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjO988v1pXz.Gz9E90K1X6/P2Fp0W50c1K',
      name: 'Wanjiku Kamau',
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  });

  // Create Merchant Users & Merchants
  const merchantsData = [
    {
      name: 'Jumia Kenya',
      slug: 'jumia-kenya',
      email: 'merchant@jumia.co.ke',
      phone: '+254 700 000 001',
      address: 'Mombasa Road, Jumia Logistics Hub, Nairobi',
      url: 'https://www.jumia.co.ke',
      trustScore: 94,
      verified: VerificationStatus.VERIFIED,
      isDemo: true,
    },
    {
      name: 'PhonePlace Kenya',
      slug: 'phoneplace-kenya',
      email: 'sales@phoneplacekenya.com',
      phone: '+254 726 000 002',
      address: 'Bazaar Plaza, 1st Floor, Moi Avenue, Nairobi',
      url: 'https://www.phoneplacekenya.com',
      trustScore: 91,
      verified: VerificationStatus.VERIFIED,
      isDemo: true,
    },
    {
      name: 'Avechi Kenya',
      slug: 'avechi-kenya',
      email: 'support@avechi.co.ke',
      phone: '+254 701 111 222',
      address: 'Pioneer House, Kimathi Street, Nairobi',
      url: 'https://www.avechi.co.ke',
      trustScore: 88,
      verified: VerificationStatus.VERIFIED,
      isDemo: true,
    },
    {
      name: 'Hotpoint Appliances Kenya',
      slug: 'hotpoint-kenya',
      email: 'info@hotpoint.co.ke',
      phone: '+254 733 444 555',
      address: 'Sarit Centre, Westlands, Nairobi',
      url: 'https://www.hotpoint.co.ke',
      trustScore: 96,
      verified: VerificationStatus.VERIFIED,
      isDemo: true,
    },
    {
      name: 'Salim Electronics Hub',
      slug: 'salim-electronics',
      email: 'salim@electronics.co.ke',
      phone: '+254 712 345 678',
      address: 'Luthuli Avenue, Nairobi CBD',
      url: 'https://www.salimelectronics.co.ke',
      trustScore: 82,
      verified: VerificationStatus.VERIFIED,
      isDemo: true,
    },
    {
      name: 'Kilimall Kenya',
      slug: 'kilimall-kenya',
      email: 'service@kilimall.com',
      phone: '+254 730 000 999',
      address: 'Kilimall Warehouse, Mlolongo, Machakos',
      url: 'https://www.kilimall.co.ke',
      trustScore: 85,
      verified: VerificationStatus.VERIFIED,
      isDemo: true,
    },
    {
      name: 'Anker Official Store KE',
      slug: 'anker-official-ke',
      email: 'sales@anker.co.ke',
      phone: '+254 799 888 777',
      address: 'Two Rivers Mall, Ruaka, Nairobi',
      url: 'https://www.ankerstores.co.ke',
      trustScore: 95,
      verified: VerificationStatus.VERIFIED,
      isDemo: true,
    },
  ];

  const merchants = [];
  for (const mData of merchantsData) {
    const mUser = await prisma.user.upsert({
      where: { email: mData.email },
      update: {},
      create: {
        email: mData.email,
        passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjO988v1pXz.Gz9E90K1X6/P2Fp0W50c1K',
        name: `${mData.name} Manager`,
        role: Role.MERCHANT_ADMIN,
        emailVerified: true,
      },
    });

    const merchant = await prisma.merchant.upsert({
      where: { slug: mData.slug },
      update: {},
      create: {
        ownerId: mUser.id,
        name: mData.name,
        slug: mData.slug,
        email: mData.email,
        phone: mData.phone,
        physicalAddress: mData.address,
        websiteUrl: mData.url,
        trustScore: mData.trustScore,
        verificationStatus: mData.verified,
        returnPolicy: '7-day money-back guarantee for unopened items.',
        warrantyPolicy: '12-month manufacturer warranty provided.',
        isDemo: true,
      },
    });
    merchants.push(merchant);
  }

  // 2. Create Categories
  const categoriesData = [
    { name: 'Smartphones', slug: 'smartphones', icon: 'smartphone', desc: 'Mobile phones & phablets' },
    { name: 'Laptops', slug: 'laptops', icon: 'laptop', desc: 'Notebooks, ultrabooks & gaming laptops' },
    { name: 'Tablets', slug: 'tablets', icon: 'tablet', desc: 'iPads & Android tablets' },
    { name: 'Smartwatches', slug: 'smartwatches', icon: 'watch', desc: 'Wearable tech & fitness trackers' },
    { name: 'Headphones', slug: 'headphones', icon: 'headphones', desc: 'Wireless earbuds & over-ear headphones' },
    { name: 'Monitors', slug: 'monitors', icon: 'monitor', desc: 'Gaming & professional displays' },
    { name: 'Cameras', slug: 'cameras', icon: 'camera', desc: 'DSLR, mirrorless & action cameras' },
    { name: 'Accessories', slug: 'accessories', icon: 'cpu', desc: 'Chargers, power banks & cables' },
  ];

  const categoriesMap = new Map();
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.desc,
      },
    });
    categoriesMap.set(cat.slug, c);
  }

  // 3. Create Brands
  const brandsData = [
    { name: 'Samsung', slug: 'samsung', country: 'South Korea' },
    { name: 'Apple', slug: 'apple', country: 'United States' },
    { name: 'HP', slug: 'hp', country: 'United States' },
    { name: 'Dell', slug: 'dell', country: 'United States' },
    { name: 'Lenovo', slug: 'lenovo', country: 'China' },
    { name: 'Sony', slug: 'sony', country: 'Japan' },
    { name: 'Xiaomi', slug: 'xiaomi', country: 'China' },
    { name: 'Tecno', slug: 'tecno', country: 'China' },
    { name: 'Infinix', slug: 'infinix', country: 'China' },
    { name: 'Asus', slug: 'asus', country: 'Taiwan' },
  ];

  const brandsMap = new Map();
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
        country: b.country,
      },
    });
    brandsMap.set(b.slug, brand);
  }

  // 4. Create Attributes
  const attributesData = [
    { name: 'RAM', slug: 'ram', dataType: AttributeType.STRING, unit: 'GB' },
    { name: 'Storage', slug: 'storage', dataType: AttributeType.STRING, unit: 'GB' },
    { name: 'Battery', slug: 'battery', dataType: AttributeType.STRING, unit: 'mAh' },
    { name: 'Display Size', slug: 'display-size', dataType: AttributeType.STRING, unit: 'inches' },
    { name: 'Refresh Rate', slug: 'refresh-rate', dataType: AttributeType.STRING, unit: 'Hz' },
    { name: 'Processor', slug: 'processor', dataType: AttributeType.STRING },
    { name: 'Camera', slug: 'camera', dataType: AttributeType.STRING, unit: 'MP' },
    { name: '5G Support', slug: '5g-support', dataType: AttributeType.BOOLEAN },
    { name: 'Operating System', slug: 'operating-system', dataType: AttributeType.STRING },
    { name: 'GPU', slug: 'gpu', dataType: AttributeType.STRING },
    { name: 'Resolution', slug: 'resolution', dataType: AttributeType.STRING },
  ];

  const attributesMap = new Map();
  for (const attr of attributesData) {
    const attribute = await prisma.attribute.upsert({
      where: { slug: attr.slug },
      update: {},
      create: {
        name: attr.name,
        slug: attr.slug,
        dataType: attr.dataType,
        unit: attr.unit,
      },
    });
    attributesMap.set(attr.slug, attribute);
  }

  // 5. Create Canonical Products & Variants
  const productsSetup = [
    {
      name: 'Samsung Galaxy S25 Ultra',
      slug: 'samsung-galaxy-s25-ultra',
      brandSlug: 'samsung',
      catSlug: 'smartphones',
      modelNumber: 'SM-S938B',
      description: 'The pinnacle of mobile engineering with Snapdragon 8 Gen 4, 200MP Quad Camera, S-Pen integration, and Titanium design.',
      mainImageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop',
      variants: [
        {
          name: '256GB / 12GB RAM (Titanium Black)',
          slug: 'samsung-s25-ultra-256gb-black',
          gtin: '880609500001',
          mpn: 'SMS938BZKD',
          basePrice: 124999,
          attrs: {
            ram: '12',
            storage: '256',
            battery: '5000',
            'display-size': '6.8',
            'refresh-rate': '120',
            processor: 'Snapdragon 8 Gen 4',
            camera: '200',
            '5g-support': true,
            'operating-system': 'Android 15 (One UI 7)',
          },
        },
        {
          name: '512GB / 12GB RAM (Titanium Gray)',
          slug: 'samsung-s25-ultra-512gb-gray',
          gtin: '880609500002',
          mpn: 'SMS938BZGD',
          basePrice: 144999,
          attrs: {
            ram: '12',
            storage: '512',
            battery: '5000',
            'display-size': '6.8',
            'refresh-rate': '120',
            processor: 'Snapdragon 8 Gen 4',
            camera: '200',
            '5g-support': true,
            'operating-system': 'Android 15 (One UI 7)',
          },
        }
      ]
    },
    {
      name: 'Apple iPhone 16 Pro Max',
      slug: 'apple-iphone-16-pro-max',
      brandSlug: 'apple',
      catSlug: 'smartphones',
      modelNumber: 'A3106',
      description: 'Powered by the groundbreaking A18 Pro chip, Grade 5 Titanium chassis, 48MP Fusion camera system, and Camera Control button.',
      mainImageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop',
      variants: [
        {
          name: '256GB (Natural Titanium)',
          slug: 'iphone-16-pro-max-256gb-natural',
          gtin: '194253000001',
          mpn: 'MYW93ZD/A',
          basePrice: 178999,
          attrs: {
            ram: '8',
            storage: '256',
            battery: '4685',
            'display-size': '6.9',
            'refresh-rate': '120',
            processor: 'Apple A18 Pro',
            camera: '48',
            '5g-support': true,
            'operating-system': 'iOS 18',
          },
        },
        {
          name: '512GB (Desert Titanium)',
          slug: 'iphone-16-pro-max-512gb-desert',
          gtin: '194253000002',
          mpn: 'MYWD3ZD/A',
          basePrice: 204999,
          attrs: {
            ram: '8',
            storage: '512',
            battery: '4685',
            'display-size': '6.9',
            'refresh-rate': '120',
            processor: 'Apple A18 Pro',
            camera: '48',
            '5g-support': true,
            'operating-system': 'iOS 18',
          },
        }
      ]
    },
    {
      name: 'HP Spectre x360 14 Convertible',
      slug: 'hp-spectre-x360-14',
      brandSlug: 'hp',
      catSlug: 'laptops',
      modelNumber: '14-eu0000',
      description: 'Ultra-slim 2-in-1 convertible laptop featuring Intel Core Ultra 7 processor, 2.8K OLED touch display, and AI noise reduction.',
      mainImageUrl: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&auto=format&fit=crop',
      variants: [
        {
          name: 'Intel Core Ultra 7 / 16GB RAM / 1TB SSD',
          slug: 'hp-spectre-x360-14-i7-16gb-1tb',
          gtin: '197961000001',
          mpn: '9E0D4EA',
          basePrice: 169999,
          attrs: {
            ram: '16',
            storage: '1000',
            'display-size': '14.0',
            'refresh-rate': '120',
            processor: 'Intel Core Ultra 7 155H',
            gpu: 'Intel Arc Graphics',
            resolution: '2880 x 1800 OLED',
            'operating-system': 'Windows 11 Home',
          },
        }
      ]
    },
    {
      name: 'Dell XPS 15 9530',
      slug: 'dell-xps-15-9530',
      brandSlug: 'dell',
      catSlug: 'laptops',
      modelNumber: 'XPS9530',
      description: 'Premium performance creator laptop with 13th Gen Intel Core i7, NVIDIA GeForce RTX 4060 graphics, and 3.5K OLED InfinityEdge display.',
      mainImageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop',
      variants: [
        {
          name: 'Core i7 / 16GB RAM / 512GB SSD / RTX 4060',
          slug: 'dell-xps-15-i7-16gb-512gb-rtx4060',
          gtin: '539718400001',
          mpn: 'XPS9530-7001',
          basePrice: 210000,
          attrs: {
            ram: '16',
            storage: '512',
            'display-size': '15.6',
            'refresh-rate': '60',
            processor: 'Intel Core i7-13700H',
            gpu: 'NVIDIA RTX 4060 8GB',
            resolution: '3456 x 2160 OLED',
            'operating-system': 'Windows 11 Pro',
          },
        }
      ]
    },
    {
      name: 'Apple MacBook Pro 14 M3',
      slug: 'apple-macbook-pro-14-m3',
      brandSlug: 'apple',
      catSlug: 'laptops',
      modelNumber: 'MR7J3',
      description: 'Supercharged by M3 chip, liquid Retina XDR display, up to 22 hours of battery life, and Space Gray aluminum unibody.',
      mainImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
      variants: [
        {
          name: 'M3 8-core CPU / 10-core GPU / 16GB RAM / 512GB SSD',
          slug: 'macbook-pro-14-m3-16gb-512gb',
          gtin: '194253990001',
          mpn: 'MR7J3ZE/A',
          basePrice: 235000,
          attrs: {
            ram: '16',
            storage: '512',
            battery: '70',
            'display-size': '14.2',
            'refresh-rate': '120',
            processor: 'Apple M3',
            gpu: 'M3 10-core GPU',
            resolution: '3024 x 1964 Liquid Retina XDR',
            'operating-system': 'macOS Sequoia',
          },
        }
      ]
    },
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5',
      brandSlug: 'sony',
      catSlug: 'headphones',
      modelNumber: 'WH1000XM5/B',
      description: 'Industry-leading noise canceling over-ear headphones with 8 microphones, Auto NC Optimizer, and 30-hour battery life.',
      mainImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
      variants: [
        {
          name: 'Black',
          slug: 'sony-wh-1000xm5-black',
          gtin: '027242922001',
          mpn: 'WH1000XM5B',
          basePrice: 42999,
          attrs: {
            battery: '30',
            '5g-support': false,
          },
        }
      ]
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro+ 5G',
      slug: 'xiaomi-redmi-note-13-pro-plus-5g',
      brandSlug: 'xiaomi',
      catSlug: 'smartphones',
      modelNumber: '23090RA98G',
      description: 'Flagship 200MP OIS camera, 120W HyperCharge, IP68 water resistance, and 1.5K 120Hz curved AMOLED display.',
      mainImageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop',
      variants: [
        {
          name: '512GB / 12GB RAM (Midnight Black)',
          slug: 'redmi-note-13-pro-plus-512gb-black',
          gtin: '694181270001',
          mpn: 'MZB0F40EU',
          basePrice: 54999,
          attrs: {
            ram: '12',
            storage: '512',
            battery: '5000',
            'display-size': '6.67',
            'refresh-rate': '120',
            processor: 'MediaTek Dimensity 7200 Ultra',
            camera: '200',
            '5g-support': true,
            'operating-system': 'Android 14 (HyperOS)',
          },
        }
      ]
    }
  ];

  for (const p of productsSetup) {
    const brand = brandsMap.get(p.brandSlug);
    const category = categoriesMap.get(p.catSlug);

    if (!brand || !category) continue;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        brandId: brand.id,
        categoryId: category.id,
        modelNumber: p.modelNumber,
        description: p.description,
        mainImageUrl: p.mainImageUrl,
      },
    });

    for (const v of p.variants) {
      const variant = await prisma.variant.upsert({
        where: { slug: v.slug },
        update: {},
        create: {
          productId: product.id,
          name: v.name,
          slug: v.slug,
          isDefault: true,
        },
      });

      // Identifiers
      await prisma.productIdentifier.upsert({
        where: { type_value: { type: IdentifierType.GTIN, value: v.gtin } },
        update: {},
        create: {
          variantId: variant.id,
          type: IdentifierType.GTIN,
          value: v.gtin,
        },
      });

      await prisma.productIdentifier.upsert({
        where: { type_value: { type: IdentifierType.MPN, value: v.mpn } },
        update: {},
        create: {
          variantId: variant.id,
          type: IdentifierType.MPN,
          value: v.mpn,
        },
      });

      // Attribute Values
      for (const [attrSlug, attrValue] of Object.entries(v.attrs)) {
        const attribute = attributesMap.get(attrSlug);
        if (!attribute) continue;

        let valStr: string | null = null;
        let valNum: number | null = null;
        let valBool: boolean | null = null;

        if (typeof attrValue === 'boolean') {
          valBool = attrValue;
        } else if (typeof attrValue === 'number' || !isNaN(Number(attrValue))) {
          valNum = Number(attrValue);
          valStr = String(attrValue);
        } else {
          valStr = String(attrValue);
        }

        await prisma.productAttributeValue.create({
          data: {
            variantId: variant.id,
            attributeId: attribute.id,
            valueString: valStr,
            valueNumber: valNum,
            valueBoolean: valBool,
            unit: attribute.unit,
          },
        });
      }

      // Generate Offers across the merchants
      const variantPriceBase = v.basePrice;

      // Merchant 0 (Jumia)
      const offer1Price = Math.round(variantPriceBase * 0.98); // KSh 122,499
      const offer1 = await prisma.offer.create({
        data: {
          variantId: variant.id,
          merchantId: merchants[0].id,
          merchantSku: `JUM-${v.gtin}`,
          title: `${p.name} - ${v.name}`,
          url: `${merchants[0].websiteUrl}/catalog/${v.slug}`,
          priceKes: offer1Price,
          originalPriceKes: variantPriceBase,
          deliveryFeeKes: 0,
          totalCostKes: offer1Price,
          isDeliveryFree: true,
          stockStatus: StockStatus.IN_STOCK,
          condition: ProductCondition.NEW,
          warrantyMonths: 12,
          warrantyText: 'Official Brand Warranty in Kenya',
          lastCheckedAt: new Date(),
          freshnessState: FreshnessState.FRESH,
        }
      });

      // Merchant 1 (PhonePlace Kenya)
      const offer2Price = Math.round(variantPriceBase * 0.96); // KSh 119,999 (lowest!)
      const offer2 = await prisma.offer.create({
        data: {
          variantId: variant.id,
          merchantId: merchants[1].id,
          merchantSku: `PPK-${v.gtin}`,
          title: `${p.name} (${v.name}) Official Kenyan Stock`,
          url: `${merchants[1].websiteUrl}/product/${v.slug}`,
          priceKes: offer2Price,
          originalPriceKes: variantPriceBase,
          deliveryFeeKes: 500,
          totalCostKes: offer2Price + 500,
          isDeliveryFree: false,
          stockStatus: StockStatus.IN_STOCK,
          condition: ProductCondition.NEW,
          warrantyMonths: 12,
          warrantyText: '1 Year Store Warranty',
          lastCheckedAt: new Date(),
          freshnessState: FreshnessState.FRESH,
        }
      });

      // Merchant 2 (Avechi Kenya)
      const offer3Price = Math.round(variantPriceBase * 1.02); // KSh 127,500
      const offer3 = await prisma.offer.create({
        data: {
          variantId: variant.id,
          merchantId: merchants[2].id,
          merchantSku: `AV-SKU-${v.gtin}`,
          title: `${p.name} ${v.name}`,
          url: `${merchants[2].websiteUrl}/item/${v.slug}`,
          priceKes: offer3Price,
          originalPriceKes: Math.round(variantPriceBase * 1.05),
          deliveryFeeKes: 350,
          totalCostKes: offer3Price + 350,
          isDeliveryFree: false,
          stockStatus: StockStatus.IN_STOCK,
          condition: ProductCondition.NEW,
          warrantyMonths: 24,
          warrantyText: '2 Year Avechi Care Protection',
          lastCheckedAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
          freshnessState: FreshnessState.FRESH,
        }
      });

      // Seed Price History for offer2 (90 days trend)
      const now = new Date();
      const historyPoints = [
        { daysAgo: 90, price: variantPriceBase * 1.10 },
        { daysAgo: 60, price: variantPriceBase * 1.05 },
        { daysAgo: 30, price: variantPriceBase * 1.00 },
        { daysAgo: 14, price: variantPriceBase * 0.98 },
        { daysAgo: 0, price: offer2Price },
      ];

      for (const hp of historyPoints) {
        const date = new Date(now.getTime() - hp.daysAgo * 86400000);
        await prisma.priceHistory.create({
          data: {
            offerId: offer2.id,
            priceKes: hp.price,
            deliveryFeeKes: 500,
            totalCostKes: hp.price + 500,
            stockStatus: StockStatus.IN_STOCK,
            recordedAt: date,
          },
        });
      }
    }
  }

  // Create sample Price Alert for demoCustomer
  const firstVariant = await prisma.variant.findFirst();
  if (firstVariant) {
    await prisma.priceAlert.create({
      data: {
        userId: demoCustomer.id,
        variantId: firstVariant.id,
        targetPriceKes: 120000,
        status: AlertStatus.ACTIVE,
      },
    });
  }

  console.log('✅ PriceRadar Kenya database seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

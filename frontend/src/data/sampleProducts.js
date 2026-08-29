// SIH26090 Sample Artisan Product Data Presets for Camera Simulator & AI Pipeline

export const SAMPLE_PRODUCTS = [
  {
    id: 'bamboo-basket',
    name: 'Handwoven Natural Bamboo Storage Basket',
    category: 'Home Decor',
    artisanName: 'Ramesh Kumar',
    craftType: 'Handwoven Bamboo Craft',
    region: 'Assam, India',
    angles: {
      front: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
      left: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
      right: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'
    },
    defaultVoiceTranscript: 'Ye basket bamboo se bana hai aur ise banane mein do din lagte hain. Ye ghar mein samaan rakhne ke liye bahut accha hai.',
    analysis: {
      productType: 'Basket',
      category: 'Home Decor',
      materialsObserved: ['Natural Bamboo', 'Organic Fiber'],
      colorsObserved: ['Natural Warm Brown', 'Beige'],
      shape: 'Round / Cylindrical',
      construction: 'Handwoven lattice weave',
      visibleFeatures: ['Two sturdy side handles', 'Woven texture', 'Reinforced raised rim'],
      dimensions: '30 cm x 30 cm x 25 cm',
      weight: '450g'
    },
    generatedContent: {
      title: 'Handwoven Natural Bamboo Storage Basket with Dual Handles',
      shortDescriptionEn: 'Eco-friendly handwoven bamboo basket crafted by Assam artisans. Perfect for organize-first living rooms and bedrooms.',
      descriptionEn: 'Expertly crafted from 100% natural sustainably harvested bamboo, this handwoven storage basket showcases traditional North-East Indian weaving techniques. Features reinforced side handles for easy carrying and a lightweight yet durable lattice construction.',
      descriptionHi: 'यह हस्तनिर्मित प्राकृतिक बांस की टोकरी असम के कुशल कारीगरों द्वारा बनाई गई है। घर की सजावट और सामान रखने के लिए उत्तम है।',
      seoDescriptionEn: 'Buy handwoven bamboo storage basket online. Eco-friendly handicraft home decor basket with handles.',
      tags: ['#BambooCraft', '#Handwoven', '#IndianHandicraft', '#HomeDecor', '#EcoFriendly', '#StorageBasket']
    },
    photoshootPrompts: {
      hero: 'Handwoven natural bamboo storage basket centered on soft minimalist off-white surface, studio softbox lighting, high dynamic range commercial product photography.',
      lifestyle: 'Handwoven bamboo basket placed elegantly beside a sunlit beige linen sofa in a warm minimalist Scandinavian living room with green houseplants.',
      detail: 'Macro extreme close-up shot highlighting the intricate lattice weave pattern, natural texture, and hand-stitched bamboo fibre details.',
      context: 'Handwoven natural bamboo basket used inside a cozy bedroom storing rolled organic cotton towels and textiles.'
    },
    generatedPhotos: {
      hero: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1000&q=80',
      lifestyle: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
      detail: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80',
      context: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1000&q=80'
    },
    pricing: {
      materialCost: 250,
      labourCost: 120,
      packagingCost: 30,
      otherCost: 0,
      desiredMarginPct: 35
    }
  },
  {
    id: 'terracotta-diya',
    name: 'Handcrafted Terracotta Clay Oil Lamp (Diya)',
    category: 'Festive & Pottery',
    artisanName: 'Sunita Devi',
    craftType: 'Pottery & Clay Craft',
    region: 'Rajasthan, India',
    angles: {
      front: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
      left: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
      right: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
      detail: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80'
    },
    defaultVoiceTranscript: 'Ye mitti ka diya hand carved hai. Isko pakane mein aur paint karne mein 1 din lagta hai.',
    analysis: {
      productType: 'Oil Lamp / Diya',
      category: 'Festive & Pottery',
      materialsObserved: ['Terracotta Clay', 'Natural Pigments'],
      colorsObserved: ['Earthy Clay Red', 'Gold Accent'],
      shape: 'Traditional Curved Petal Shape',
      construction: 'Wheel-thrown and hand-carved clay',
      visibleFeatures: ['Intricate carved lip', 'Burnished smooth interior', 'Stable flat base'],
      dimensions: '12 cm x 10 cm x 5 cm',
      weight: '200g'
    },
    generatedContent: {
      title: 'Handcrafted Terracotta Clay Diya with Intricate Hand Carving',
      shortDescriptionEn: 'Traditional eco-friendly terracotta clay diya hand-shaped by Rajasthani artisans.',
      descriptionEn: 'Handmade terracotta diya sculpted on traditional potter wheels and hand-carved with traditional floral motifs. Baked in clay kilns for durability.',
      descriptionHi: 'राजस्थान की मिट्टी से बना हस्तनिर्मित दीपक। त्योहारों और पूजा के लिए शुभ।',
      seoDescriptionEn: 'Buy handcrafted terracotta diya online. Traditional clay oil lamp for festive decor.',
      tags: ['#Terracotta', '#HandmadeDiya', '#ClayCraft', '#FestiveDecor', '#IndianArtisan']
    },
    photoshootPrompts: {
      hero: 'Handcrafted terracotta diya on neutral polished marble background, soft directional warm light.',
      lifestyle: 'Lit terracotta diya glowing warmly on a decorated rangoli entry door during festival evening.',
      detail: 'Macro shot showing clay grooves, hand-painted gold motif, and authentic texture.',
      context: 'Terracotta diya placed in a traditional puja alter setup surrounded by marigold flowers.'
    },
    generatedPhotos: {
      hero: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=1000&q=80',
      lifestyle: 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=1000&q=80',
      detail: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=1000&q=80',
      context: 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=1000&q=80'
    },
    pricing: {
      materialCost: 80,
      labourCost: 90,
      packagingCost: 20,
      otherCost: 0,
      desiredMarginPct: 40
    }
  }
];

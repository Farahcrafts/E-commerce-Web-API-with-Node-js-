const mongoose = require("mongoose");
const { Product } = require("./models/product");
const { Category } = require("./models/category");
require("dotenv/config");

// Cheerful, Vibrant Categories
const beautyCategories = [
  { name: "Skincare", icon: "✨", color: "#FF9A9E" },       // Cheerful Pink
  { name: "Body Care", icon: "🛁", color: "#A1C4FD" },      // Bright Pastel Blue
  { name: "Fragrance", icon: "🌸", color: "#FBC2EB" },      // Sweet Lilac
  { name: "Suncare", icon: "☀️", color: "#F6D365" },        // Sunny Yellow
];

// Expanded 16 Products (4 per category) with extremely reliable image URLs
const beautyProducts = [
  // ─── SKINCARE ─────────────────────────────────────────────────────────────
  {
    name: "Lumière Hydrating Serum",
    categoryName: "Skincare",
    description: "A lightweight hyaluronic acid serum that deeply hydrates.",
    richDescription: "This advanced formula penetrates deep to deliver intense, long-lasting moisture. Enriched with botanical extracts, it leaves your complexion dewy, radiant, and youthful.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b"],
    brand: "Lumière", price: 45.0, countInStock: 120, rating: 4.8, numReviews: 32, isFeatured: true,
  },
  {
    name: "Exfoliating Clay Mask",
    categoryName: "Skincare",
    description: "Purifies pores and removes dead skin cells.",
    richDescription: "Made with French pink clay and crushed botanical seeds, it gently detoxifies and refines skin texture in just 10 minutes.",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227",
    brand: "Lumière", price: 38.0, countInStock: 60, rating: 4.6, numReviews: 41, isFeatured: true,
  },
  {
    name: "Rose Quartz Face Roller",
    categoryName: "Skincare",
    description: "Reduces puffiness and enhances product absorption.",
    richDescription: "Crafted from 100% natural rose quartz, this traditional tool promotes lymphatic drainage and leaves your skin feeling exceptionally cool and lifted.",
    image: "https://unsplash.com/fr/photos/bouteille-en-plastique-blanc-et-noir-a-cote-de-lornement-en-forme-de-coeur-blanc-KiQt6CC0BvY",
    brand: "Lumière", price: 25.0, countInStock: 200, rating: 4.9, numReviews: 128, isFeatured: false,
  },
  {
    name: "Vitamin C Brightening Drops",
    categoryName: "Skincare",
    description: "Fades dark spots and evens out skin tone instantly.",
    richDescription: "A potent 15% Vitamin C complex that fights free radicals and brings unparalleled luminosity to tired, dull skin without causing irritation.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571",
    brand: "Lumière", price: 52.0, countInStock: 80, rating: 4.7, numReviews: 56, isFeatured: true,
  },

  // ─── BODY CARE ────────────────────────────────────────────────────────────
  {
    name: "Nourishing Body Butter",
    categoryName: "Body Care",
    description: "A rich, whipped blend of shea butter and coconut oil.",
    richDescription: "Melt dry skin away with this intensely moisturizing body butter. It absorbs quickly without leaving a greasy residue.",
    image: "https://unsplash.com/fr/photos/assortiment-des-produits-de-soins-de-la-peau-good-hygiene-co-I1cohNZ7g0E",
    brand: "Lumière", price: 28.0, countInStock: 80, rating: 4.9, numReviews: 120, isFeatured: true,
  },
  {
    name: "Invigorating Coffee Scrub",
    categoryName: "Body Care",
    description: "Wakes up dull skin by boosting circulation.",
    richDescription: "Crafted with roasted arabica coffee beans and sweet almond oil, this scrub tackles rough patches revealing incredibly soft skin.",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19",
    brand: "Lumière", price: 22.0, countInStock: 150, rating: 4.7, numReviews: 64, isFeatured: false,
  },
  {
    name: "Silky Bath Oil",
    categoryName: "Body Care",
    description: "Transforms your bath into a milky, hydrating ritual.",
    richDescription: "Infused with oat extract and lavender, it coats the skin in a breathable protective layer of moisture, perfect for winding down before bed.",
    image: "https://unsplash.com/fr/photos/une-bouteille-de-shampoing-posee-sur-un-tas-de-roches-8kV8XRv5OAc",
    brand: "Lumière", price: 34.0, countInStock: 45, rating: 4.8, numReviews: 90, isFeatured: false,
  },
  {
    name: "Firming Body Lotion",
    categoryName: "Body Care",
    description: "Lightweight moisture that tightens and smooths.",
    richDescription: "A daily essential. Packed with squalane and green tea extract, it reinforces the skin's barrier and improves elasticity over time.",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e",
    brand: "Lumière", price: 26.0, countInStock: 180, rating: 4.5, numReviews: 33, isFeatured: true,
  },

  // ─── FRAGRANCE ────────────────────────────────────────────────────────────
  {
    name: "Midnight Magnolia Perfume",
    categoryName: "Fragrance",
    description: "An alluring blend of white florals and amber.",
    richDescription: "The signature Lumière fragrance. Midnight Magnolia captures the essence of a blossoming garden under moonlight.",
    image: "https://unsplash.com/fr/photos/flacon-noir-avec-des-figues-sur-tissu-fonce-NNcJ31Vkc0M",
    brand: "Lumière", price: 85.0, countInStock: 45, rating: 5.0, numReviews: 88, isFeatured: true,
  },
  {
    name: "Citrus Grove Body Mist",
    categoryName: "Fragrance",
    description: "A vibrant spray of sweet orange blossom and neroli.",
    richDescription: "A burst of sunshine in a bottle. This lightweight body mist refreshes your senses instantly and provides a long-lasting cheerful vibe.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    brand: "Lumière", price: 36.0, countInStock: 110, rating: 4.4, numReviews: 22, isFeatured: false,
  },
  {
    name: "Sandalwood Roll-On",
    categoryName: "Fragrance",
    description: "A grounding, warm scent perfect for pulse points.",
    richDescription: "Travel-friendly and highly concentrated. This natural perfume oil uses pure Australian sandalwood for a cozy, woody finish.",
    image: "https://unsplash.com/fr/photos/une-bouteille-de-liquide-posee-sur-une-surface-blanche-_AHzOMIV7Vw",
    brand: "Lumière", price: 24.0, countInStock: 200, rating: 4.6, numReviews: 145, isFeatured: true,
  },
  {
    name: "Ocean Breeze Eau de Parfum",
    categoryName: "Fragrance",
    description: "Crisp marine notes paired with sea salt.",
    richDescription: "Transport yourself to the coast. A refreshing, unisex fragrance that balances crisp oceanic notes with a subtle, musky undertone.",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75",
    brand: "Lumière", price: 92.0, countInStock: 25, rating: 4.9, numReviews: 50, isFeatured: false,
  },

  // ─── SUNCARE ──────────────────────────────────────────────────────────────
  {
    name: "Invisible Glow SPF 50",
    categoryName: "Suncare",
    description: "A weightless daily sunscreen that leaves zero white-cast.",
    richDescription: "Protecting your skin has never been easier. This broad-spectrum SPF 50 gel melts invisibly into the skin.",
    image: "https://unsplash.com/fr/photos/bouteille-tubulaire-en-plastique-rose-et-blanc-BibJjO4sYrI",
    brand: "Sol. by Lumière", price: 40.0, countInStock: 250, rating: 4.8, numReviews: 210, isFeatured: true,
  },
  {
    name: "After-Sun Aloe Gel",
    categoryName: "Suncare",
    description: "Cooling relief for sun-exposed skin.",
    richDescription: "Formulated with 98% pure aloe vera and cucumber extract, it immediately cools and calms redness after a long day at the beach.",
    image: "https://unsplash.com/fr/photos/flacon-tube-blanc-et-noir-2ObVEZxUDlc",
    brand: "Sol. by Lumière", price: 18.0, countInStock: 120, rating: 4.7, numReviews: 76, isFeatured: false,
  },
  {
    name: "Tinted Mineral Drops SPF 30",
    categoryName: "Suncare",
    description: "Lightweight mineral protection with a sheer, dewy tint.",
    richDescription: "Skip the foundation. These drops provide robust sun protection while giving your skin a flawless, even coverage.",
    image: "https://unsplash.com/fr/photos/une-bouteille-de-creme-solaire-posee-sur-une-serviette-hQSGWjz6-QY",
    brand: "Sol. by Lumière", price: 45.0, countInStock: 95, rating: 4.9, numReviews: 112, isFeatured: true,
  },
  {
    name: "UV Defense Lip Balm",
    categoryName: "Suncare",
    description: "Nourishing lip hydration with SPF 15.",
    richDescription: "Don't forget your lips! This clear balm protects against harsh rays while deeply moisturizing with beeswax and vitamin E.",
    image: "https://images.unsplash.com/photo-1616949755609-b68df9f99e8a",
    brand: "Sol. by Lumière", price: 12.0, countInStock: 200, rating: 4.6, numReviews: 400, isFeatured: false,
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.CONNECTION_STRING || "mongodb://localhost:27017/eshop-database");
    console.log("Connected successfully!");

    // Clear existing data 
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("Cleared old products & categories.");

    // Create Categories
    console.log("Adding categories...");
    const createdCategories = await Category.insertMany(beautyCategories);

    // Assign mapped categories to products and insert
    const productsWithCategories = beautyProducts.map(p => {
      const categoryId = createdCategories.find(c => c.name === p.categoryName)._id;
      const { categoryName, ...productData } = p;
      return {
        ...productData,
        category: categoryId
      };
    });

    console.log("Adding mapped products...");
    await Product.insertMany(productsWithCategories);

    console.log("Database perfectly seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();

/**
 * Seed try-on images for existing products
 * Creates transparent PNG overlays for AR try-on functionality
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Sample try-on image URLs (in production, these would be uploaded transparent PNG files)
const sampleTryOnImages = [
  "https://picsum.photos/seed/sherwani1/400/600.png",
  "https://picsum.photos/seed/sherwani2/400/600.png", 
  "https://picsum.photos/seed/coat1/400/600.png",
  "https://picsum.photos/seed/coat2/400/600.png",
  "https://picsum.photos/seed/shalwar1/400/600.png",
  "https://picsum.photos/seed/shalwar2/400/600.png",
  "https://picsum.photos/seed/kameez1/400/600.png",
  "https://picsum.photos/seed/kameez2/400/600.png",
  "https://picsum.photos/seed/outfit1/400/600.png",
  "https://picsum.photos/seed/outfit2/400/600.png",
];

async function seedTryOnImages() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  
  try {
    // Get products without try-on images
    const products = await Product.find({ tryOnImage: { $exists: false } }).limit(50);
    
    console.log(`Found ${products.length} products without try-on images`);
    
    let updatedCount = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Assign try-on image based on category
      let tryOnImage;
      const category = product.category?.toLowerCase();
      
      if (category?.includes('women') || category?.includes('girls')) {
        tryOnImage = sampleTryOnImages[0]; // Sherwani style
      } else if (category?.includes('men') || category?.includes('boys')) {
        if (category?.includes('suit')) {
          tryOnImage = sampleTryOnImages[2]; // Coat style
        } else {
          tryOnImage = sampleTryOnImages[6]; // Shalwar kameez
        }
      } else {
        // Default assignment
        tryOnImage = sampleTryOnImages[i % sampleTryOnImages.length];
      }
      
      try {
        await Product.findByIdAndUpdate(product._id, { 
          tryOnImage: tryOnImage 
        });
        console.log(`✓ Updated: ${product.title} -> ${tryOnImage}`);
        updatedCount++;
      } catch (error) {
        console.error(`✗ Failed to update ${product.title}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully added try-on images to ${updatedCount} products!`);
    
    // Show summary
    const updatedProducts = await Product.find({ tryOnImage: { $exists: true } });
    console.log(`\nTotal products with try-on images: ${updatedProducts.length}`);
    
  } catch (error) {
    console.error("Error seeding try-on images:", error);
  }
  
  await mongoose.disconnect();
  process.exit(0);
}

seedTryOnImages().catch((err) => {
  console.error(err);
  process.exit(1);
});

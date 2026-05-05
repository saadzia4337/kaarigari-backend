require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mongoose = require("mongoose");
const Product = require("../models/Product");

async function checkTryOnImages() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  
  try {
    const products = await Product.find({}).limit(10);
    console.log(`Found ${products.length} products:\n`);
    
    products.forEach((product, i) => {
      console.log(`${i + 1}. ${product.title}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   tryOnImage: ${product.tryOnImage || 'MISSING'}`);
      console.log(`   Price: Rs. ${product.price}`);
      console.log('');
    });
    
    const withTryOn = await Product.countDocuments({ tryOnImage: { $exists: true, $ne: null } });
    const total = await Product.countDocuments();
    
    console.log(`\nSummary:`);
    console.log(`Products with tryOnImage: ${withTryOn}/${total}`);
    console.log(`Products without tryOnImage: ${total - withTryOn}/${total}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
  
  await mongoose.disconnect();
  process.exit(0);
}

checkTryOnImages().catch((err) => {
  console.error(err);
  process.exit(1);
});

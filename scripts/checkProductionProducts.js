const mongoose = require("mongoose");
const Product = require("../models/Product");

async function checkProductionProducts() {
  const MONGO_URI = "mongodb+srv://saadzia911:WIUj9WZsfO6Bor1m@cluster0.vcyiequ.mongodb.net/";
  
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB Atlas");
  
  try {
    const products = await Product.find({}).limit(10);
    console.log(`Found ${products.length} products in production:\n`);
    
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
    
    if (withTryOn === 0) {
      console.log(`\n⚠️  No products have tryOnImage!`);
      console.log(`You need to run the seedTryOnImages script to add try-on images.`);
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
  
  await mongoose.disconnect();
  process.exit(0);
}

checkProductionProducts().catch((err) => {
  console.error(err);
  process.exit(1);
});

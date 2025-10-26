const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Small Stitch T-Shirt',
    category: 'T-Shirts',
    description: 'Cute small Stitch character t-shirt in colorful options',
    price: 999.90,
    stock: 10,
    design: 'smallstitch',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Baby Rose White', value: 'babyrosewhite', hex: '#FFE4E1' },
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'Blue', value: 'blue', hex: '#0000FF' },
      { name: 'Dark Blue', value: 'darkblue', hex: '#00008B' },
      { name: 'Green & Blue', value: 'greenandblue', hex: '#87CEEB' },
      { name: 'Light Blue', value: 'lightblue', hex: '#ADD8E6' },
      { name: 'Light Green', value: 'lightgreen', hex: '#90EE90' },
      { name: 'Light Purple', value: 'lightpurple', hex: '#DDA0DD' },
      { name: 'Light Pink', value: 'lightpink', hex: '#FFB6C1' },
      { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
      { name: 'Red', value: 'red', hex: '#FF0000' },
      { name: 'White', value: 'white', hex: '#FFFFFF' },
      { name: 'Yellow', value: 'yellow', hex: '#FFD700' }
    ],
    defaultColor: 'blue',
    imageFolder: 'small stitch'
  },
  {
    name: 'Tweety T-Shirt',
    category: 'T-Shirts',
    description: 'Cute Tweety character t-shirt available in multiple colors',
    price: 999.90,
    stock: 10,
    design: 'tweety',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'Blue', value: 'blue', hex: '#0000FF' },
      { name: 'Light Blue', value: 'lightblue', hex: '#87CEEB' },
      { name: 'Light Pink', value: 'lightpink', hex: '#FFB6C1' },
      { name: 'Light Green', value: 'lightgreen', hex: '#90EE90' },
      { name: 'Light Purple', value: 'lightpurple', hex: '#DDA0DD' },
      { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
      { name: 'Red', value: 'red', hex: '#FF0000' },
      { name: 'White', value: 'white', hex: '#FFFFFF' },
      { name: 'Yellow', value: 'yellow', hex: '#FFD700' }
    ],
    defaultColor: 'black',
    imageFolder: 'Tweety'
  },
  {
    name: 'Daisy Duck T-Shirt',
    category: 'T-Shirts',
    description: 'Adorable Daisy Duck character t-shirt in vibrant colors',
    price: 999.90,
    stock: 10,
    design: 'daisy',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Blue', value: 'blue', hex: '#0000FF' },
      { name: 'Light Purple', value: 'lightpurple', hex: '#DDA0DD' },
      { name: 'Light Pink', value: 'lightpink', hex: '#FFB6C1' },
      { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
      { name: 'Red', value: 'red', hex: '#FF0000' },
      { name: 'Yellow', value: 'yellow', hex: '#FFD700' }
    ],
    defaultColor: 'blue',
    imageFolder: 'Daisy Duck'
  },
  {
    name: 'Kittens T-Shirt',
    category: 'T-Shirts',
    description: 'Cute kittens character t-shirt in lovely colors',
    price: 999.90,
    stock: 10,
    design: 'kittens',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Light Blue & Green', value: 'lightbluegreen', hex: '#87CEEB' },
      { name: 'Light Blue', value: 'lightblue', hex: '#ADD8E6' },
      { name: 'Light Green', value: 'lightgreen', hex: '#90EE90' },
      { name: 'Light Purple', value: 'lightpurple', hex: '#DDA0DD' },
      { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
      { name: 'Red', value: 'red', hex: '#FF0000' },
      { name: 'White Cream', value: 'whitecream', hex: '#FFFDD0' },
      { name: 'Yellow', value: 'yellow', hex: '#FFD700' }
    ],
    defaultColor: 'lightbluegreen',
    imageFolder: 'kittens'
  },
  {
    name: 'Panda T-Shirt',
    category: 'T-Shirts',
    description: 'Adorable panda character t-shirt in classic colors',
    price: 999.90,
    stock: 10,
    design: 'panda',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'Blue', value: 'blue', hex: '#0000FF' },
      { name: 'Red', value: 'red', hex: '#FF0000' },
      { name: 'Yellow', value: 'yellow', hex: '#FFD700' }
    ],
    defaultColor: 'black',
    imageFolder: 'panda'
  },
  {
    name: 'Stitch T-Shirt',
    category: 'T-Shirts',
    description: 'Adorable Stitch character t-shirt in vibrant color options',
    price: 999.90,
    stock: 10,
    design: 'stitch',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Baby Rose', value: 'babyrose', hex: '#FFB6C1' },
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'Blue', value: 'blue', hex: '#0000FF' },
      { name: 'Green', value: 'green', hex: '#008000' },
      { name: 'Light Blue', value: 'lightblue', hex: '#ADD8E6' },
      { name: 'Light Green', value: 'lightgreen', hex: '#90EE90' },
      { name: 'Light Purple', value: 'lightpurple', hex: '#DDA0DD' },
      { name: 'Maroon', value: 'maroon', hex: '#800000' },
      { name: 'Navy Blue', value: 'navyblue', hex: '#000080' },
      { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
      { name: 'Red', value: 'red', hex: '#FF0000' },
      { name: 'White', value: 'white', hex: '#FFFFFF' },
      { name: 'Yellow', value: 'yellow', hex: '#FFD700' }
    ],
    defaultColor: 'blue',
    imageFolder: 'stitch'
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully added ${insertedProducts.length} products to the database!`);
    
    // Display summary
    insertedProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   - Colors: ${product.colors.length}`);
      console.log(`   - Sizes: ${product.sizes.join(', ')}`);
      console.log(`   - Stock: ${product.stock}`);
      console.log(`   - Price: Rs.${product.price}`);
    });

    console.log('\n✅ All products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

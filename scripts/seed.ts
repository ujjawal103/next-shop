import { connectDB } from "../lib/db";
import Product from "../lib/models/Product";

const products = [
  {
    name: "iPhone 17",
    slug: "iphone-17",
    price: 79999,
    description: "Latest iPhone model.",
  },
  {
    name: "MacBook Air",
    slug: "macbook-air",
    price: 99999,
    description: "Lightweight Apple laptop.",
  },
  {
    name: "Samsung S26",
    slug: "samsung-s26",
    price: 69999,
    description: "Flagship Samsung smartphone.",
  },
];

async function seed() {
  try {
    await connectDB();

    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log("Products seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();







// to run this file, use the following command in your terminal:
// node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/seed.ts
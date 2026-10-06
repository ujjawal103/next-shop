import mongoose, { Schema, Model } from "mongoose";

export type ProductDocument = {
  name: string;
  slug: string;
  price: number;
  description: string;
};

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
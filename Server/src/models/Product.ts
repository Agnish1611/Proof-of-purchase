import mongoose, { Schema } from 'mongoose';

import { Product as ProductType } from '../types';

const productSchema = new Schema<ProductType>(
  {
    name: {
      type: String,
      required: [true, 'ProductName is required'],
    },
    category: {
        type: String,
        required: [true, 'category is required'],
      },
    brand: {
    type: String,
    required: [true, 'brand is required'],
    },
    sku: {
        type: String,
        required: [true, 'sky is required'],
    },
    has_warranty: {
        type: Boolean,
        required: [true, 'has_warranty is required'],
    },
    warranty_days: {
        type : Number,
        required: [true, 'warranty_days is required'],
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        // TS2790 fix: Only delete if property exists and is not required
        if (Object.prototype.hasOwnProperty.call(ret, 'password')) {
          delete (ret as { password?: string }).password;
        }
        return ret;
      }
    }
  }
);

export const ProductModel = mongoose.model<ProductType>('Product', productSchema);
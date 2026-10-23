import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Asset owner is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Asset title is required"],
      trim: true,
      minlength: [2, "Asset title must be at least 2 characters long"],
      maxlength: [100, "Asset title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    assetType: {
      type: String,
      enum: [
        "DOCUMENT",
        "FINANCIAL",
        "CRYPTO",
        "SOCIAL_MEDIA",
        "EMAIL",
        "SUBSCRIPTION",
        "OTHER",
      ],
      required: [true, "Asset type is required"],
    },

    metadata: {
      type: Map,
      of: String,
      default: {},
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

assetSchema.index({ ownerId: 1, status: 1, createdAt: -1 });

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;

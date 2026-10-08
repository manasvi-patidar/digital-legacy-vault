import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      index: true,
    },

    guardianUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Guardian user is required"],
      index: true,
    },

    relationship: {
      type: String,
      required: [true, "Relationship is required"],
      trim: true,
      maxlength: [50, "Relationship cannot exceed 50 characters"],
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECTED", "REVOKED"],
      default: "PENDING",
      index: true,
    },

    permissions: {
      type: [
        {
          type: String,
          enum: ["VIEW_VAULT", "RECEIVE_RELEASE", "VERIFY_EMERGENCY"],
        },
      ],
      default: [],
    },

    invitedAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

guardianSchema.index({ ownerId: 1, guardianUserId: 1 }, { unique: true });

guardianSchema.pre("validate", function () {
  if (
    this.ownerId &&
    this.guardianUserId &&
    this.ownerId.equals(this.guardianUserId)
  ) {
    throw new Error("A user cannot be their own guardian");
  }
});

const Guardian = mongoose.model("Guardian", guardianSchema);

export default Guardian;

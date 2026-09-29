import User from "../users/user.model.js";
import Guardian from "./guardian.model.js";

export const addGuardian = async (req, res) => {
  try {
    const { email, relationship, permissions = [] } = req.body;

    const owner = await User.findById(req.user.userId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const guardianUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!guardianUser) {
      return res.status(404).json({
        success: false,
        message: "Guardian user not found",
      });
    }

    if (owner._id.equals(guardianUser._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as a guardian",
      });
    }

    if (guardianUser.accountStatus !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Guardian account is not active",
      });
    }

    const existingGuardian = await Guardian.findOne({
      ownerId: owner._id,
      guardianUserId: guardianUser._id,
    });

    if (existingGuardian) {
      return res.status(409).json({
        success: false,
        message: "This user is already associated as a guardian",
      });
    }

    const guardian = await Guardian.create({
      ownerId: owner._id,
      guardianUserId: guardianUser._id,
      relationship: relationship.trim(),
      permissions,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Guardian invitation created successfully",
      guardian: {
        id: guardian._id,
        ownerId: guardian.ownerId,
        guardianUserId: guardian.guardianUserId,
        guardian: {
          id: guardianUser._id,
          name: guardianUser.name,
          email: guardianUser.email,
        },
        relationship: guardian.relationship,
        status: guardian.status,
        permissions: guardian.permissions,
        invitedAt: guardian.invitedAt,
        acceptedAt: guardian.acceptedAt,
        revokedAt: guardian.revokedAt,
        createdAt: guardian.createdAt,
        updatedAt: guardian.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This user is already associated as a guardian",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Add guardian error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding guardian",
    });
  }
};

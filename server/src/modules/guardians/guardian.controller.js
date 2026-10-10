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

export const acceptGuardianInvitation = async (req, res) => {
  try {
    const guardian = await Guardian.findOne({
      _id: req.params.guardianId,
      guardianUserId: req.user.userId,
    });

    if (!guardian) {
      return res.status(404).json({
        success: false,
        message: "Guardian invitation not found",
      });
    }

    if (guardian.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: `Guardian invitation cannot be accepted because its current status is ${guardian.status}`,
      });
    }

    const guardianUser = await User.findById(req.user.userId).select(
      "name email accountStatus",
    );

    if (!guardianUser) {
      return res.status(404).json({
        success: false,
        message: "Guardian account not found",
      });
    }

    if (guardianUser.accountStatus !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active",
      });
    }

    guardian.status = "ACTIVE";
    guardian.acceptedAt = new Date();

    await guardian.save();

    return res.status(200).json({
      success: true,
      message: "Guardian invitation accepted successfully",
      guardian: {
        id: guardian._id,
        ownerId: guardian.ownerId,
        guardianUserId: guardian.guardianUserId,
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
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid guardian invitation ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Accept guardian invitation error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while accepting guardian invitation",
    });
  }
};

export const getGuardians = async (req, res) => {
  try {
    const userId = req.user.userId;

    const guardians = await Guardian.find({
      $or: [{ ownerId: userId }, { guardianUserId: userId }],
    })
      .populate("ownerId", "name email accountStatus")
      .populate("guardianUserId", "name email accountStatus")
      .sort({ createdAt: -1 })
      .lean();

    const formattedGuardians = guardians.map((guardian) => ({
      id: guardian._id,
      relationship: guardian.relationship,
      status: guardian.status,
      permissions: guardian.permissions,
      invitedAt: guardian.invitedAt,
      acceptedAt: guardian.acceptedAt,
      revokedAt: guardian.revokedAt,
      createdAt: guardian.createdAt,
      updatedAt: guardian.updatedAt,

      owner: guardian.ownerId
        ? {
            id: guardian.ownerId._id,
            name: guardian.ownerId.name,
            email: guardian.ownerId.email,
            accountStatus: guardian.ownerId.accountStatus,
          }
        : null,

      guardian: guardian.guardianUserId
        ? {
            id: guardian.guardianUserId._id,
            name: guardian.guardianUserId.name,
            email: guardian.guardianUserId.email,
            accountStatus: guardian.guardianUserId.accountStatus,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      count: formattedGuardians.length,
      guardians: formattedGuardians,
    });
  } catch (error) {
    console.error("Get guardians error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching guardians",
    });
  }
};

export const revokeGuardian = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { guardianId } = req.params;

    const guardian = await Guardian.findOne({
      _id: guardianId,
      ownerId: userId,
    });

    if (!guardian) {
      return res.status(404).json({
        success: false,
        message: "Guardian relationship not found",
      });
    }

    if (guardian.status === "REVOKED") {
      return res.status(400).json({
        success: false,
        message: "Guardian relationship is already revoked",
      });
    }

    guardian.status = "REVOKED";
    guardian.revokedAt = new Date();

    await guardian.save();

    return res.status(200).json({
      success: true,
      message: "Guardian relationship revoked successfully",
      guardian: {
        id: guardian._id,
        status: guardian.status,
        revokedAt: guardian.revokedAt,
      },
    });
  } catch (error) {
    console.error("Revoke guardian error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while revoking guardian",
    });
  }
};

export const updateGuardianPermissions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { guardianId } = req.params;
    const { permissions } = req.body;

    const allowedPermissions = [
      "VIEW_VAULT",
      "RECEIVE_RELEASE",
      "VERIFY_EMERGENCY",
    ];

    // Validate permission input
    if (
      !Array.isArray(permissions) ||
      !permissions.every((permission) =>
        allowedPermissions.includes(permission),
      ) ||
      new Set(permissions).size !== permissions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be an array of unique valid permissions",
      });
    }

    // Find owner's relationship
    const guardian = await Guardian.findOne({
      _id: guardianId,
      ownerId: userId,
    });

    if (!guardian) {
      return res.status(404).json({
        success: false,
        message: "Guardian relationship not found",
      });
    }

    if (["REVOKED", "REJECTED"].includes(guardian.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot update permissions for a revoked or rejected guardian",
      });
    }

    guardian.permissions = permissions;

    await guardian.save();

    return res.status(200).json({
      success: true,
      message: "Guardian permissions updated successfully",
      guardian: {
        id: guardian._id,
        status: guardian.status,
        permissions: guardian.permissions,
        updatedAt: guardian.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update guardian permissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating guardian permissions",
    });
  }
};

export const cancelGuardianInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { guardianId } = req.params;

    const guardian = await Guardian.findOne({
      _id: guardianId,
      ownerId: userId,
    });

    if (!guardian) {
      return res.status(404).json({
        success: false,
        message: "Guardian relationship not found",
      });
    }

    if (guardian.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending invitations can be cancelled",
      });
    }

    // Record invitation cancellation
    guardian.status = "CANCELLED";
    guardian.revokedAt = new Date();

    await guardian.save();

    return res.status(200).json({
      success: true,
      message: "Guardian invitation cancelled successfully",
      guardian: {
        id: guardian._id,
        status: guardian.status,
        revokedAt: guardian.revokedAt,
      },
    });
  } catch (error) {
    console.error("Cancel guardian invitation error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while cancelling invitation",
    });
  }
};

export const resendGuardianInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { guardianId } = req.params;

    const guardian = await Guardian.findOne({
      _id: guardianId,
      ownerId: userId,
    });

    if (!guardian) {
      return res.status(404).json({
        success: false,
        message: "Guardian relationship not found",
      });
    }

    if (guardian.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending invitations can be resent",
      });
    }

    // Refresh invitation timestamp
    guardian.invitedAt = new Date();

    await guardian.save();

    return res.status(200).json({
      success: true,
      message: "Guardian invitation updated successfully",
      guardian: {
        id: guardian._id,
        status: guardian.status,
        invitedAt: guardian.invitedAt,
      },
    });
  } catch (error) {
    console.error("Resend guardian invitation error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while resending invitation",
    });
  }
};

export const rejectGuardianInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { guardianId } = req.params;

    // Find recipient's invitation
    const guardian = await Guardian.findOne({
      _id: guardianId,
      guardianUserId: userId,
    });

    if (!guardian) {
      return res.status(404).json({
        success: false,
        message: "Guardian invitation not found",
      });
    }

    if (guardian.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending invitations can be rejected",
      });
    }

    guardian.status = "REJECTED";

    await guardian.save();

    return res.status(200).json({
      success: true,
      message: "Guardian invitation rejected successfully",
      guardian: {
        id: guardian._id,
        status: guardian.status,
        updatedAt: guardian.updatedAt,
      },
    });
  } catch (error) {
    console.error("Reject guardian invitation error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while rejecting invitation",
    });
  }
};

export const getIncomingGuardianInvitations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const invitations = await Guardian.find({
      guardianUserId: userId,
      status: "PENDING",
    })
      .populate("ownerId", "name email")
      .sort({ invitedAt: -1 })
      .lean();

    // Format incoming invitations
    const formattedInvitations = invitations.map((invitation) => ({
      id: invitation._id,
      relationship: invitation.relationship,
      status: invitation.status,
      permissions: invitation.permissions,
      invitedAt: invitation.invitedAt,
      owner: invitation.ownerId
        ? {
            id: invitation.ownerId._id,
            name: invitation.ownerId.name,
            email: invitation.ownerId.email,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      count: formattedInvitations.length,
      invitations: formattedInvitations,
    });
  } catch (error) {
    console.error("Get incoming invitations error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching invitations",
    });
  }
};

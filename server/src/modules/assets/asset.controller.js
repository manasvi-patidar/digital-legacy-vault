import Asset from "./asset.model.js";

export const createAsset = async (req, res) => {
  try {
    const { title, description, assetType, metadata } = req.body;

    const asset = await Asset.create({
      ownerId: req.user.userId,
      title,
      description,
      assetType,
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: "Digital asset created successfully",
      asset: {
        id: asset._id,
        ownerId: asset.ownerId,
        title: asset.title,
        description: asset.description,
        assetType: asset.assetType,
        metadata: Object.fromEntries(asset.metadata),
        status: asset.status,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create asset error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating digital asset",
    });
  }
};

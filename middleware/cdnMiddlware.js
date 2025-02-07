const cloudinary = require("cloudinary");
const asyncHandler = require("express-async-handler");

exports.defaultHomeAsset = asyncHandler(async (req, res, next) => {
  // Configuration
  cloudinary.config({
    cloud_name: "dsksrnmfl",
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });

  const autoCropUrl = cloudinary.url("godzilla_nhi07c", {
    fetch_format: "auto",
    quality: "auto",
    crop: "auto",
    width: 800,
    height: 500,
  });

  //   cloudinary.v2.api.resources(
  //     { type: "upload", prefix: "Carousel", resource_type: "image" },
  //     function (error, result) {
  //       console.log(error, result);
  //     }
  //   );

  res.status(201).json({
    autoCropUrl: autoCropUrl,
  });
});

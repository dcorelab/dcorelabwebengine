const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dcore-lab',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'wmv', 'flv']
  }
});

// Create multer instance
const upload = multer({ storage: storage });

// Upload single file (images)
const uploadSingle = upload.single('file');

// Upload multiple files
const uploadMultiple = upload.array('files', 10);

// Upload video
const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB for videos
}).single('video');

// Helper function to delete Cloudinary resource
const deleteResource = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { type: 'upload', resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Error deleting resource from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
const getOptimizedImageUrl = (url, width, height, crop = 'fill') => {
  if (!url) return null;
  return cloudinary.url(url, {
    width: width,
    height: height,
    crop: crop,
    quality: 'auto',
    fetch_format: 'auto'
  });
};

module.exports = {
  cloudinary,
  upload,
  uploadSingle,
  uploadMultiple,
  uploadVideo,
  deleteResource,
  getOptimizedImageUrl
};

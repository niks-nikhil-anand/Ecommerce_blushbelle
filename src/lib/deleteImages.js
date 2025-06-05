import cloudinary from './cloudinary';

const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from image URL
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?([^\.]+)\./);
    const publicId = matches?.[1];

    if (!publicId) {
      throw new Error('Invalid Cloudinary image URL. Could not extract public_id.');
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

export default deleteImage;

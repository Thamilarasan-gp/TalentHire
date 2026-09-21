import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'jrpuc4bx',
  api_key: process.env.CLOUDINARY_API_KEY || '554883776315955',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'zPaUz2taw5TYvC7e7AUpx96C3bc',
  secure: true,
});

export { cloudinary };

/**
 * Upload a file or base64 buffer to Cloudinary
 */
export async function uploadAsset(
  fileData: string,
  folder: 'resumes' | 'recordings' | 'logos' | 'avatars' = 'resumes'
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(fileData, {
    folder: `thamilarasan_global/${folder}`,
    resource_type: 'auto',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

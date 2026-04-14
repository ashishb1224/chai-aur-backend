import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config({
    path: ['.env.local', '.env'],
    override: true,
}
);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('key:',process.env.CLOUDINARY_API_KEY);


const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        console.log('file uploaded:', response.url);

        // ✅ DELETE after success
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {

        console.log("Cloudinary upload error:", error.message);

        // ✅ SAFE DELETE
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadCloudinary };
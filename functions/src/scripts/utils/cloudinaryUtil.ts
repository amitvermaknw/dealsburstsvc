import { cloudinaryConfig } from '../../../firebaseConfig';
import FormData from "form-data";
import crypto from 'crypto';
import axios from "axios";
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret
});

class CloudinaryUtil {

    async uploadProductImage(payload: any, uploadType: string): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        //public_id: payload.imageInfo.filename ? `${payload.imageInfo.filename}` : undefined,
                        folder: uploadType === 'deals' ? 'product_images' : 'banner_images',
                        upload_preset: cloudinaryConfig.uploadPreset
                    },
                    (error, result) => {
                        if (error) {
                            console.error({ code: 500, success: false, msg: 'Cloudinary upload error:', error: error });
                            resolve({ code: 500, success: false, msg: 'Cloudinary upload error:', error: error });
                        }
                        resolve({ code: 200, success: true, imageUrl: result?.secure_url, msg: 'success' });
                    }
                ).end(payload.imageData);
            })

        } catch (error) {
            if (error instanceof Error)
                return ({ code: 500, msg: `Error while uploading images ${error.message}` })
        }
    };

    async deleteProductImage(imageUrl: string) {
        const imageUrlArr = imageUrl.split("/").reverse();
        const imageName = imageUrlArr[0].split(".");
        const publicId = `${imageUrlArr[1]}/${imageName[0]}`;
        try {
            const result = await cloudinary.v2.uploader.destroy(publicId);
            return result
        } catch (error) {
            return 'Error deleting image';
        }
    };

    async sha256(input: string) {
        // Create a new instance of the TextEncoder interface
        const encoder = new TextEncoder();
        // Convert the input string to a Uint8Array
        const data = encoder.encode(input);

        // Use the SubtleCrypto API to generate the SHA-256 hash
        return crypto.subtle.digest("SHA-256", data)
            .then(hash => {
                // Convert the hash to a hexadecimal string
                let hexString = "";
                const bytes = new Uint8Array(hash);
                for (let i = 0; i < bytes.length; i++) {
                    hexString += bytes[i].toString(16).padStart(2, '0');
                }
                return hexString;
            });
    }
}

export default CloudinaryUtil;
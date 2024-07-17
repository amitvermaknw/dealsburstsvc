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
        // const formData = new FormData();
        // formData.append('file', await compressImage.compress(payload));
        // formData.append('image', payload.imageData, { filename: payload.imageInfo.filename, contentType: payload.imageInfo.mimeType });
        // formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        // formData.append('cloud_name', cloudinaryConfig.cloudName);
        // formData.append('folder', uploadType === 'deals' ? 'product_images' : 'banner_images');

        try {

            return new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        public_id: payload.imageInfo.filename ? `uploads/${payload.imageInfo.filename}` : undefined,
                        folder: uploadType === 'deals' ? 'product_images' : 'banner_images',
                        upload_preset: cloudinaryConfig.uploadPreset
                    },
                    (error, result) => {
                        if (error) {
                            console.error({ code: 500, success: false, msg: 'Cloudinary upload error:', error: error });
                            resolve({ code: 500, success: false, msg: 'Cloudinary upload error:', error: error });
                        }
                        console.log('Cloudinary upload result:', result);
                        resolve({ code: 200, success: true, imageUrl: result?.secure_url, msg: 'success' });
                    }
                ).end(payload.imageData);
            })

        } catch (error) {
            console.log(error)
        }
    };

    async deleteProductImage(imageUrl: string) {
        const imageUrlArr = imageUrl.split("/").reverse();
        const imageName = imageUrlArr[0].split(".");
        const publicId = `${imageUrlArr[1]}/${imageName[0]}`;

        const sig = await this.sha256(`public_id=${publicId}&timestamp=${parseInt((new Date().getTime() / 1000).toFixed(0))}${cloudinaryConfig.api_secret}`);

        const formData = new FormData();
        formData.append('api_key', cloudinaryConfig.api_key);
        // formData.append('folder', 'product_images');
        formData.append('public_id', publicId);
        formData.append('signature', sig);
        formData.append('timestamp', `${parseInt((new Date().getTime() / 1000).toFixed(0))}`);
        try {
            const res = await axios(`${cloudinaryConfig.cloudinaryURL}/${cloudinaryConfig.cloudName}/image/destroy`, {
                method: 'POST',
                data: formData
            })
            return res.data();
        } catch (error) {
            console.log(error)
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
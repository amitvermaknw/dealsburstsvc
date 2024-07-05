import CompressImage from "./compressImage";
import { cloudinaryConfig } from '../../../firebaseConfig';
import FormData from "form-data";
import crypto from 'crypto';
import axios from "axios";

class CloudinaryUtil {
    async uploadProductImage(payload: any, uploadType: string) {

        const compressImage = new CompressImage
        const formData = new FormData();
        formData.append('file', await compressImage.compress(payload.image));
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('cloud_name', cloudinaryConfig.cloudName);
        formData.append('folder', uploadType === 'deals' ? 'product_images' : 'banner_images');
        try {
            const res = await axios(`${cloudinaryConfig.cloudinaryURL}/${cloudinaryConfig.cloudName}/upload`, {
                method: 'POST',
                data: formData
            })
            const data = await res.data();
            if (Object.prototype.hasOwnProperty.call(data, 'error')) {
                return (data.message);
            }
            return data.secure_url
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
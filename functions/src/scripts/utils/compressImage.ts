import Compressor from "compressorjs";
import { Readable } from 'stream';
// import sharp from "sharp";

class CompressImage {
    async compress(file: File | Blob) {
        const compressor: any = await new Compressor(file, { quality: 0.6 })
        return compressor.file;
    }

    bufferToStream(buffer: Buffer) {
        const readable = new Readable();
        readable._read = () => { };
        readable.push(buffer);
        readable.push(null);
        return readable;
    };

    async compressImage(imageBuffer: Buffer): Promise<any> {
        // Convert buffer to stream and then to image (optional)
        const imageStream: any = this.bufferToStream(imageBuffer);

        // Use sharp to process the image if needed (optional)
        // const processedImageBuffer: any = await sharp(imageStream)
        //     .toFormat('jpeg')
        //     .toBuffer();
        console.log("inside compressImange");
        // return new Promise((resolve, reject) => {
        //     new Compressor(imageStream, {
        //         quality: 0.6,
        //         success(result) {
        //             console.log("inside resolve");
        //             resolve(result);
        //         },
        //         error(err) {
        //             console.log("inside reject");
        //             reject(err);
        //         },
        //     });
        // });

        // const compressedImage = await sharp(imageBuffer)
        //     .resize({ width: 800 }) // Example resizing, adjust as needed
        //     .jpeg({ quality: 60 }) // Example compression, adjust as needed
        //     .toBuffer();

        // return compressedImage;
    };
}



export default CompressImage;
import Compressor from "compressorjs";

class CompressImage {
    async compress(file: File | Blob) {
        const compressor: any = await new Compressor(file, { quality: 0.6 })
        return compressor.file;
    }
}

export default CompressImage;
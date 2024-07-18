import Busboy from 'busboy';

class ReadMultipartData {
    getFieldsFromFormData = async (req: any, res: any) => {
        const bb = Busboy({ headers: req.headers });
        const jsonPayload: any = {};
        let imageData: Buffer | null = null;
        let imageInfo: any = null;

        await new Promise((resolve, reject) => {
            bb.once('close', resolve).once('error', reject).on('file', (name, file, info) => {
                const { filename, encoding, mimeType } = info;
                const chunks: Uint8Array[] = [];
                file.on('data', (data) => {
                    if (name === 'image') {
                        chunks.push(data);
                    } else if (name === 'json') {
                        Object.assign(jsonPayload, JSON.parse(data));
                    }
                }).on('close', () => {
                    console.log(`File [${name}] done`);
                });

                file.on('end', () => {
                    imageData = Buffer.concat(chunks);
                    imageInfo = { filename, encoding, mimeType };
                });
            }).end(req.rawBody);

            bb.once('close', resolve).once('error', reject).on('finish', () => {
                resolve({ imageData, jsonPayload, imageInfo });
            });
            req.pipe(bb);
        });

        return { imageData, jsonPayload, imageInfo };
    }
}

export default ReadMultipartData;
import Busboy from 'busboy';

class ReadMultipartData {
    getFieldsFromFormData = async (req: any, res: any) => {
        const bb = Busboy({ headers: req.headers });
        const jsonPayload: any = {};
        let imageData: Buffer | null = null;
        let imageInfo = null;

        await new Promise((resolve, reject) => {
            // bb.once('close', resolve).once('error', reject).on('file', (name, file_stream, info) => {
            //     file_stream.resume();
            //     console.dir({ name, file_stream, info }, { depth: null });
            // }).end(req.rawBody);

            bb.once('close', resolve).once('error', reject).on('file', (name, file, info) => {
                const { filename, encoding, mimeType } = info;
                // console.log(
                //     `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
                //     filename,
                //     encoding,
                //     mimeType
                // );
                const chunks: Uint8Array[] = [];

                file.on('data', (data) => {
                    console.log(`File [${name}] got ${data.length} bytes`);
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
                console.log("imageData", imageData);
                console.log("result", jsonPayload);
                resolve({ imageData, jsonPayload });
            });

            // bb.once('close', resolve).once('error', reject).on('field', (name, file, info) => {
            //     console.log("name", name)
            //     console.log("file", file)
            //     console.log("info", info)

            //     //results[fieldname] = val;
            // }).end(req.rawBody);

            // bb.once('close', resolve).once('error', reject).on('field', (name, val, info) => {
            //     console.log(`Field [${name}]: value: %j`, val);
            // }).end(req.rawBody);

            // bb.once('close', resolve).once('error', reject).on('close', () => {
            //     console.log('Done parsing form!');
            //     // res.writeHead(303, { Connection: 'close', Location: '/' });
            //     // res.end();
            // }).end(req.rawBody);
            req.pipe(bb);

        });

        return { imageData, jsonPayload };
    }
}

export default ReadMultipartData;
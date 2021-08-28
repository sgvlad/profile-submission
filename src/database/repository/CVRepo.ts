import * as fs from 'fs';

/**
 * Persistence layer for CVs.
 */
export default class CVRepo
{
    public static async getCV(cvName: any): Promise<Buffer | void>
    {
        const fsPromises = fs.promises;
        return await fsPromises.readFile(`./uploads/${cvName}`)
            .catch((err) => console.error('Failed to read file:', err));
    }
}

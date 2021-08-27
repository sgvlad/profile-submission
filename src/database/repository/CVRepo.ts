import * as fs from 'fs';

export default class CVRepo
{
    public static async getCV(): Promise<Buffer | void>
    {
        const fsPromises= fs.promises;
        return await fsPromises.readFile('./uploads/aem_t-roc_BH-TAB_016_622_J-0000000002_2020-07-02.pdf')
            .catch((err) => console.error('Failed to read file:', err));
    }
}

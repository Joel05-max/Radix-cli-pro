import fs from 'fs/promises';
import path from 'path';
export const CONFIG_FILE_NAME = 'radix.json';
export async function writeRadixConfig(config, targetDir = '.') {
    const filePath = path.resolve(targetDir, CONFIG_FILE_NAME);
    const jsonContent = JSON.stringify(config, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf-8');
    return filePath;
}
export async function configExists(targetDir = '.') {
    const filePath = path.resolve(targetDir, CONFIG_FILE_NAME);
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}

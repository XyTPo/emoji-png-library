const path = require('path');
const fs = require('fs').promises;

const renameFiles = async (folderPath) => {
    try {
        const files = await fs.readdir(folderPath);

        for (const file of files) {
            const fileInfo = path.parse(file);

            const newName = fileInfo.name.trim().toLowerCase().replace(/ /g,"_")

            const oldPath = path.join(__dirname, folderPath, file);
            const newPath = path.join(__dirname, folderPath, `${newName}${fileInfo.ext}`);

            await fs.rename(oldPath, newPath);
        }
    } catch (error) {
        // Handle error here
        console.log(error);
    }
};

renameFiles('./assets/symbols');
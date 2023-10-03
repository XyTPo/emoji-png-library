const path = require('path');
const emojiSuggestionData = require('./global-emoji-data-arr.json');
const fs = require('fs').promises;

const renameFiles = async (folderPath) => {
    try {
        const files = await fs.readdir(folderPath);

        const categoryData = []

        for (const file of files) {
            const fileInfo = path.parse(file);

            const fileName = (fileInfo?.name || '').trim().toLowerCase().replace(/ /g,"_");
            const fileNameKey = fileName !== 'medium_dark_skin_tone' ? fileName.replace('_dark_skin_tone', '') : fileName;

            const targetData = emojiSuggestionData.find(i => i[0] === fileNameKey);

            const colorSubstrings = ["_medium_skin_tone","_light_skin_tone","_medium_dark_skin_tone","_medium_light_skin_tone","_no_skin_tone"]

            if (targetData) {

                categoryData.push({
                    key: fileName,
                    path: 'Smileys people/'+fileInfo.name + fileInfo.ext,
                    categoryKey: 'smileys-people',
                    suggestions: targetData
                })
            } else if (colorSubstrings.some(v => fileName.includes(v))) {
                categoryData.push({
                    key: fileName,
                    path: 'Smileys people/'+fileInfo.name + fileInfo.ext,
                    categoryKey: 'smileys-people',
                    suggestions: []
                })
                //console.log('color: '+fileName)
            } else {
                console.log(fileName)
            }
         

            
            // const fileCleanName = fileName.replace(/_dark_skin_tone|_medium_skin_tone|_light_skin_tone|_medium_dark_skin_tone|_medium_light_skin_tone|_no_skin_tone/gi, '');

            // const suggestionData = emojiSuggestionData[fileCleanName];

            // if (!suggestionData) {
            //     console.log(fileCleanName + ' - ' + fileName)
            // }

            // categoryData.push({
            //     path: `${fileName}${fileInfo.ext}`,
            //     suggestionKey: fileCleanName,
            //     suggestionData: suggestionData || [],
            // })

            //const keyWordsData = emojiDataArr.find(i => fileNameSpaced.includes(i[1][0]));

            //console.log(fileNameSpaced, keyWordsData);

            // const newName = fileInfo.name.trim().toLowerCase().replace(/ /g,"_")

            // const oldPath = path.join(__dirname, folderPath, file);
            // const newPath = path.join(__dirname, folderPath, `${newName}${fileInfo.ext}`);

            // await fs.rename(oldPath, newPath);
        }

        fs.writeFile('./_smileys-people.json', JSON.stringify(categoryData, null, 2) , 'utf-8');
    } catch (error) {
        // Handle error here
        console.log(error);
    }
};

renameFiles('./All_Emojis/Smileys people');
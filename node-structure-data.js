const path = require("path");
const fs = require("fs").promises;

const { emojiData } = require("./pages/src/emoji-data.js");
const skinToneIcons = require("./data/skin-tone-icons.json");

const { icons } = emojiData;

const init = async () => {
  const skinToneIconsFull = [...skinToneIcons];
  try {
    const iconKeys = icons.map((icon) => icon.key);
    const skinToneToneIconKeys = [];

    skinToneIcons.forEach((skinToneIcon) => {
      const key = skinToneIcon.key;
      skinToneToneIconKeys.push(key);
      if (skinToneIcon.skin_tone_support) {
        skinToneToneIconKeys.push(
          key + "_light_skin_tone",
          key + "_dark_skin_tone",
          key + "_medium_skin_tone",
          key + "_medium_light_skin_tone",
          key + "_medium_dark_skin_tone"
        );
      }
    });

    iconKeys.forEach((iconKey) => {
      if (!skinToneToneIconKeys.includes(iconKey)) {
        const targetIcon = icons.find((icon) => icon.key === iconKey);
        skinToneIconsFull.push(targetIcon);
      }
    });

    fs.writeFile(
      "./data/skin-tone-icons-full.json",
      JSON.stringify(skinToneIconsFull, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.log(error);
  }
};

init();

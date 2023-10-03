const path = require("path");
const fs = require("fs").promises;

const smileysPeople = require("./All_Emojis/Smileys people/_smileys-people.json");
const animalsNature = require("./All_Emojis/Animals Neture/_animals-nature.json");
const foodDrinks = require("./All_Emojis/Food Drink/_food-drink.json");
const activity = require("./All_Emojis/Activity/_activity.json");
const travelPlaces = require("./All_Emojis/Travel Places/_travel-places.json");
const objects = require("./All_Emojis/Objects/_objects.json");
const symbols = require("./All_Emojis/Symbols/_symbols.json");
const flags = require("./All_Emojis/Flags/_flags.json");

const allCategories = [
  ...smileysPeople,
  ...animalsNature,
  ...foodDrinks,
  ...activity,
  ...travelPlaces,
  ...objects,
  ...symbols,
  ...flags,
];

const init = async () => {
  try {
    const iconsArr = [];

    allCategories.forEach((icon) => {
      iconsArr.push({
        key: icon.key,
        category: icon.categoryKey,
        path: "./All_Emojis/" + icon.path,
        suggestions: icon.suggestions || [],
      });
    });

    fs.writeFile(
      "./data/icons.json",
      JSON.stringify(iconsArr, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.log(error);
  }
};

init();

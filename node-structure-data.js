const path = require("path");
const fs = require("fs").promises;

const smileysPeople = require("./assets/All_Emojis/Smileys people/smileys-people.json");
const animalsNature = require("./assets/All_Emojis/Animals Neture/animals-nature.json");
const foodDrinks = require("./assets/All_Emojis/Food Drink/food-drink.json");
const activity = require("./assets/All_Emojis/Activity/activity.json");
const travelPlaces = require("./assets/All_Emojis/Travel Places/travel-places.json");
const objects = require("./assets/All_Emojis/Objects/objects.json");
const symbols = require("./assets/All_Emojis/Symbols/symbols.json");
const flags = require("./assets/All_Emojis/Flags/flags.json");

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
      const suggestions = icon.suggestions || [];

      const fixedSuggestions = suggestions.map((suggestion) =>
        suggestion.replace("_", " ")
      );

      iconsArr.push({
        key: icon.key,
        category: icon.categoryKey,
        path: "./assets/All_Emojis/" + icon.path,
        suggestions: fixedSuggestions,
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

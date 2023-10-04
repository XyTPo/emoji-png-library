const dataSourceMap = [
  {
    key: "smileys-people",
    name: "Smileys & People",
    jsonPath: "../assets/All_Emojis/Smileys people/smileys-people.json",
  },
  {
    key: "animals-nature",
    name: "Animals & Nature",
    jsonPath: "../assets/All_Emojis/Animals Neture/animals-nature.json",
  },
  {
    key: "food-drinks",
    name: "Food & Drink",
    jsonPath: "../assets/All_Emojis/Food Drink/food-drink.json",
  },
  {
    key: "activity",
    name: "Activity",
    jsonPath: "../assets/All_Emojis/Activity/activity.json",
  },
  {
    key: "travel-places",
    name: "Travel & Places",
    jsonPath: "../assets/All_Emojis/Travel Places/travel-places.json",
  },
  {
    key: "objects",
    name: "Objects",
    jsonPath: "../assets/All_Emojis/Objects/objects.json",
  },
  {
    key: "symbols",
    name: "Symbols",
    jsonPath: "../assets/All_Emojis/Symbols/symbols.json",
  },
  {
    key: "flags",
    name: "Flags",
    jsonPath: "../assets/All_Emojis/Flags/flags.json",
  },
];

function getEmojisImgs(categoryJsonPath) {
  const data = fetch(categoryJsonPath)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      console.log("can't find the emoji.json file");
      return false;
    });
  return data;
}

async function addEmojiLibrary(categoryJsonPath) {
  const emojiData = await getEmojisImgs(categoryJsonPath);

  const targetNode = document.querySelector("#target");
  targetNode.innerHTML = "";

  emojiData.forEach(({ key, path, suggestions }, index) => {
    targetNode.insertAdjacentHTML(
      "beforeend",
      `
  <tr>
    <td><img src="../assets/All_Emojis/${path}"</td>
    <td>${key}</td>
    <td>${JSON.stringify(suggestions)}</td>
  </tr>
  `
    );
  });
}

addEmojiLibrary(dataSourceMap[0].jsonPath);

(() => {
  const nav = document.querySelector("#nav");

  dataSourceMap.forEach(({ key, name }, index) => {
    nav.insertAdjacentHTML(
      "beforeend",
      `
      <a href="${key}" class="${index === 0 ? "active" : ""}">
        ${name}
      </a>
      `
    );
  });

  nav.addEventListener("click", (e) => {
    e.preventDefault();

    const targetLink = e.target.closest("a");

    if (targetLink) {
      const links = nav.querySelectorAll("a");

      links.forEach((link) => {
        link.classList.remove("active");
      });

      targetLink.classList.add("active");

      const categoryKey = targetLink.getAttribute("href");

      const targetCategory = dataSourceMap.find(
        (category) => category.key === categoryKey
      );

      addEmojiLibrary(targetCategory.jsonPath);
    }
  });
})();

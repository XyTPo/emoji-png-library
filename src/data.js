const dataSourceMap = [
  {
    key: "smileys-people",
    name: "Smileys & People",
    jsonPath: "All_Emojis/Smileys people/_smileys-people.json",
  },
  {
    key: "animals-nature",
    name: "Animals & Nature",
    jsonPath: "All_Emojis/Animals Neture/_animals-nature.json",
  },
  {
    key: "food-drinks",
    name: "Food & Drink",
    jsonPath: "All_Emojis/Food Drink/_food-drink.json",
  },
  {
    key: "activity",
    name: "Activity",
    jsonPath: "All_Emojis/Activity/_activity.json",
  },
  {
    key: "travel-places",
    name: "Travel & Places",
    jsonPath: "All_Emojis/Travel Places/_travel-places.json",
  },
  {
    key: "objects",
    name: "Objects",
    jsonPath: "All_Emojis/Objects/_objects.json",
  },
  {
    key: "symbols",
    name: "Symbols",
    jsonPath: "All_Emojis/Symbols/_symbols.json",
  },
  { key: "flags", name: "Flags", jsonPath: "All_Emojis/Flags/_flags.json" },
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
    <td><img src="./All_Emojis/${path}"</td>
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

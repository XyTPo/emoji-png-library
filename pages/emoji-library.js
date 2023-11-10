async function addEmojiLibrary() {
  if (!emojiData) return;

  let recentEmojiData = await new Promise((resolve) => {
    setTimeout(() => {
      const storageRecentData = localStorage.getItem("recentEmoji");

      const recentEmojiData = storageRecentData
        ? JSON.parse(storageRecentData)
        : ["alien", "alien_monster"];

      resolve(recentEmojiData);
    }, 200);
  });

  let favoriteEmojiData = await new Promise((resolve, reject) => {
    const storageFavoriteData = localStorage.getItem("favoriteEmoji");

    const recentEmojiData = storageFavoriteData
      ? JSON.parse(storageFavoriteData)
      : [
          "alien",
          "alien_monster",
          "baby_angel",
          "clapping_hands",
          "face_with_tears_of_joy",
          "man_gesturing_no",
          "person_frowning",
          "victory_hand",
        ];

    setTimeout(() => {
      resolve(recentEmojiData);
    }, 200);
  });

  const { categories: iconCategoriesData, icons: iconsData } = emojiData;

  const CLASS_NAME_ACTIVE = "active";
  const CLASS_NAME_HIDDEN = "hidden";

  const parentNode = document.querySelector("#emoji-library");
  const sharedDomElements = {
    searchInput: null,
    searchResults: null,
    fullList: null,
    toneSelector: null,
    contextMenu: null,
  };

  const iconCategoryLabelElements = [];
  const iconCategoryGridElements = [];

  let currentColorTone = "";

  generateDOM();

  parentNode.addEventListener("click", clickEventsHandler);

  sharedDomElements.fullList.addEventListener(
    "contextmenu",
    contextmenuEventsHandler
  );

  let searchDebounceTimeout = null;

  sharedDomElements.searchInput.addEventListener("input", (e) => {
    if (searchDebounceTimeout) window.clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = window.setTimeout(
      ((value) => {
        return () => {
          searchDebounceTimeout = null;
          if (value.trim() === "") {
            clearSearchResults(value);
          } else {
            showSearchResults(value);
          }
        };
      })(e.target.value),
      500
    );
  });

  function appendGridItem(parentNode, iconData, isLazyLoad = false) {
    const path = generatePath(iconData);

    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item-box");
    gridItem.dataset.key = iconData.key;

    const gridItemIcon = document.createElement("img");
    if (isLazyLoad) {
      gridItemIcon.dataset.preload = "";
      gridItemIcon.src = "./img/loader.svg";
    } else {
      gridItemIcon.src = path;
    }

    const gridItemDataInput = document.createElement("input");
    gridItemDataInput.type = "hidden";
    gridItemDataInput.value = path;

    gridItem.append(gridItemIcon, gridItemDataInput);

    if (iconData.skin_tone_support) {
      gridItem.classList.add("skin-tone-support");
    }

    parentNode.append(gridItem);
  }

  function generateDOM() {
    parentNode.insertAdjacentHTML(
      "beforeend",
      `
      <div class="emoji-search">
        <div class="emoji-controls">
          <div class="emoji-search-block">
            <input
              type="text"
              id="emoji-search-input"
              class="emoji-search-input"
            />
          </div>
          <div class="tone-wrapper" id="tone-wrapper">
            <div data-tone="" class="tone-dropdown-trigger"></div>
            <div class="tone-dropdown">
              <div data-tone="" class="tone-dropdown-item active">Default</div>
              <div data-tone="light" class="tone-dropdown-item">Light</div>
              <div data-tone="medium_light" class="tone-dropdown-item">Medium Light</div>
              <div data-tone="medium" class="tone-dropdown-item">Medium</div>
              <div data-tone="medium_dark" class="tone-dropdown-item">Medium Dark</div>
              <div data-tone="dark" class="tone-dropdown-item">Dark</div>
            </div>
          </div>
        </div>
        <div
          id="emoji-search-results"
          class="emoji-search-results styled-scrollbar"
        ></div>
      </div>
      <div id="emoji-full-list" class="container-emoji">
        <div class="swiper">
          <div id="emoji-categories" class="swiper-wrapper"></div>
          <div class="swiper-button swiper-button-prev"></div>
          <div class="swiper-button swiper-button-next"></div>
        </div>
        <div id="emoji-grid" class="data-grid"></div>
      </div>
      <div class="context-menu" id="context-menu"></div>
    `
    );

    sharedDomElements.searchInput = parentNode.querySelector(
      "#emoji-search-input"
    );
    sharedDomElements.searchResults = parentNode.querySelector(
      "#emoji-search-results"
    );
    sharedDomElements.toneSelector = parentNode.querySelector("#tone-wrapper");

    sharedDomElements.fullList = parentNode.querySelector("#emoji-full-list");

    sharedDomElements.contextMenu = parentNode.querySelector("#context-menu");

    const emojiCategoriesNode = parentNode.querySelector("#emoji-categories");
    const emojiGridNode = parentNode.querySelector("#emoji-grid");

    const systemCategories = [
      { key: "recent", name: "Recent", iconKeys: recentEmojiData },
      {
        key: "favorite",
        name: "Favorite",
        iconKeys: favoriteEmojiData,
      },
    ];

    const targetCategories = [...systemCategories, ...iconCategoriesData];

    targetCategories.forEach(
      ({ key: categoryKey, name: categoryName, iconKeys }, categoryIndex) => {
        const iconCategoryLabel = document.createElement("div");

        iconCategoryLabel.classList.add("swiper-slide");

        if (categoryIndex === 0) {
          iconCategoryLabel.classList.add(CLASS_NAME_ACTIVE);
        }

        iconCategoryLabel.dataset.category = categoryKey;
        iconCategoryLabel.textContent = categoryName;
        emojiCategoriesNode.appendChild(iconCategoryLabel);

        iconCategoryLabelElements.push(iconCategoryLabel);

        const categoryIcons = iconKeys
          ? iconKeys.map((key) => iconsData.find((icon) => icon.key === key))
          : iconsData.filter((icon) => icon.category === categoryKey);

        const gridItem = document.createElement("div");
        gridItem.classList.add("data-grid-item", "styled-scrollbar");

        if (categoryIndex === 0) {
          gridItem.classList.add(CLASS_NAME_ACTIVE);
        }

        gridItem.dataset.category = categoryKey;

        categoryIcons.forEach((iconData) => {
          appendGridItem(gridItem, iconData, categoryIndex !== 0);
        });

        emojiGridNode.appendChild(gridItem);

        iconCategoryGridElements.push(gridItem);
      }
    );

    new Swiper(".swiper", {
      slidesPerView: "auto",
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      mousewheel: {
        releaseOnEdges: true,
        sensitivity: 4,
      },
    });
  }

  function generatePath(iconData) {
    let path = "../assets/All_Emojis" + iconData.path;

    if (currentColorTone && iconData?.skin_tones) {
      path = "../assets/All_Emojis" + iconData?.skin_tones[currentColorTone];
    }

    return path;
  }

  function updateColorTone() {
    parentNode
      .querySelectorAll(".grid-item-box.skin-tone-support")
      .forEach((gridItemBox) => {
        const iconKey = gridItemBox.dataset.key;

        const iconData = iconsData.find((icon) => icon.key === iconKey);

        if (iconData) {
          const path = generatePath(iconData);

          gridItemBox.querySelector("input").value = path;
          const img = gridItemBox.querySelector("img");

          if (!img.hasAttribute("data-preload")) {
            img.src = path;
          }
        }
      });
  }

  function handleCategoryChange(targetCategoryNode) {
    iconCategoryLabelElements.forEach((categoryLabelElement) => {
      categoryLabelElement.classList.remove(CLASS_NAME_ACTIVE);
    });

    targetCategoryNode.classList.add(CLASS_NAME_ACTIVE);

    iconCategoryGridElements.forEach((categoryGridElement) => {
      categoryGridElement.classList.remove(CLASS_NAME_ACTIVE);
    });

    const targetCategoryKey = targetCategoryNode.dataset.category;
    const targetDataNode = iconCategoryGridElements.find(
      (gridElement) => gridElement.dataset.category === targetCategoryKey
    );

    targetDataNode.classList.add(CLASS_NAME_ACTIVE);

    targetDataNode.querySelectorAll("img").forEach((img) => {
      if (img.hasAttribute("data-preload")) {
        const path = img.nextElementSibling?.value || "";
        img.src = path;

        delete img.dataset.preload;
      }
    });
  }

  function clickEventsHandler(e) {
    sharedDomElements.contextMenu.style.display = "none";

    if (e.target.closest(".swiper-button")) {
      const arrowClicked = e.target.closest(".swiper-button");

      const activeCategoryNode = iconCategoryLabelElements.find(
        (categoryElement) =>
          categoryElement.classList.contains(CLASS_NAME_ACTIVE)
      );

      if (!activeCategoryNode) {
        return;
      }

      const targetCategoryNode = arrowClicked.classList.contains(
        "swiper-button-prev"
      )
        ? activeCategoryNode.previousElementSibling
        : activeCategoryNode.nextElementSibling;

      if (!targetCategoryNode) {
        return;
      }

      handleCategoryChange(targetCategoryNode);
    }

    if (e.target.closest(".swiper-slide")) {
      const categoryClickedNode = e.target.closest(".swiper-slide");

      if (categoryClickedNode.classList.contains(CLASS_NAME_ACTIVE)) {
        return;
      }

      handleCategoryChange(categoryClickedNode);
    }
    if (e.target.closest(".grid-item-box")) {
      const iconBox = e.target.closest(".grid-item-box");
      const dataInput = iconBox.querySelector("input");
      alert(dataInput.value);

      updateRecentEmojis(iconBox.dataset.key);
    }

    if (e.target.closest(".tone-dropdown-trigger")) {
      sharedDomElements.toneSelector.classList.toggle("dropdown-visible");
    }

    if (e.target.closest(".tone-dropdown-item")) {
      const clickedDropdownItem = e.target.closest(".tone-dropdown-item");

      clickedDropdownItem.parentNode
        .querySelectorAll(".tone-dropdown-item")
        .forEach((item) => {
          item.classList.remove(CLASS_NAME_ACTIVE);
        });

      clickedDropdownItem.classList.add(CLASS_NAME_ACTIVE);

      const targetTone = clickedDropdownItem.dataset.tone;

      sharedDomElements.toneSelector.querySelector(
        ".tone-dropdown-trigger"
      ).dataset.tone = targetTone;

      sharedDomElements.toneSelector.classList.remove("dropdown-visible");

      currentColorTone = targetTone;

      updateColorTone();
    }

    if (!e.target.closest("#tone-wrapper")) {
      sharedDomElements.toneSelector.classList.remove("dropdown-visible");
    }

    if (e.target.closest("#context-menu")) {
      const contextMenu = e.target.closest("#context-menu");
      updateFavoriteEmojis(contextMenu);
    }
  }

  function contextmenuEventsHandler(e) {
    e.preventDefault();
    if (e.target.closest(".grid-item-box")) {
      showContextMenu(e, e.target.closest(".grid-item-box"));
    }
  }

  function updateRecentEmojis(iconKey) {
    const recentEmojiUpdated = recentEmojiData
      .filter((e) => e !== iconKey)
      .slice(0, 19);

    recentEmojiUpdated.unshift(iconKey);

    recentEmojiData = recentEmojiUpdated;

    const recentIconsData = recentEmojiUpdated.map((iconKey) =>
      iconsData.find((i) => i.key === iconKey)
    );

    const gridItem = document.querySelector(
      '.data-grid-item[data-category="recent"]'
    );

    gridItem.innerHTML = "";

    recentIconsData.forEach((recentIconData) => {
      appendGridItem(gridItem, recentIconData);
    });

    localStorage.setItem("recentEmoji", JSON.stringify(recentEmojiUpdated));
  }

  function updateFavoriteEmojis(contextMenu) {
    const action = contextMenu.dataset.action;
    const iconKey = contextMenu.dataset.key;

    const favoriteEmojisUpdated = favoriteEmojiData.filter(
      (e) => e !== iconKey
    );

    if (action === "add") {
      favoriteEmojisUpdated.unshift(iconKey);
    }

    favoriteEmojiData = favoriteEmojisUpdated;

    const favoriteIconsData = favoriteEmojisUpdated.map((iconKey) =>
      iconsData.find((i) => i.key === iconKey)
    );

    const gridItem = document.querySelector(
      '.data-grid-item[data-category="favorite"]'
    );

    gridItem.innerHTML = "";

    favoriteIconsData.forEach((favoriteIconData) => {
      appendGridItem(gridItem, favoriteIconData);
    });

    localStorage.setItem(
      "favoriteEmoji",
      JSON.stringify(favoriteEmojisUpdated)
    );
  }

  function showContextMenu(e, targetEmoji) {
    const emojiKey = targetEmoji.dataset.key;
    const targetCategoryKey =
      targetEmoji.closest(".data-grid-item").dataset.category;

    console.log(emojiKey, targetCategoryKey);
    const isCategoryFavorite = targetCategoryKey === "favorite";

    sharedDomElements.contextMenu.innerText = isCategoryFavorite
      ? "Remove from favorite"
      : "Add to favorite";

    sharedDomElements.contextMenu.dataset.action = isCategoryFavorite
      ? "remove"
      : "add";

    sharedDomElements.contextMenu.dataset.key = emojiKey;
    sharedDomElements.contextMenu.style.display = "block";

    const windowWidth = window.innerWidth;
    const contextMenuWidth = sharedDomElements.contextMenu.offsetWidth;
    const cursorPositionY = e.pageX;

    const yOverlap = cursorPositionY + contextMenuWidth - windowWidth;
    const yCorrection = yOverlap > 0 ? yOverlap : 0;

    sharedDomElements.contextMenu.style.left = e.pageX - yCorrection + "px";
    sharedDomElements.contextMenu.style.top = e.pageY + 5 + "px";
  }

  function showSearchResults(searchTerm = "") {
    const cleanSearchTerm = searchTerm.replace(/[^A-Za-z0-9öäüßÖÄÜ\s]/g, "");

    var rx = new RegExp("^" + cleanSearchTerm, "g");
    var rx2 = new RegExp(cleanSearchTerm, "g");

    const targetIcons = iconsData.filter((icon) => {
      const suggestions = icon.suggestions;

      let found = false;

      for (var s = 0; s < suggestions.length; ++s) {
        if (
          suggestions[s].match(rx) ||
          (searchTerm.length > 4 && suggestions[s].match(rx2))
        ) {
          found = true;
          break;
        }
      }

      return found;
    });

    sharedDomElements.fullList.classList.add(CLASS_NAME_HIDDEN);

    if (targetIcons.length === 0) {
      sharedDomElements.searchResults.innerHTML =
        "<div style='grid-column-start: 1;grid-column-end: -1;color: white'>No results...</div>";
      return;
    }

    sharedDomElements.searchResults.innerHTML = "";

    targetIcons.forEach((iconData) => {
      appendGridItem(sharedDomElements.searchResults, iconData);
    });
  }

  function clearSearchResults() {
    sharedDomElements.searchResults.innerHTML = "";
    sharedDomElements.fullList.classList.remove(CLASS_NAME_HIDDEN);
  }
}

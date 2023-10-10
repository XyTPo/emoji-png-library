function addEmojiLibrary() {
  if (!emojiData) return;

  const { categories: iconCategoriesData, icons: iconsData } = emojiData;

  const CLASS_NAME_ACTIVE = "active";
  const CLASS_NAME_HIDDEN = "hidden";

  const parentNode = document.querySelector("#emoji-library");
  const sharedDomElements = {
    searchInput: null,
    searchResults: null,
    fullList: null,
  };

  const iconCategoryLabelElements = [];
  const iconCategoryGridElements = [];

  generateDOM();

  parentNode.addEventListener("click", (e) => {
    clickEventsHandler(e);
  });

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
    const path = "/assets/All_Emojis" + iconData.path;

    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item-box");

    const gridItemIcon = document.createElement("img");
    if (isLazyLoad) {
      gridItemIcon.dataset.src = path;
      gridItemIcon.src = "./img/loader.svg";
    } else {
      gridItemIcon.src = path;
    }

    const gridItemDataInput = document.createElement("input");
    gridItemDataInput.type = "hidden";
    gridItemDataInput.value = path;

    gridItem.append(gridItemIcon, gridItemDataInput);

    parentNode.append(gridItem);
  }

  function generateDOM() {
    parentNode.insertAdjacentHTML(
      "beforeend",
      `
      <div class="emoji-search">
        <div class="emoji-search-block">
          <input
            type="text"
            id="emoji-search-input"
            class="emoji-search-input"
          />
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
    `
    );

    sharedDomElements.searchInput = parentNode.querySelector(
      "#emoji-search-input"
    );
    sharedDomElements.searchResults = parentNode.querySelector(
      "#emoji-search-results"
    );

    sharedDomElements.fullList = parentNode.querySelector("#emoji-full-list");

    const emojiCategoriesNode = parentNode.querySelector("#emoji-categories");
    const emojiGridNode = parentNode.querySelector("#emoji-grid");

    iconCategoriesData.forEach(
      ({ key: categoryKey, name: categoryName }, categoryIndex) => {
        const iconCategoryLabel = document.createElement("div");

        iconCategoryLabel.classList.add("swiper-slide");

        if (categoryIndex === 0) {
          iconCategoryLabel.classList.add(CLASS_NAME_ACTIVE);
        }

        iconCategoryLabel.dataset.category = categoryKey;
        iconCategoryLabel.textContent = categoryName;
        emojiCategoriesNode.appendChild(iconCategoryLabel);

        iconCategoryLabelElements.push(iconCategoryLabel);

        const categoryIcons = iconsData.filter(
          (icon) => icon.category === categoryKey
        );

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
      const dataSrc = img.dataset.src;

      if (dataSrc) {
        img.src = dataSrc;
        delete img.dataset.src;
      }
    });
  }

  function clickEventsHandler(e) {
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
      const dataInput = e.target
        .closest(".grid-item-box")
        .querySelector("input");
      alert(dataInput.value);
    }
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

      const { key } = iconData;

      const skitToneIcons = iconsData.filter(
        ({ key: searchKey }) =>
          searchKey === key + "_light_skin_tone" ||
          searchKey === key + "_dark_skin_tone"
      );

      if (skitToneIcons.length !== 0) {
        skitToneIcons.forEach((skitToneIconData) => {
          appendGridItem(sharedDomElements.searchResults, skitToneIconData);
        });
      }
    });
  }

  function clearSearchResults() {
    sharedDomElements.searchResults.innerHTML = "";
    sharedDomElements.fullList.classList.remove(CLASS_NAME_HIDDEN);
  }
}

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
    toneSelector: null,
  };

  const iconCategoryLabelElements = [];
  const iconCategoryGridElements = [];

  let currentColorTone = "";

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

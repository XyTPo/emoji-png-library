async function addEmojiLibrary() {
  const emojiData = await getEmojisImgs();

  const { categories, icons } = emojiData;

  const targetNode = document.querySelector("#emoji-slider");

  targetNode.insertAdjacentHTML(
    "beforeend",
    `
  <div class="swiper">
    <div class="swiper-wrapper"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
  <div class="data-grid"></div>
  `
  );

  // Select the element with the class "swiper-wrapper" from the DOM
  const slidesNode = document.querySelector(".swiper-wrapper");
  //data grid
  const dataNode = document.querySelector(".data-grid");

  categories.forEach(({ key: categoryKey, name }, categoryIndex) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.dataset.index = categoryIndex;
    slide.dataset.current = categoryIndex === 0 ? 1 : 0;
    slide.textContent = name;
    slidesNode.appendChild(slide);

    const categoryIcons = icons.filter((icon) => icon.category === categoryKey);

    const gridItem = document.createElement("div");
    gridItem.classList.add("data-grid-item");
    gridItem.dataset.current = categoryIndex === 0 ? 1 : 0;
    gridItem.innerHTML = categoryIcons
      .map(({ path }) => {
        return `<div class="grid-item-box"><img src="${path}" /></div>`;
      })
      .join("");
    dataNode.appendChild(gridItem);
  });

  const swiper = new Swiper(".swiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    mousewheel: {
      releaseOnEdges: true,
      sensitivity: 4,
    },
  });

  const allSlides = targetNode.querySelectorAll(".swiper-slide");
  const allDataItems = targetNode.querySelectorAll(".data-grid-item");

  targetNode.addEventListener("click", (e) => {
    clickEventFunc(e);
  });
  function clickEventFunc(e) {
    if (e.target.closest(".swiper-button-prev")) {
      const categoryClickedNode = targetNode.querySelector(
        ".swiper-slide[data-current='1']"
      );
      const theCurrentIndex = Number(categoryClickedNode.dataset.index) - 1;

      if (theCurrentIndex < 0) return;

      handleCategoryClick(e, theCurrentIndex);
    }

    if (e.target.closest(".swiper-button-next")) {
      const categoryClickedNode = targetNode.querySelector(
        ".swiper-slide[data-current='1']"
      );
      const theCurrentIndex = Number(categoryClickedNode.dataset.index) + 1;

      if (theCurrentIndex > allSlides.length - 1) return;

      handleCategoryClick(e, theCurrentIndex);
    }

    if (e.target.closest(".swiper-slide")) {
      const categoryClickedNode = e.target.closest(".swiper-slide");
      const theCurrentIndex = categoryClickedNode.dataset.index;

      handleCategoryClick(e, theCurrentIndex);
    }
    if (e.target.closest(".grid-item-box")) {
      return;
    }
    function handleCategoryClick(e, currentIndex) {
      const currentSlider = swiper.slides[currentIndex];

      console.log(currentIndex);

      //reset all slides to 0
      allSlides.forEach((slide) => {
        slide.dataset.current = 0;
      });
      //set current slide to 1
      currentSlider.dataset.current = 1;

      //reset all data items to 0
      allDataItems.forEach((dataItem) => {
        dataItem.dataset.current = 0;
      });
      //set current data item to 1
      allDataItems[currentIndex].dataset.current = 1;
    }
  }

  ////////////////////////////

  const searchInput = document.querySelector("#emoji-search-input");
  const searchClearButton = document.querySelector("#emoji-search-clear");
  const searchResults = document.querySelector("#emoji-search-results");

  const showSearchResults = (searchTerm = "") => {
    const cleanSearchTerm = searchTerm.replace(/[^A-Za-z0-9öäüßÖÄÜ\s]/g, "");

    var rx = new RegExp("^" + cleanSearchTerm, "g");
    var rx2 = new RegExp(cleanSearchTerm, "g");

    const targetIcons = icons.filter((icon) => {
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

    if (targetIcons.length === 0) {
      searchResults.innerHTML =
        "<div style='grid-column-start: 1;grid-column-end: -1;'>No results...</div>";
      return;
    }

    searchResults.innerHTML = targetIcons
      .map(({ path }) => {
        return `<div class="grid-item-box"><img src="${path}" /></div>`;
      })
      .join("");
  };
  const clearSearchResults = (value) => {
    searchResults.innerHTML = "";
  };

  let searchDebounce = null;

  searchInput.addEventListener("input", (e) => {
    if (searchDebounce) window.clearTimeout(searchDebounce);
    searchDebounce = window.setTimeout(
      ((value) => {
        return () => {
          searchDebounce = null;
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

  searchClearButton.addEventListener("click", (e) => {
    e.preventDefault();

    clearSearchResults("button click");
    searchInput.value = "";
  });
}

//web version
function getEmojisImgs() {
  const data = fetch("./data/emojiData.json")
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      console.log("can't find the emoji.json file");
      return false;
    });
  return data;
}

addEmojiLibrary();

function Utilities() {
  //load default settings
  sf_hanibal_load();

  const csInterface = new CSInterface();
  const extension_path = csInterface.getSystemPath(SystemPath.EXTENSION);

  // const appName = csInterface.hostEnvironment.appName;
  // alert(`the name of the app is: ${appName}`);

  try {
    const suggstedEmojis = getUserSelectionObj();

    // console.log("resive suggstedEmojis:", suggstedEmojis);
    let suggestedImagesArr = [];

    if (suggstedEmojis) {
      console.log("resive suggstedEmojis:", suggstedEmojis);
      suggestedImagesArr = suggstedEmojis;
    } else {
      console.log("didnt resive suggstedEmojis, using default");
      suggestedImagesArr = [
        extension_path + "/assets/All_Emojis/Travel Places/Derelict House.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Face With Hand Over Mouth.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Money Mouth Face.png",
        extension_path + "/assets/All_Emojis/Smileys people/Exploding Head.png",
        extension_path + "/assets/All_Emojis/Travel Places/Automobile.png",
        extension_path + "/assets/All_Emojis/Travel Places/Dollar Banknote.png",
        extension_path +
          "/assets/All_Emojis/Objects/Magnifying Glass Tilted Right.png",
        extension_path + "/assets/All_Emojis/Smileys people/Thinking Face.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Man Running Dark Skin Tone.png",
        extension_path + "/assets/All_Emojis/Symbols/Heavy Dollar Sign.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Palms Up Together Dark Skin Tone.png",
        extension_path + "/assets/All_Emojis/Objects/Link.png",
        extension_path + "/assets/All_Emojis/Smileys people/Star Struck.png",
        extension_path + "/assets/All_Emojis/Smileys people/Thinking Face.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Cowboy Hat Face.png",
        extension_path + "/assets/All_Emojis/Objects/Money Bag.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Money Mouth Face.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Beaming Face With Smiling Eyes.png",
        extension_path +
          "/assets/All_Emojis/Smileys people/Zipper Mouth Face.png",
        extension_path + "/assets/All_Emojis/Smileys people/Shushing Face.png",
        extension_path + "/assets/All_Emojis/Smileys people/Nerd Face.png",
        extension_path + "/assets/All_Emojis/Smileys people/Star Struck.png",
      ];
    }

    addSuggestedEmojis(suggestedImagesArr);

    $(".TT-btn").on("click", async (e) => {
      e.preventDefault();

      sf_hn_add_TT_layer_guide();
    });

    $(".disclaimer-btn").on("click", async (e) => {
      e.preventDefault();

      sf_hn_add_disclaimer();
    });

    $(".folder-btn").on("click", async (e) => {
      e.preventDefault();

      sf_hn_orgenize_files();
    });

    $(".square-btn").on("click", async (e) => {
      e.preventDefault();

      sf_hn_make_square_version();
    });
  } catch (error) {
    alert("Utilities ERROR: " + error);
    console.log(error);
  }
}

async function addSuggestedEmojis(emojisArr) {
  //loop through suggestedImagesArr create grid-item-box with img tag and append it to the div-suggested-emojis
  // Get the div element to which you want to append the grid items
  const divSuggestedEmojis = document.querySelector(".div-suggested-emojis");

  // console.log(divSuggestedEmojis);

  // Loop through the array of suggestedImagesArr
  emojisArr.forEach((imgSrc, index) => {
    //stup if statement to make it 20 items
    if (index > 19) return;
    // Create the grid item
    const item = document.createElement("div");
    item.classList.add("grid-item-box-suggested");
    // add data-index attribute to the grid item
    item.dataset.index = index;
    item.innerHTML = `<img src="${imgSrc}" />`;
    // Append the grid item to the grid container
    divSuggestedEmojis.appendChild(item);
  });

  divSuggestedEmojis.addEventListener("click", (e) => {
    if (e.target.closest(".grid-item-box-suggested")) {
      const emojiClickedNode = e.target.closest(".grid-item-box-suggested");
      const emojiIndex = emojiClickedNode.dataset.index;

      // alert(emojisArr[emojiIndex]); // Access to emoji Path
      sf_hn_add_emoji_layer_jsx(emojisArr[emojiIndex]);

      //get the img src path from the image in the grid-item-box-suggested
    }
  });
}

//web version
// function getEmojisImgs(){

//   const data = fetch("./src/emoji.json")
//     .then((res) => res.json())
//     .catch((err) => {
//       console.log(err);
//       console.log("can't find the emoji.json file");
//       return false;
//     });
//   return data;
// }

// }

function watchUtils() {
  const pageData = window?.pageData;

  setVideoData();
  setJiraData();

  toastr.options = {
    closeButton: true,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-bottom-left",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "4000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  document
    .querySelector("#watch-main")
    .addEventListener("click", clickHandlers);

  function clickHandlers(e) {
    if (e.target.closest(".link-group-item-copy")) {
      e.preventDefault();

      const clickedElement = e.target.closest(".link-group-item-copy");

      const parentLinkItemId = clickedElement.closest(".link-group-item").id;

      const hrefToCopy = clickedElement.previousElementSibling.href;

      copyTextToClipboard(hrefToCopy);

      toastr.success(
        `${parentLinkItemId.toLocaleUpperCase()} link copied to clipboard`
      );
    }
    if (e.target.closest("a")) {
      e.preventDefault();

      // Add function here to redirect user to URL

      alert("Redirect to " + e.target.closest("a").href);
    }
  }

  function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy", err);
    }

    document.body.removeChild(textArea);
  }

  function setLinkInfo(targetNode, linkData = {}) {
    const dateNode = targetNode.querySelector(".date-info");

    dateNode.innerText = `(Latest Update: ${linkData.time || "null"} | ${
      linkData.date || "null"
    })`;

    const linkNode = targetNode.querySelector("a");
    linkNode.href = linkData.link || "";
    linkNode.innerText = linkData.link || "Link not found...";
  }

  async function setVideoData() {
    let videoData = pageData?.links_obj;

    if (!videoData) {
      //Video data request if missing
      //Must be async to block further actions till data is ready
      //Expected format
      /*
      {
        square: {
          link: "https://drive.google.com/file/d/1cLEeMiS4Min3PB8S3xQNh-2-X9Kr9hb-/view?usp=drivesdk",
          time: "10:30",
          date: "22.09.23",
        },
        vertical_TT: {
          link: "https://drive.google.com/file/d/19ONSFAaVAn0XZJXlBaZsg157Nj8Fb7tJ/view?usp=drivesdk",
          time: "10:30",
          date: "22.09.23",
        },
        vertical: {
          link: "https://drive.google.com/file/d/1rE_zdyx3JT9nHalqRR9Vfb4L0WTVyrvb/view?usp=drivesdk",
          time: "10:30",
          date: "22.09.23",
        },
        vertical_guide: {
          link: "https://drive.google.com/file/d/1A8GIOQaCc_wNPJqTJ-aGLY3e_lBFrlSz/view?usp=drivesdk",
          time: "10:30",
          date: "22.09.23",
        },
      }
      */
    }

    const videoLinksContainer = document.querySelector("#video-links");

    const videoLinkItems =
      videoLinksContainer.querySelectorAll(".link-group-item");

    videoLinkItems.forEach((videoLinkItem) => {
      const videoLinkId = videoLinkItem.id;

      const videoItemData = videoData[videoLinkId];

      if (videoItemData) {
        setLinkInfo(videoLinkItem, videoItemData);
      }
    });

    videoLinksContainer.classList.remove("loading");
  }

  async function setJiraData() {
    let jiraData = pageData?.jira_link;

    if (!jiraData) {
      //Jira task data request if missing
      //Must be async to block further actions till data is ready
      //Expected format
      /*
      {
        link: "https://thescriptfighter.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-7",
        time: "10:30",
        date: "22.09.23",
      }
      */
    }

    const jiraLinkItem = document.querySelector("#jira_link");

    setLinkInfo(jiraLinkItem, jiraData);

    jiraLinkItem.parentElement.classList.remove("loading");
  }
}

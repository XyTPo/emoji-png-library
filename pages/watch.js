function watchUtils(isReInitialized = false) {
  const pageData = window?.pageData;

  //isReInitialized param is for demo only to clean DOM and not to add Event listeners twice
  //parameter and all related conditions should be removed
  if (isReInitialized) {
    //cleanDom() not needed on real page, it will not be reinitialized after load on real use cases
    cleanDom();
  }

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

  if (!isReInitialized) {
    //!isReInitialized condition should be removed, adding click event listeners should be unconditional

    document
      .querySelector("#watch-main")
      .addEventListener("click", clickHandlers);
  }

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
    let videoData = pageData?.videos;

    if (!videoData) {
      videoData = await getFakeVideoData();
    }

    const videoLinksContainer = document.querySelector("#video-links");

    const videoLinkItems =
      videoLinksContainer.querySelectorAll(".link-group-item");

    videoLinkItems.forEach((videoLinkItem) => {
      const videoLinkId = videoLinkItem.id;

      const videoItemData = videoData[videoLinkId];

      setLinkInfo(videoLinkItem, videoItemData);
    });

    videoLinksContainer.classList.remove("loading");
  }

  async function setJiraData() {
    let jiraData = pageData?.jira;

    if (!jiraData) {
      jiraData = await getFakeJiraData();
    }

    const jiraLinkItem = document.querySelector("#jira");

    setLinkInfo(jiraLinkItem, jiraData);

    jiraLinkItem.parentElement.classList.remove("loading");
  }
}

function cleanDom() {
  document.querySelectorAll(".link-group-block").forEach((element) => {
    element.classList.add("loading");
  });

  document.querySelectorAll(".link-group-item").forEach((element) => {
    const link = element.querySelector("a");
    link.innerText = "";
    link.href = "";

    element.querySelector(".date-info").innerText = "";
  });
}

function getFakeVideoData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        window?.failDemoFetch
          ? {
              "16:9tt": {
                link: "https://www.shutterstock.com/search/vertical-xxxxxxx/",
                time: "10:30",
                date: "22.09.23",
              },
            }
          : {
              "16:9": {
                link: "https://www.shutterstock.com/search/vertical-xxxxxxx/",
                time: "10:30",
                date: "22.09.23",
              },
              "16:9tt": {
                link: "https://www.shutterstock.com/search/vertical-xxxxxxx/",
                time: "10:30",
                date: "22.09.23",
              },
              "1:1": {
                link: "https://www.shutterstock.com/search/vertical-xxxxxxx/",
                time: "10:30",
                date: "22.09.23",
              },
            }
      );
    }, 2500);
  });
}

function getFakeJiraData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        window?.failDemoFetch
          ? {}
          : {
              link: "https://www.shutterstock.com/search/vertical-xxxxxxx/",
              time: "10:30",
              date: "22.09.23",
            }
      );
    }, 1500);
  });
}

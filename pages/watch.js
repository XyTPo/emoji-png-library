function watchUtils() {
  const pageData = window?.pageData;

  setVideoData();
  setJiraData();

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

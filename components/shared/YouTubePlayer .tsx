import React from "react";
import { useEffect } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any; // Adjust the type according to your needs
  }
}
export interface videoProps {
  videoId: string;
}
const YouTubePlayer = ({ videoId }: videoProps) => {
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    function onYouTubeIframeAPIReady() {
      new window.YT.Player("player", {
        height: "360",
        width: "100%",
        videoId: videoId,
        playerVars: {
          rel: 0, // Prevent related videos from being displayed
        },
        events: {
          onReady: onPlayerReady,
        },
      });
    }

    function onPlayerReady(event: any) {
      // Do something when the player is ready
    }
  }, [videoId]);

  return <div id="player"></div>;
};

export default YouTubePlayer;

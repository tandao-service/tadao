import React from "react";
import { useEffect } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any; // Adjust the type according to your needs
  }
}
export interface videoProps {
  videoUrl: string;
}

const youtubeRegex =
/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
// Function to check if it's a YouTube URL and extract the video ID
function extractYouTubeVideoId(url: string) {
const match = url.match(youtubeRegex);
if (match && match[1]) {
  return match[1]; // Return the video ID
} else {
  return null; // Not a YouTube URL or invalid URL
}
}
const YouTubePlayer = ({ videoUrl }: videoProps) => {
  const youtubeVideoId = extractYouTubeVideoId(videoUrl);
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
        videoId: youtubeVideoId,
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
  }, [youtubeVideoId]);

  return <div id="player" className="rounded-xl"></div>;
};

export default YouTubePlayer;

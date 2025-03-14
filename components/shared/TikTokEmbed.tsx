"use client";

import { useEffect, useState } from "react";

interface TikTokEmbedProps {
    videoUrl: string;
  //username: string;
}
function extractTikTokInfo(url: string) {
    const regex = /tiktok\.com\/@([\w.-]+)\/video\/(\d+)/;
    const match = url.match(regex);
  
    if (match) {
      return { username: match[1], videoId: match[2] };
    }
  
    return null; // Return null if the URL does not match
  }
const TikTokEmbed = ({ videoUrl }: TikTokEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const result:any = extractTikTokInfo(videoUrl);
// Fetch TikTok oEmbed data to get thumbnail
  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`
        );
        const data = await response.json();

        if (data && data.thumbnail_url) {
          setThumbnail(data.thumbnail_url);
          setEmbedHtml(data.html);
        }
      } catch (error) {
        console.error("Failed to fetch TikTok thumbnail:", error);
      }
    };

    fetchThumbnail();
  }, [videoUrl]);

  return (
    <div className="relative w-full">
      {!isPlaying ? (
        <div
          className="relative cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          {/* Show Thumbnail */}
          {thumbnail ? (<div className="items-center justify-center w-full flex">
            <img
              src={thumbnail}
              alt="TikTok Thumbnail"
              className="w-[300px] h-[580px] rounded-lg"
            /></div>
          ) : (
            <div className="w-full h-60 bg-gray-200 bg-black flex items-center justify-center rounded-lg">
              Loading...
            </div>
          )}
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <button className="p-4 bg-red rounded-full shadow-lg">
              ▶️ Play
            </button>
          </div>
        </div>
      ) : (
        <blockquote
          className="tiktok-embed  h-[580px]"
          cite={videoUrl}
          data-video-id={result.videoId}
        >
          <section>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              @{result.username}
            </a>
          </section>
        </blockquote>
      )}
      {/* Load TikTok Embed Script When Video is Playing */}
      {isPlaying && (
        <script async src="https://www.tiktok.com/embed.js"></script>
      )}
    </div>
  );
};

export default TikTokEmbed;

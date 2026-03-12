// components/InitialAvatar.tsx
import React from "react";
import Avatar from "react-avatar";

interface InitialAvatarProps {
  name: string; // Name to generate the avatar from
  size?: number; // Optional size of the avatar
  color?: string; // Optional custom color
}

const InitialAvatar: React.FC<InitialAvatarProps> = ({
  name,
  size = 40,
  color,
}) => {
  const firstLetter = name.trim().charAt(0).toUpperCase(); // Get the first letter and ensure it's uppercase

  // Generate a color dynamically if no color is provided
  const generateColor = (name: string): string => {
    const colors = [
      "#FFB6C1", // Light Pink
      "#FFD700", // Gold
      "#87CEEB", // Sky Blue
      "#32CD32", // Lime Green
      "#FF4500", // Orange Red
      "#8A2BE2", // Blue Violet
      "#00FFFF", // Aqua
      "#FF1493", // Deep Pink
      "#1E90FF", // Dodger Blue
      "#DC143C", // Crimson
      "#FF6347", // Tomato
      "#ADFF2F", // Green Yellow
      "#FF69B4", // Hot Pink
      "#D2691E", // Chocolate
      "#8B4513", // Saddle Brown
      "#98FB98", // Pale Green
      "#6495ED", // Cornflower Blue
      "#DA70D6", // Orchid
      "#00FA9A", // Medium Spring Green
      "#F0E68C", // Khaki
      "#B0C4DE", // Light Steel Blue
      "#8B008B", // Dark Magenta
      "#A52A2A", // Brown
      "#D3D3D3", // Light Gray
      "#B22222", // Firebrick
      "#7FFF00", // Chartreuse
      "#FF8C00", // Dark Orange
      "#6A5ACD", // Slate Blue
      "#FFD700", // Gold
      "#FF00FF", // Magenta
    ];

    //const index = name.trim().length % colors.length; // Use string length to pick a color
    const index = Math.floor(Math.random() * colors.length); // Get a random index
    return colors[index];
  };

  const avatarColor = color || generateColor(name);

  return (
    <div style={{ textAlign: "center" }}>
      <Avatar
        name={firstLetter}
        size={size.toString()}
        round={true}
        color={avatarColor}
      />
    </div>
  );
};

export default InitialAvatar;

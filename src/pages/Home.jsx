import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react"; // Lucide icons

function Feed() {
  const posts = [
    {
      id: 1,
      username: "abhaya",
      content: "Just launched my new project 🚀 #OmniVibe",
      time: "2h ago",
    },
    {
      id: 2,
      username: "gaurab",
      content: "Working on some crazy React stuff! ⚛️",
      time: "5h ago",
    },
    {
      id: 3,
      username: "luna",
      content: "Dark mode >>> Light mode 🌙",
      time: "1d ago",
    },
  ];

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md border border-white rounded-xl p-4 w-full"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">@{post.username}</h3>
              <span className="text-xs text-gray-500">{post.time}</span>
            </div>

            <p className="text-gray-700">{post.content}</p>

            <div className="flex justify-between mt-3 text-gray-500">
              <button className="flex items-center space-x-1 hover:text-black">
                <Heart size={18} /> <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-black">
                <MessageCircle size={18} /> <span>Comment</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-black">
                <Share2 size={18} /> <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;

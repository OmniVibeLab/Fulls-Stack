import React, { useState } from "react";
import { Heart, Repeat } from "lucide-react";

const Feed = ({ posts = [] }) => {
  if (posts.length === 0) {
    posts = [
      {
        id: 1,
        user: { name: "Abhaya", username: "abhaya", avatar: "https://placehold.co/600x400" },
        content: "Just finished my new project 🚀",
        likes: 24,
        liked: false,
        reposts: 2,
        reposted: false,
      },
      {
        id: 2,
        user: { name: "Luna", username: "luna", avatar: "https://placehold.co/600x400" },
        content: "React + Tailwind is awesome! 😎",
        likes: 12,
        liked: false,
        reposts: 0,
        reposted: false,
      },
    ];
  }

  const [postList, setPostList] = useState(posts);

  const handleLike = (postId) => {
    setPostList((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleRepost = (postId) => {
    setPostList((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, reposted: !post.reposted, reposts: post.reposted ? post.reposts - 1 : post.reposts + 1 }
          : post
      )
    );
  };

  return (
    <div className="space-y-6">
      {postList.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center mb-2">
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold text-black">{post.user.name}</p>
              <p className="text-sm text-gray-500">@{post.user.username}</p>
            </div>
          </div>

          <p className="mb-3 text-gray-800">{post.content}</p>

          <div className="flex items-center space-x-6">
            {/* Like */}
            <Heart
              size={24}
              onClick={() => handleLike(post.id)}
              className={`cursor-pointer transition-colors ${
                post.liked ? "text-white bg-red-500 rounded-full p-1" : "text-gray-500"
              }`}
            />
            <span className="text-gray-700">{post.likes}</span>

            {/* Single Repost */}
            <Repeat
              size={24}
              onClick={() => handleRepost(post.id)}
              className={`cursor-pointer transition-colors ${
                post.reposted ? "text-white bg-green-500 rounded-full p-1" : "text-gray-500"
              }`}
            />
            <span className="text-gray-700">{post.reposts}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;

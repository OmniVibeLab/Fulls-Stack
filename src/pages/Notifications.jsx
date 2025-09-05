import React, { useState, useEffect } from "react";
import { Bell, UserPlus, Heart, MessageCircle } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Replace this with API call if needed
    setNotifications([
      {
        id: 1,
        type: "follow",
        username: "abhaya",
        avatar: "https://via.placeholder.com/40",
        time: "2h ago",
      },
      {
        id: 2,
        type: "like",
        username: "gaurab",
        avatar: "https://via.placeholder.com/40",
        post: "Just launched my new project 🚀",
        time: "5h ago",
      },
      {
        id: 3,
        type: "comment",
        username: "luna",
        avatar: "https://via.placeholder.com/40",
        comment: "This is amazing!",
        post: "Dark mode >>> Light mode 🌙",
        time: "1d ago",
      },
    ]);
  }, []);

  const renderIcon = (type) => {
    switch (type) {
      case "follow":
        return <UserPlus className="text-black" size={20} />;
      case "like":
        return <Heart className="text-red-500" size={20} />;
      case "comment":
        return <MessageCircle className="text-green-500" size={20} />;
      default:
        return <Bell className="text-black" size={20} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 && (
          <p className="text-black">No notifications yet.</p>
        )}
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-center bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <div className="mr-4">{renderIcon(notif.type)}</div>
            <img
              src={notif.avatar}
              alt={notif.username}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1 text-black">
              {notif.type === "follow" && (
                <p>
                  <span className="font-semibold">@{notif.username}</span>{" "}
                  started following you.
                </p>
              )}
              {notif.type === "like" && (
                <p>
                  <span className="font-semibold">@{notif.username}</span>{" "}
                  liked your post: "{notif.post}"
                </p>
              )}
              {notif.type === "comment" && (
                <p>
                  <span className="font-semibold">@{notif.username}</span>{" "}
                  commented on your post: "{notif.comment}"
                </p>
              )}
              <span className="text-xs text-black">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

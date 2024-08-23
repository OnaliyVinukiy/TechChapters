"use client";

import FeedCard from "./feedCard";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPosts, getUsers } from "../api/get-posts";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function UserFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const postsData = await getPosts();
        if (Array.isArray(postsData)) {
          setPosts(postsData);
        } else {
          console.error("Posts data is not an array:", postsData);
          setPosts([]);
        }

        if (currentUser) {
          const userData = await getUsers(currentUser.uid);
          if (Array.isArray(userData)) {
            setUsers(userData);
          } else {
            console.error("Users data is not an array:", userData);
            setUsers([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPosts([]);
        setUsers([]);
      }
    };

    fetchPostsAndUsers();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [currentUser]); // Added currentUser as a dependency to re-fetch users data when currentUser changes

  // Check if the current user is in the users data with a 'pro' subscription
  const isPremiumUser =
    currentUser &&
    users.some(
      (user) =>
        user.userId === currentUser.uid && user.subscriptionType === "premium"
    );

  return (
    <div className="relative mt-20">
      <div className="mt-5">
        <h1 className="text-center text-green-700 text-4xl font-semibold underline">
          User Feed
        </h1>
      </div>

      {isPremiumUser && (
        <div className="mt-20 ml-10 mb-5">
          <Button
            onClick={() => navigate("/feedForm")}
            className="bg-green-700"
          >
            Add post
          </Button>
        </div>
      )}

      <hr />

      <div className="h-[calc(120vh-5rem)] overflow-auto">
        <div className="flex flex-col space-y-4 px-5 py-4">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post, index) => (
              <FeedCard
                key={index}
                imageFile={post.image}
                topic={post.topic}
                about={post.description}
                date={post.date}
                userId={post.userId}
                randomId={post.randomId}
              />
            ))
          ) : (
            <p className="text-center text-4xl">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserFeed;

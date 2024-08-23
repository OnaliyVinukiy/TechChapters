import { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { database, storage, auth } from "../firebase"; // Update with the correct path
import { ref, push } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

export default function FeedForm() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  const currentDate = new Date();
  const randomId = uuidv4();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;

    if (image) {
      try {
        // Create a unique filename for the image
        const imageName = new Date().getTime() + "-" + image.name;
        const imageRef = storageRef(storage, `images/${imageName}`);

        // Upload image to Firebase Storage
        await uploadBytes(imageRef, image);

        // Get image URL
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error uploading image:", error.message);
        toast.error(`Failed to upload image: ${error.message}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }

    // Create a new post object
    const newPost = {
      topic,
      date: currentDate.toISOString().split("T")[0],
      description,
      image: imageUrl,
      user: user ? user.email : "Anonymous",
      userId: user ? user.uid : "Anonymous",
      randomId: randomId, // Add user ID to the post
    };

    try {
      // Push the new post to the Firebase Realtime Database
      await push(ref(database, "posts"), newPost);

      // Show success notification
      toast.success("Post added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form fields
      setTopic("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error adding post:", error.message);

      // Show error notification
      toast.error("Failed to add post. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="mt-10">
        {user ? (
          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray" className="text-center">
              Add Post
            </Typography>

            <form
              className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
              onSubmit={handleSubmit}
            >
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Topic
                </Typography>
                <Input
                  size="lg"
                  type="text"
                  placeholder="Post topic"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />

                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Description
                </Typography>
                <textarea
                  placeholder="Enter post description"
                  className="resize-none border !border-t-blue-gray-200 rounded-lg p-2 text-gray-700 focus:!border-t-gray-900 focus:ring-2 focus:ring-gray-900"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Image
                </Typography>
                <Input
                  type="file"
                  size="lg"
                  className="!border-t-blue-green-200 focus:!border-t-green-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <Button className="mt-6 bg-green-500" fullWidth type="submit">
                Submit
              </Button>
              <a href="/feed" className="">
                <h1 className="m-5 color text-center">
                  <i className="fa-solid fa-angle-left"></i>Back
                </h1>
              </a>
            </form>
          </Card>
        ) : (
          <Typography variant="h6" color="blue-gray" className="text-center">
            No user logged in. Please log in to add a post.
          </Typography>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

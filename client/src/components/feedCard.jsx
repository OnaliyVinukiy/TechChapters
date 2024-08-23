import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase"; // Ensure database is imported
import { ref, remove } from "firebase/database";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the app element for accessibility

function FeedCard({ imageFile, topic, about, date, userId, randomId }) {
  const [user, setUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDelete = () => {
    if (user && user.uid === userId) {
      const postRef = ref(database, `posts/${randomId}`);
      remove(postRef)
        .then(() => {
          toast.success("Post deleted successfully");
          console.log("Post deleted successfully");
        })
        .catch((error) => {
          toast.error("Error deleting post: " + error.message);
          console.error("Error deleting post: ", error);
        });
    } else {
      toast.error("User is not authorized to delete this post");
      console.log("User is not authorized to delete this post");
    }
    closeModal();
  };

  return (
    <div className="mt-10 ml-5 mr-5 mb-10 flex justify-center ">
      <Card className="w-full max-w-[24rem] h-[35rem] overflow-hidden shadow-lg">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="h-5/6 p-5"
        >
          <img
            src={imageFile}
            alt="Feed"
            className="object-cover w-full h-full"
          />
        </CardHeader>
        <hr />
        <CardBody className="h-1/4 overflow-y-auto">
          <Typography
            variant="h4"
            color="blue-gray"
            className="text-green-700 font-semibold capitalize underline text-left text-lg"
          >
            {topic}
          </Typography>
          <Typography
            variant="lead"
            color="gray"
            className="mt-3 font-normal text-justify text-sm"
          >
            {about}
          </Typography>
        </CardBody>
        <CardFooter className="h-1/4 flex items-center justify-between">
          <Typography className="font-normal">{date}</Typography>
          <Typography className="font-normal">
            {user && user.uid === userId && (
              <Button className="bg-red-600" onClick={openModal}>
                <i className="fa-solid fa-trash"></i>
              </Button>
            )}
          </Typography>
        </CardFooter>
      </Card>
      <ToastContainer />

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded shadow-lg w-80">
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this post?</p>
          <div className="flex justify-end">
            <Button
              className="bg-gray-500 text-white mr-2"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button className="bg-red-600 text-white" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FeedCard;

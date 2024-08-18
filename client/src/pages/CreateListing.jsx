import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, push, onValue, get } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { query, orderByChild, equalTo } from "firebase/database";
import emailjs from "emailjs-com"; // Import EmailJS library
import { useParams } from "react-router-dom";
const CreateListing = () => {
  const [subscribedEmails, setSubscribedEmails] = useState({});
  const [formData, setFormData] = useState({
    eventName: "",
    time: "",
    date: "",
    minidescription: "",
    description: "",
    image: null,
    clubName: "",
    university: "",
    other: "",
    province: "",
    volunteerLink: "",
    participateLink: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [clubNames, setClubNames] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedClubType, setSelectedClubType] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const { clubName } = useParams();
  useEffect(() => {
    const database = getDatabase();
    const leadersRef = ref(database, "leaders");

    const fetchLeaderUsernames = () => {
      onValue(leadersRef, (snapshot) => {
        console.log("Snapshot:", snapshot.val());
        if (snapshot.exists()) {
          const leaderData = snapshot.val();
          const leaderUsernames = Object.values(leaderData).map((leader) =>
            leader.username.trim()
          );

          console.log("Leader Usernames:", leaderUsernames);
          console.log("Current User:", currentUser.name);

          const currentUserNormalized = currentUser.name
            .replace(/\s+/g, " ")
            .trim();

          let isLeader = false;
          leaderUsernames.forEach((leaderUsername) => {
            if (
              currentUserNormalized &&
              currentUserNormalized.toLowerCase() ===
                leaderUsername.toLowerCase()
            ) {
              isLeader = true;
            }
          });
          console.log("Is Leader:", isLeader);
          setIsLeader(isLeader);

          // Fetch club name for the current leader
          if (isLeader) {
            const currentLeaderData = Object.values(leaderData).find(
              (leader) =>
                leader.username.trim().toLowerCase() ===
                currentUserNormalized.toLowerCase()
            );
            setFormData((prevFormData) => ({
              ...prevFormData,
              clubName: currentLeaderData.club,
            }));
          }
        }
      });
    };

    if (!isDataFetched) {
      fetchLeaderUsernames();
      setIsDataFetched(true);
    }

    return () => {};
  }, [currentUser, isDataFetched]);

  useEffect(() => {
    const database = getDatabase();
    const clubNamesRef = ref(database, "clubs");

    get(clubNamesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const clubNamesData = snapshot.val();
          const clubNamesList = Object.keys(clubNamesData).map(
            (key) => clubNamesData[key].name
          );
          setClubNames(clubNamesList);
        }
      })
      .catch((error) => {
        console.error("Error fetching club names: ", error);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleRadioChange = (e) => {
    setSelectedClubType(e.target.value);
  };

  useEffect(() => {
    const database = getDatabase();
    const subscribersRef = ref(database, "subscribers");

    // Fetch subscribed emails from Firebase
    onValue(subscribersRef, (snapshot) => {
      const subscribedData = snapshot.val();
      console.log("Subscribed Data:", subscribedData);
      if (subscribedData) {
        setSubscribedEmails(subscribedData);
      } else {
        setSubscribedEmails({});
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const database = getDatabase();
    const storage = getStorage();
    const imagesRef = storageRef(storage, "images/" + formData.image.name);
    let clubId;

    uploadBytes(imagesRef, formData.image)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((imageUrl) => {
        const clubsRef = ref(database, "clubs");
        return get(clubsRef).then((snapshot) => {
          if (snapshot.exists()) {
            const clubsData = snapshot.val();
            clubId = Object.keys(clubsData).find(
              (key) => clubsData[key].name === formData.clubName
            );

            return push(ref(database, "events"), {
              ...formData,
              imageUrl: imageUrl,
              clubId: clubId,
            });
          } else {
            console.log("No clubs found");
          }
        });
      })
      .then(() => {
        console.log("Event added successfully!");
        console.log("Club ID:", clubId);
        setSuccess(true);
        setErrorMessage("");
        setLoading(false);

        if (clubId) {
          const subscribersRef = ref(database, "subscribers");
          const clubSubscribersQuery = query(
            subscribersRef,
            orderByChild("clubId"),
            equalTo(clubId)
          );

          onValue(clubSubscribersQuery, (snapshot) => {
            const subscribedData = snapshot.val();
            console.log("Subscribed Data:", subscribedData);
            if (subscribedData) {
              const subscriberEmails = Object.values(subscribedData).map(
                (subscriber) => subscriber.email
              );

              // Send emails to subscribers
              const EMAILJS_SERVICE_ID = "service_clqpoal";
              const EMAILJS_TEMPLATE_ID = "template_3chyey3";
              const EMAILJS_USER_ID = "GLteqOVgIa1pN5Mul";

              subscriberEmails.forEach((email) => {
                const template_params = {
                  email: email,
                  eventName: formData.eventName,
                  clubName: formData.clubName,
                  university: formData.university,
                  province: formData.province,
                  description: formData.description,
                };

                emailjs
                  .send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    template_params,
                    EMAILJS_USER_ID
                  )
                  .then((response) => {
                    console.log("Email sent successfully to:", email);
                  })
                  .catch((error) => {
                    console.error("Error sending email to:", email, error);
                  });
              });
            } else {
              console.log("No subscribers found for the club:", clubId);
            }
          });
        } else {
          console.log("No club ID found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Error submitting data: " + error.message);
        setLoading(false);
      });
  };
const renderClubTypeSelection = () => {
    if (selectedClubType === "universityclub") {
      return (
        <div className="sm:col-span-2">
          <label htmlFor="university" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            University
          </label>
          <select
            id="university"
            value={formData.university}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option value="">Select University</option>
            <option value="">NSBM</option>
            <option value="">IIT</option>
            <option value="">UOR</option>
          </select>
        </div>
      );
    } else if (selectedClubType === "otherclub") {
      return (
        <div className="sm:col-span-2">
          <label htmlFor="university" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Other Club Type
          </label>
          <select
            id="university"
            value={formData.clubtype}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option value="">Select Club Type</option>
            <option value="">Rotaract</option>
            <option value="">Interact</option>
            <option value="">Toastmasters</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const renderClubSelection = () => {
    const isAdmin = currentUser.name === "Onaliy Vinukiy Jayawardana";
    const filteredClubNames = isAdmin
      ? clubNames
      : clubNames.filter((clubName) => clubName === formData.clubName);
    return (
      <select
        id="clubName"
        value={formData.clubName}
        onChange={handleChange}
        required
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      >
        <option value="">Select Club</option>
        {filteredClubNames.map((clubName, index) => (
          <option key={index} value={clubName}>
            {clubName}
          </option>
        ))}
      </select>
    );
  };
  useEffect(() => {
    const database = getDatabase();
    const leadersRef = ref(database, "leaders");

    const fetchLeaderUsernames = () => {
      onValue(leadersRef, (snapshot) => {
        if (snapshot.exists()) {
          const leaderData = snapshot.val();

          const currentUserLeader = Object.values(leaderData).find(
            (leader) => leader.username === currentUser?.name
          );
          if (currentUserLeader) {
            setIsLeader(true);
          } else {
            setIsLeader(false);
          }
        }
        setIsDataFetched(true);
      });
    };

    if (!isDataFetched) {
      fetchLeaderUsernames();
    }
    return () => {};
  }, [currentUser, clubName, isDataFetched]);
  if (!isLeader && currentUser?.name !== "Onaliy Vinukiy Jayawardana") {
    return (
      <div>
        <p class="mt-56 text-3xl text-center">
          You do not have access to this page.
        </p>
      </div>
    );
  }
  return (
    <div>
      {(isLeader || currentUser.name === "Onaliy Vinukiy Jayawardana") && (
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h1 className="mb-4 text-xl text-center font-bold text-gray-900 dark:text-white mt-16">
              Add a new Event
            </h1>

            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white">Select Club Type</label>
              </div>
                <div class="flex">
                  <div class="flex items-center me-4">
                 
                    <input
                      id="inline-radio"
                      type="radio"
                      value="universityclub"
                      name="inline-radio-group"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedClubType === "universityclub"}
                      onChange={handleRadioChange}
                    />
                    <label
                      for="inline-radio"
                      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      University Club
                    </label>
                  </div>
                  <div class="flex items-center me-4">
                    <input
                      id="inline-2-radio"
                      type="radio"
                      value="otherclub"
                      name="inline-radio-group"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedClubType === "otherclub"}
                       onChange={handleRadioChange}
                    />
                    <label
                      for="inline-2-radio"
                      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Other Club
                    </label>
                  </div>
                </div>
               {renderClubTypeSelection()}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter event name"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="clubName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Club Name
                  </label>
                  {renderClubSelection()}

                  
                  <div className="sm:col-span-2 mt-4">
                    <label
                      htmlFor="province"
                      className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Province
                    </label>
                    <select
                      id="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required
                    >
                      <option value="">Select Province</option>
                      <option value="Western">Western</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Central">Central</option>
                      <option value="Northern">Northen</option>
                      <option value="Northwestern">North Western</option>
                      <option value="Northcentral">North Central</option>
                      <option value="Uva">Uva</option>
                      <option value="Sabaragamuwa">Sabaragamuwa</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter event time"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="date"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter event date"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="minidescription"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mini Description
                  </label>
                  <input
                    type="text"
                    id="minidescription"
                    value={formData.minidescription}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter event mini description"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter event description"
                    required
                  ></textarea>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="image"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-8 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="volunteerLink"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Volunteer Link
                  </label>
                  <input
                    type="url"
                    id="volunteerLink"
                    value={formData.volunteerLink}
                    onChange={handleChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter volunteer link"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="participateLink"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Participate Link
                  </label>
                  <input
                    type="url"
                    id="participateLink"
                    value={formData.participateLink}
                    onChange={handleChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter participate link"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.133 0-4.069-.836-5.542-2.209l1.554-1.5z"
                    ></path>
                  </svg>
                ) : (
                  "Add Event"
                )}
              </button>
            </form>
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Event Added Successfully & Notifications sent to Subscribers!
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
export default CreateListing;

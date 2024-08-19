import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, get } from "firebase/database";
import { useSelector } from "react-redux";
const Leaders = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    club: "Select Club",
    package: "Select Package",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clubNames, setClubNames] = useState([]);
  const isLeader = useSelector((state) => state.user.isLeader);
  const [selectedClubType, setSelectedClubType] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    const database = getDatabase();
    const clubNamesRef = ref(database, "clubs");

    get(clubNamesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const clubNamesData = snapshot.val();
          console.log("clubNamesData:", clubNamesData); // Log the fetched data
          const clubNamesList = Object.keys(clubNamesData).map(
            (key) => clubNamesData[key].name
          );
          console.log("clubNamesList:", clubNamesList); // Log the processed club names
          setClubNames(clubNamesList);
        } else {
          console.log("No clubs data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching club names: ", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleRadioChange = (e) => {
    setSelectedClubType(e.target.value);
  };
  const renderClubTypeSelection = () => {
    if (selectedClubType === "universityclub") {
      return (
        <div className="sm:col-span-2">
          <label
            htmlFor="university"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
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
            <option value="NSBM">NSBM</option>
            <option value="IIT">IIT</option>
            <option value="UOR">UOR</option>
          </select>
        </div>
      );
    } else if (selectedClubType === "otherclub") {
      return (
        <div className="sm:col-span-2">
          <label
            htmlFor="university"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
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
            <option value="Rotaract">Rotaract</option>
            <option value="Interact">Interact</option>
            <option value="Toastmasters">Toastmasters</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Get a reference to the database service
    const database = getDatabase();

    // Push data to the 'leaders' node in the Realtime Database
    push(ref(database, "leaders"), {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      club: formData.club,
      package: formData.package,
    })
      .then(() => {
        console.log("Data successfully submitted!");
        setSuccess(true);
        setFormData({ name: "", email: "", username: "", club: "", package: ""});
      })
      .catch((error) => {
        console.error("Error submitting data: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (!isLeader && currentUser?.name !== "Onaliy Vinukiy Jayawardana") {
    return (
      <div>
        <p class="mt-64 text-3xl text-center">
          You do not have access to this page.
        </p>
      </div>
    );
  }
  return (
    <div>
      <section className="bg-white dark:bg-gray-900 mt-12">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl text-center font-bold text-gray-900 dark:text-white">
            Get Started with Basic Plan
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Club Type
                </label>
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
                  Leader's Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter Club Leader's Name"
                  required=""
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Leader's Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter Club Leader's Gmail"
                  required=""
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Leader's Username
                </label>
                <input
                  type="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter Club Leader's Username as in Gmail Account"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="club"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Club
                </label>
                <select
                  id="club"
                  value={formData.club}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select Club</option>
                  {clubNames.map((clubName, index) => (
                    <option key={index} value={clubName}>
                      {clubName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  User Package
                </label>
                <select
            id="package"
            value={formData.package}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option value="Select Package">Select Package</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Premium">Premium</option>
          </select>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                "Register"
              )}
            </button>
          </form>
          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Data submitted successfully!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Leaders;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PublicClientApplication } from "@azure/msal-browser";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { getDatabase} from "firebase/database";

import { getAuth} from "firebase/auth";
import { auth, database } from "../firebase"; // Import the initialized Firebase objects
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref, onValue } from "firebase/database";

const googleProvider = new GoogleAuthProvider();


const Header = () => {
  const [isDataFetched, setIsDataFetched] = useState(false);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  let [isAdditionalDropdownVisible, setIsAdditionalDropdownVisible] =
    useState(false);
  let [isLeader, setIsLeader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const msalConfig = {
    auth: {
      clientId: "7888a1dc-f295-424f-88dc-5028e8e3e2b3",
      authority: "https://login.microsoftonline.com/nsbm.ac.lk",
      redirectUri: "http://localhost:5173/",
      postLogoutRedirectUri: "http://localhost:5173",
    },
    cache: {
      cacheLocation: "LocalStorage",
      storeAuthStateInCookie: true,
    },
  };
  const msalInstance = new PublicClientApplication(msalConfig);

  useEffect(() => {
    const database = getDatabase();
    const leadersRef = ref(database, "leaders");

    const initializeMsal = async () => {
      await msalInstance.initialize();
    };
    initializeMsal();

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

          // Normalize whitespace in currentUser.name
          const currentUserNormalized = currentUser.name
            .replace(/\s+/g, " ")
            .trim();

          // Check if the current user's name matches any leader's username
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
        }
      });
    };

    if (!isDataFetched) {
      fetchLeaderUsernames();
      setIsDataFetched(true);
    }

    return () => {};
  }, [msalInstance, isDataFetched, currentUser, isLeader]);

  const handleGoogleLogin = async () => {
    try {
      dispatch(signInStart());
      const result = await signInWithPopup(auth, googleProvider);
      const { email, displayName } = result.user;

      dispatch(signInSuccess({ email, name: displayName }));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(signOutUserSuccess());
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  const handleAdditionalDropdownToggle = () => {
    setIsAdditionalDropdownVisible(!isAdditionalDropdownVisible);
  };

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const [clubName, setClubName] = useState(""); // Initialize clubName state

  useEffect(() => {
    const database = getDatabase();
    const leadersRef = ref(database, "leaders");

    const initializeMsal = async () => {
      await msalInstance.initialize();
    };
    initializeMsal();

    const fetchLeaderUsernames = () => {
      onValue(leadersRef, (snapshot) => {
        if (snapshot.exists()) {
          const leaderData = snapshot.val();
          // Find the leader with the current user's username
          const currentUserLeader = Object.values(leaderData).find(
            (leader) => leader.username === currentUser?.name
          );
          if (currentUserLeader) {
            setClubName(currentUserLeader.club); // Update clubName state with the club of the current user's leader
            console.log("Club Name Assigned:", currentUserLeader.club);
          } else {
            setClubName(""); // Reset clubName state if no matching leader is found
            console.log("Club Name Reset");
          }
        }
      });
    };

    if (!isDataFetched) {
      fetchLeaderUsernames();
      setIsDataFetched(true);
    }

    return () => {
      // Cleanup code if necessary
    };
  }, [msalInstance, isDataFetched, currentUser]);

  return (
    <div>
      <nav class="bg-white border-gray-600 fixed w-full z-20 top-0 start-0 border-gray-600 bg-white mt-0 shadow-md">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 ">
          <h1 class="flex flex-wrap text-xl font-bold cursor-pointer sm:text-2xl md:text-3xl">
            <span class="text-green-600">Tech</span>
            <span class="text-blue-800">Chapters</span>
          </h1>

          <button
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:focus:outline-none focus:ring-2 focus:ring-white text-gray-400 hover:bg-white "
            onClick={handleDropdownToggle}
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            class={`${
              isDropdownVisible ? "block" : "hidden"
            } w-full md:block md:w-auto flex justify-center`}
          >
            <ul class="flex flex-col p-4 md:p-0 mt-4 ml-auto border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white  justify-center">
              <li class="flex items-center mr-0">
                <a
                  href="/"
                  class="block py-2 px-3 text-black text-black md:text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600 md:p-0 text-black md:hover:text-green-600"
                >
                  Home
                </a>
              </li>
              <li class="flex items-center mr-0">
                <button
                  id="dropdownNavbarLink"
                  data-dropdown-toggle="dropdownNavbar"
                  class="flex items-center justify-between w-full py-2 px-3 text-black text-black md:text-lg hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600 md:p-0 md:w-auto text-black md:hover:text-green-600 focus:text-black md:hover:bg-transparent hover:text-green-600"
                >
                  {" "}
                  Clubs & Societies
                  <svg
                    class="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  id="dropdownNavbar"
                  class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    class="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownLargeButton"
                  >
                    <li class="flex items-center">
                      <button
                        id="doubleDropdownButton1"
                        data-dropdown-toggle="doubleDropdown1"
                        data-dropdown-placement="right-start"
                        type="button"
                        class="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={handleDropdownToggle}
                      >
                        Provincial
                        <svg
                          class="w-2.5 h-2.5 ms-2.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>
                      <div
                        id="doubleDropdown1"
                        class={`${
                          isAdditionalDropdownVisible ? "block" : "hidden"
                        } z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
                      >
                        <ul
                          class="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="provinceDropdownButton"
                        >
                          <li>
                            <a
                              href="/Western"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Western Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Eastern"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Eastern Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Central"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Central Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Northern"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Northern Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/NorthWestern"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              North Western Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/NorthCentral"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              North Central Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Uva"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Uva Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Sabaragamuwa"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Sabaragamuwa Province
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li class="flex items-center">
                      <button
                        id="doubleDropdownButton2"
                        data-dropdown-toggle="doubleDropdown2"
                        data-dropdown-placement="right-start"
                        type="button"
                        class="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={handleDropdownToggle}
                      >
                        Other Clubs
                        <svg
                          class="w-2.5 h-2.5 ms-2.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>
                      <div
                        id="doubleDropdown2"
                        class={`${
                          isAdditionalDropdownVisible ? "block" : "hidden"
                        } z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
                      >
                        <ul
                          class="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="provinceDropdownButton"
                        >
                          <li>
                            <a
                              href="/Western"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Rotaract Clubs
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Eastern"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Interact Clubs
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Central"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Leo Clubs
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Northern"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Toastmasters Clubs
                            </a>
                          </li>
                          <li>
                            <a
                              href="/NorthWestern"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              North Western Province
                            </a>
                          </li>
                          <li>
                            <a
                              href="/NorthCentral"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              North Central Province
                            </a>
                          </li>
                         
                          
                        </ul>
                      </div>
                    </li>
                    <li>
                      <a
                        href="/activitybased"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        University Clubs
                      </a>
                    </li>
                   
                  </ul>
                </div>
              </li>
              <li class="flex items-center mr-0">
                <a
                  href="/about"
                  class="block py-2 px-3 text-black md:text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600 md:p-0 text-black md:hover:text-green-600"
                >
                  About Us
                </a>
              </li>
              <li class="flex items-center mr-0">
                <a
                  href="/contact"
                  class="block py-2 px-3 text-black md:text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600 md:p-0 text-black md:hover:text-green-600"
                >
                  Contact Us
                </a>
              </li>
              <li class="flex items-center mr-0">
                <a
                  href="/Events"
                  class="block py-2 px-3 text-black text-black md:text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600 md:p-0 text-black md:hover:text-green-600"
                >
                  Events
                </a>
              </li>

              {currentUser?.name === "Onaliy Vinukiy Jayawardana" && (
                <li className="flex items-center relative">
                  <a
                    href="/ContactList"
                    className="block py-2 px-3 text-black md:text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600 md:p-0 text-black md:hover:text-green-600"
                  >
                    {" "}
                    Inquiries{" "}
                  </a>
                  <button
                    onClick={handleAdditionalDropdownToggle}
                    className="flex items-center justify-between w-full py-2 px-3 text-black text-black md:text-lg hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600 md:p-0 md:w-auto text-black md:hover:text-green-600 focus:text-black md:hover:bg-transparent hover:text-green-600 ml-3"
                  >
                    Clubs & Events
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>

                  {isAdditionalDropdownVisible && (
                    <div className="thiswindow absolute top-full left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-2 ml-16">
                      <ul
                        className="py-2 text-sm text-gray-700"
                        aria-labelledby="doubleDropdownButton82"
                      >
                        <li>
                          <a
                            href="/createListing"
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Add Events
                          </a>
                        </li>
                        <li>
                          <a
                            href="/EventEdit"
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Edit Events
                          </a>
                        </li>
                        <li>
                          <a
                            href={`/feedbackseditmain`}
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Feedbacks
                          </a>
                        </li>
                        <li>
                          <a
                            href="/Clubadd"
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Add Clubs
                          </a>
                        </li>
                        <li>
                          <a
                            href="/editclubs"
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Edit Clubs
                          </a>
                        </li>
                        <li>
                          <a
                            href="/Leaders"
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Add Club Leader
                          </a>
                        </li>
                        <li>
                          <a
                            href="/editLeaders"
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Edit Club Leader
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              )}

              {isLeader && currentUser.name !== "Onaliy Vinukiy Jayawardana" && (
                <li className="flex items-center relative">
                  {/* Render additional links for leaders */}
                  <button
                    onClick={handleAdditionalDropdownToggle}
                    className="flex items-center justify-between w-full py-2 px-3 text-black text-black md:text-lg hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600 md:p-0 md:w-auto text-black md:hover:text-green-600 focus:text-black md:hover:bg-transparent hover:text-green-600"
                  >
                    Clubs & Events
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isAdditionalDropdownVisible && (
                    <div className="absolute top-full left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-2">
                      <ul
                        className="py-2 text-sm text-gray-700"
                        aria-labelledby="doubleDropdownButton82"
                      >
                        <li>
                          <a
                            href="/createListing"
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Add Events
                          </a>
                        </li>
                        <li>
                          <a
                            href={`/cEventEdit/${clubName}`}
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Edit Events
                          </a>
                        </li>
                        <li>
                          <a
                            href={`/feedbacksedit/${clubName}`}
                            className="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Feedbacks
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              )}

              <li class="flex items-center mr-0">
                {currentUser &&
                  currentUser.name !== "Onaliy Vinukiy Jayawardana" &&
                  !isLeader && (
                    <span className="block py-2 px-3 text-black md:text-m rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600 md:p-0 text-black md:hover:text-green-600">
                      Welcome, {currentUser.name}
                    </span>
                  )}
              </li>
              <li className="mr-0">
                <button
                  type="button"
                  onClick={currentUser ? handleLogout : handleGoogleLogin}
                  className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-1.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-0"
                >
                  {" "}
                  {currentUser ? "Logout" : "Login"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;

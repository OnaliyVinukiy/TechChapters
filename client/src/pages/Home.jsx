import React from "react";
import { Carousel } from "flowbite-react";
import Header from "../components/Header";
import { useEffect, useState } from "react";
// Assuming the Header component is in a file named Header.js inside a directory named components

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const getHeightStyle = () => {
    if (windowWidth < 640) {
      // Set the height for mobile view
      return { height: "15rem" };
    } else {
      // Set the height for larger screens
      return { height: "35rem" };
    }
  };

  return (
    <div className="relative">
      <div className="relative z-0 mt-14" style={getHeightStyle()}>
        <Carousel
          slideInterval={5000}
          theme={{
            item: {
              base: "absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2",
              wrapper: {
                off: "w-full flex-shrink-0 transform cursor-default snap-center",
                on: "w-full flex-shrink-0 transform cursor-grab snap-center",
              },
            },
            scrollContainer: {
              base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
              snap: "snap-x",
            },
          }}
        >
          <img
            src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/emotion.png"
            alt="..."
            style={{ width: "100%", height: "100%" }}
          />
          <img
            src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/spandana.png"
            alt="..."
            style={{ width: "100%", height: "100%" }}
          />
          <img
            src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/safe.png"
            alt="..."
            style={{ width: "100%", height: "100%" }}
          />
        </Carousel>
      </div>
      <section class="bg-white dark:bg-gray-900">
        <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-5xl dark:text-white">
              Welcome to TechChapters !
            </h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              This is TechChapters where you can find all the technological
              clubs and societies of Sri Lanka under one roof! Explore the
              vibrant tapestry of Sri Lankan clubs and societies – where
              passions unite, talents flourish, and a myriad of events unfold.
            </p>
            <a
              href="/Events"
              class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Explore More
              <svg
                class="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="/Contact"
              class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Contact
            </a>
          </div>
          <div class="mt-3 lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/music.jpg"
              alt="mockup"
              class="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 mt-3">
          <div class="px-4 mx-auto mt-0 text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
            <span class="font-semibold text-gray-400 uppercase">
              STUDENT LIFE IN
            </span>
            <div class="flex flex-col items-center mt-8 text-gray-500 sm:flex-row sm:justify-between">
              <p class="text-5xl lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
                Clubs & Societies of Sri Lankan Universities
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="flex flex-col items-center md:flex-row justify-center mx-auto mt-8">
        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 md:mb-0">
          <a href="#">
            <img
              class="rounded-t-lg w-full h-40 object-cover"
              src="https://raw.githubusercontent.com/OnaliyVinukiy/TechChapters/main/client/src/images/iit.png
"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/clubs">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Institute of Informatics Technology
              </h5>
            </a>

            <a
              href="/FOC"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>

        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 lg:ml-12 md:mb-0">
          <a href="/FOB">
            <img
              class="rounded-t-lg w-full h-40 object-cover"
              src="https://raw.githubusercontent.com/OnaliyVinukiy/TechChapters/main/client/src/images/kdu.jpg
"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/FOB">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Kothalawala Defence Unit
              </h5>
            </a>
            {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
            <a
              href="/FOB"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 lg:ml-12 md:mb-0">
          <a href="/FOE">
            <img
              class="rounded-t-lg"
              src="https://raw.githubusercontent.com/OnaliyVinukiy/TechChapters/main/client/src/images/nsbm.jpg
"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/FOE">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                NSBM Green University
              </h5>
            </a>

            <a
              href="/FOE"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 lg:ml-12 md:mb-0">
          <a href="/FOS">
            <img
              class="rounded-t-lg"
              src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/fos.jpg
"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/FOS">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                University of <br /> Colombo
              </h5>
            </a>
            {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
            <a
              href="/FOS"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 "
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center md:flex-row justify-center mx-auto mt-12">
        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 md:mb-0">
          <a href="/international">
            <img
              class="rounded-t-lg"
              src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/aie.jpg
"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/international">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                University of <br />
                Kelaniya
              </h5>
            </a>
            {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
            <a
              href="/international"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 lg:ml-12 md:mb-0">
          <a href="/Religous">
            <img
              class="rounded-t-lg"
              src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/bud.jpg
"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/Religous">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                University of Moratuwa
              </h5>
            </a>
            {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
            <a
              href="/Religous"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 lg:ml-12 md:mb-0">
          <a href="/activitybased">
            <img
              class="rounded-t-lg"
              src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/act.jpg"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/activitybased">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                University of <br /> Ruhuna
              </h5>
            </a>
            {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
            <a
              href="/activitybased"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
        <div class="w-64 h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 dark:border-gray-700 mb-4 lg:ml-12 md:mb-0">
          <a href="/careerguidance">
            <img
              class="rounded-t-lg"
              src="https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/career.webp
"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="/careerguidance">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                University of Sri Jayawardanapura
              </h5>
            </a>
            {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
            <a
              href="/careerguidance"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Explore Now
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

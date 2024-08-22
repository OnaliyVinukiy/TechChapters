import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(""); // Updated state for club ID
  const [selectedProvince, setSelectedProvince] = useState(""); // State for province
  const [clubs, setClubs] = useState([]); // State for clubs including ID and province
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const database = getDatabase();
    const eventsRef = ref(database, "events");
    const clubsRef = ref(database, "clubs");

    // Fetch events and clubs data
    onValue(eventsRef, (snapshot) => {
      const eventData = snapshot.val();
      const eventList = [];

      for (let id in eventData) {
        eventList.push({ id, ...eventData[id] });
      }

      setEvents(eventList);
    });

    onValue(clubsRef, (snapshot) => {
      const clubsData = snapshot.val();
      const clubList = [];

      for (let id in clubsData) {
        clubList.push({ id, ...clubsData[id] });
      }

      setClubs(clubList);
      setLoading(false);
    });
  }, []);

  const handleClubChange = (event) => {
    setSelectedClubId(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const hasEventsOnDate = (date) => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const generateGoogleCalendarLink = (event) => {
    const { eventName, description, date, time } = event;
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const startFormatted = startDateTime
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const endFormatted = endDateTime.toISOString().replace(/-|:|\.\d+/g, "");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventName
    )}&details=${encodeURIComponent(
      description
    )}&dates=${startFormatted}/${endFormatted}`;
    return calendarUrl;
  };

  // Filter events based on selected club ID and province
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const club = clubs.find((club) => club.id === event.clubId); // Find the club based on clubId
    return (
      (selectedClubId ? event.clubId === selectedClubId : true) &&
      (selectedProvince ? club?.province === selectedProvince : true) &&
      (date ? eventDate.toDateString() === date.toDateString() : true)
    );
  });

  return (
    <div>
      <section className="bg-center bg-no-repeat bg-[url(https://raw.githubusercontent.com/NChapters-Project/NChapters/master/client/src/images/uni.jpg)] bg-gray-700 bg-blend-multiply mt-12">
        <div className="px-4 mx-auto max-w-screen-xl md:h-[20rem] sm:h-[15rem] text-center py-12 lg:py-20">
          <h3 className="mt-8 text-3xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            Events
          </h3>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
        <h1 className="text-center mb-5 text-2xl text-green-600 font-semibold justify-center">
          Event Calander
        </h1>
        <div className="mb-9 justify-center items-center flex ">
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileContent={({ date, view }) => {
              if (view === "month" && hasEventsOnDate(date)) {
                return (
                  <div
                    className="dot"
                    style={{
                      backgroundColor: "red",
                      borderRadius: "50%",
                      width: "8px",
                      height: "8px",
                      margin: "0 auto",
                    }}
                  />
                );
              }
              return null;
            }}
            className="m-0"
          />
        </div>

        <div className="mb-9 flex flex-row gap-5">
          <select
            id="provinceSelect"
            name="provinceSelect"
            onChange={handleProvinceChange}
            value={selectedProvince}
            className="mt-1 block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Provinces</option>
            {Array.from(new Set(clubs.map((club) => club.province))).map(
              (province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              )
            )}
          </select>

          <select
            id="clubSelect"
            name="clubSelect"
            onChange={handleClubChange}
            value={selectedClubId}
            className="mt-1 block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Clubs</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center text-2xl h-32">
            Loading Events...
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {filteredEvents.map((event) => {
                const eventId = event.id;
                const eventImageUrl = event.imageUrl;

                return (
                  <div
                    key={eventId}
                    className="rounded overflow-hidden shadow-lg flex flex-col"
                  >
                    <div className="relative">
                      <img className="w-full" src={eventImageUrl} alt="Event" />
                      <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                      <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                        {event.clubName}
                      </div>
                    </div>
                    <div className="px-6 py-4 mb-auto">
                      <Link
                        to={`/eview/${eventId}/${encodeURIComponent(
                          eventImageUrl
                        )}/${event.clubName}/${event.description}`}
                        className="font-medium text-lg  hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2"
                      >
                        {event.eventName}
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">
                        {event.minidescription}
                      </p>
                      <Link
                        className="text-green-700 font-extrabold"
                        to={`/eview/${eventId}/${encodeURIComponent(
                          eventImageUrl
                        )}/${event.clubName}/${event.description}`}
                      >
                        See more details...
                      </Link>
                    </div>
                    <div className="flex justify-between items-center mb-2 px-6 py-3">
                      <div className="flex space-x-2">
                        <a
                          href={event.participateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue border-2 border-blue-500 bg-gradient-to-r from-white-500 via-white-600 to-white-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                          Participate
                        </a>
                        <a
                          href={event.volunteerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                          Volunteer
                        </a>
                      </div>
                      <a
                        href={generateGoogleCalendarLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-indigo-600"
                        title="Add to Google Calendar"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12h4.5M15 12l3.75 3.75M15 12l3.75-3.75M3 6h18M3 6v12a2 2 0 002 2h12a2 2 0 002-2V6M3 6h18M3 6v12a2 2 0 002 2h12a2 2 0 002-2V6"
                          />
                        </svg>
                      </a>
                    </div>
                    <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                      <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                        <svg className="h-6 mr-3" viewBox="0 0 512 512">
                          <g>
                            <g>
                              <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z"></path>
                            </g>
                          </g>
                        </svg>
                        <span className="ml-1">{event.date}</span>
                      </span>
                      <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                        <svg className="h-6 mr-3" viewBox="0 0 512 512">
                          <g>
                            <g>
                              <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z"></path>
                            </g>
                          </g>
                        </svg>
                        <span className="ml-1">{event.time}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Events;

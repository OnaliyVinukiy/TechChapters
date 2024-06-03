import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import Feedback from "./Feedback";
import { useSelector } from 'react-redux';

export default function Eview() {
    const params = useParams();
    const [event, setEvent] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        const database = getDatabase();
        const eventsRef = ref(database, 'events');

        onValue(eventsRef, (snapshot) => {
            const eventData = snapshot.val();
            for (let id in eventData) {
                if (id === params.id) {
                    setEvent({ id, ...eventData[id] });
                    break; // Exit loop once the event is found
                }
            }
        });
    }, [params.id]);

    return (
        <div className="mt-20 mb-10 text-center place-content-center">
            {event && (
              <>
                <section className="bg-center bg-green-800 bg-blend-multiply mt-5 mb-5 p-5">
                    <h3 className="text-xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-3xl">{event.eventName}</h3>
                </section>
                
                <div key={event.id} className="rounded overflow-hidden flex flex-col pl-20 pr-20 mb-10">
                  <div className="relative">
                      <img className="w-full" src={event.imageUrl} alt="Event" style={{ maxWidth: '100%', height: 'auto' }} />
                  </div>
                </div>
                <div className="">
                    <div className="mb-5">
                        <h1 className="text-green-700 text-3xl font-extrabold">Event Description</h1>
                    </div>
                    <div className="text-xl mt-5 mb-5 ">
                    <p className="pb-20 pr-10 pl-10 text-center font-medium ">{event.description}</p>
                    </div>
                </div>
                <div className="pb-10 ">
                    {currentUser ? (
                      <Feedback eventId={event.id} eventName={event.eventName} clubName={event.clubName} />

                    ) : (
                      <p class="text-center text-bold text-xl text-blue-700">We value your Feedback. Please log in to leave feedback for the event!</p>
                    )}
                </div>
              </>
            )}
        </div>
    );
}

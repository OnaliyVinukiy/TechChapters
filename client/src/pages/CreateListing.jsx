import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDatabase, ref, push, onValue, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { query, orderByChild, equalTo } from 'firebase/database';
import emailjs from 'emailjs-com'; // Import EmailJS library
import { useParams } from 'react-router-dom';
const CreateListing = () => {
  const [subscribedEmails, setSubscribedEmails] = useState({});
  const [formData, setFormData] = useState({
    eventName: '',
    time: '',
    date: '',
    minidescription: '',
    description: '',
    image: null,
    clubName: '',
    volunteerLink: '',
    participateLink: ''
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [clubNames, setClubNames] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { clubName } = useParams();
  useEffect(() => {
    const database = getDatabase();
    const leadersRef = ref(database, 'leaders');

    const fetchLeaderUsernames = () => {
      onValue(leadersRef, (snapshot) => {
        console.log('Snapshot:', snapshot.val());
        if (snapshot.exists()) {
          const leaderData = snapshot.val();
          const leaderUsernames = Object.values(leaderData).map((leader) => leader.username.trim());

          console.log('Leader Usernames:', leaderUsernames);
          console.log('Current User:', currentUser.name);

          const currentUserNormalized = currentUser.name.replace(/\s+/g, ' ').trim();

          let isLeader = false;
          leaderUsernames.forEach((leaderUsername) => {
            if (currentUserNormalized && currentUserNormalized.toLowerCase() === leaderUsername.toLowerCase()) {
              isLeader = true;
            }
          });
          console.log('Is Leader:', isLeader);
          setIsLeader(isLeader);

          // Fetch club name for the current leader
          if (isLeader) {
            const currentLeaderData = Object.values(leaderData).find((leader) => leader.username.trim().toLowerCase() === currentUserNormalized.toLowerCase());
            setFormData((prevFormData) => ({
              ...prevFormData,
              clubName: currentLeaderData.club
            }));
          }
        }
      });
    };

    if (!isDataFetched) {
      fetchLeaderUsernames();
      setIsDataFetched(true);
    }

    return () => {

    };
  }, [currentUser, isDataFetched]);

  useEffect(() => {
    const database = getDatabase();
    const clubNamesRef = ref(database, 'clubs');

    get(clubNamesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const clubNamesData = snapshot.val();
          const clubNamesList = Object.keys(clubNamesData).map((key) => clubNamesData[key].name);
          setClubNames(clubNamesList);
        }
      })
      .catch((error) => {
        console.error('Error fetching club names: ', error);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  useEffect(() => {
    const database = getDatabase();
    const subscribersRef = ref(database, 'subscribers');

    // Fetch subscribed emails from Firebase
    onValue(subscribersRef, (snapshot) => {
      const subscribedData = snapshot.val();
      console.log('Subscribed Data:', subscribedData);
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
    const imagesRef = storageRef(storage, 'images/' + formData.image.name);
    let clubId;

    uploadBytes(imagesRef, formData.image)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((imageUrl) => {
        const clubsRef = ref(database, 'clubs');
        return get(clubsRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const clubsData = snapshot.val();
              clubId = Object.keys(clubsData).find((key) => clubsData[key].name === formData.clubName);

              return push(ref(database, 'events'), {
                ...formData,
                imageUrl: imageUrl,
                clubId: clubId
              });
            } else {
              console.log('No clubs found');
            }
          });
      })
      .then(() => {
        console.log('Event added successfully!');
        console.log('Club ID:', clubId);
        setSuccess(true);
        setErrorMessage('');
        setLoading(false);

        if (clubId) {
          const subscribersRef = ref(database, 'subscribers');
          const clubSubscribersQuery = query(subscribersRef, orderByChild('clubId'), equalTo(clubId));

          onValue(clubSubscribersQuery, (snapshot) => {
            const subscribedData = snapshot.val();
            console.log('Subscribed Data:', subscribedData);
            if (subscribedData) {
              const subscriberEmails = Object.values(subscribedData).map(subscriber => subscriber.email);

              // Send emails to subscribers
              const EMAILJS_SERVICE_ID = 'service_clqpoal';
              const EMAILJS_TEMPLATE_ID = 'template_3chyey3';
              const EMAILJS_USER_ID = 'GLteqOVgIa1pN5Mul';

              subscriberEmails.forEach((email) => {
                const template_params = {
                  email: email,
                  eventName: formData.eventName,
                  clubName: formData.clubName,
                  description: formData.description

                };

                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, template_params, EMAILJS_USER_ID)
                  .then((response) => {
                    console.log('Email sent successfully to:', email);
                  })
                  .catch((error) => {
                    console.error('Error sending email to:', email, error);
                  });
              });

            } else {
              console.log('No subscribers found for the club:', clubId);
            }
          });
        } else {
          console.log('No club ID found.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Error submitting data: ' + error.message);
        setLoading(false);
      });
  };

  const renderClubSelection = () => {
    const isAdmin = currentUser.name === 'OV Jayawardana';
    const filteredClubNames = isAdmin ? clubNames : clubNames.filter((clubName) => clubName === formData.clubName);
    return (
      <select
        id="clubName"
        value={formData.clubName}
        onChange={handleChange}
        required
      >
        <option value="">Select Club</option>
        {filteredClubNames.map((clubName, index) => (
          <option key={index} value={clubName}>{clubName}</option>
        ))}
      </select>
    );
  };
  useEffect(() => {
    const database = getDatabase();
    const leadersRef = ref(database, 'leaders');

    const fetchLeaderUsernames = () => {
      onValue(leadersRef, (snapshot) => {
        if (snapshot.exists()) {
          const leaderData = snapshot.val();
          
          const currentUserLeader = Object.values(leaderData).find(leader => leader.username === currentUser?.name);
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
    return () => {
      
    };
  }, [currentUser, clubName, isDataFetched]);
  if (!isLeader && currentUser?.name !== 'OV Jayawardana') {
    return (
      <div>
        <p class="mt-56 text-3xl text-center">You do not have access to this page.</p>
      </div>
    );
  }
  return (
    <div>
      {(isLeader || currentUser.name === 'OV Jayawardana') && (
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h1 className="mb-4 text-xl text-center font-bold text-gray-900 dark:text-white mt-24">Add a New Event</h1>

            <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
                <label htmlFor="eventName" className="block text-m font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  id="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                  style={{ width: '100%', height: '62.5px', fontSize: '1.2rem', maxWidth: '100%' }}
                  placeholder="Enter event name"
                  required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="clubName" className="m-3">Club Name</label>
                {renderClubSelection()}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="time" className="block text-m font-medium text-gray-700 mb-1">Time</label>
                <input type="time" id="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500" style={{ width: '100%', height: '62.5px', fontSize: '1.2rem', maxWidth: '100%' }} placeholder="Enter event time" required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="date" className="block text-m font-medium text-gray-700 mb-1">Date</label>
                <input type="date" id="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500" style={{ width: '100%', height: '62.5px', fontSize: '1.2rem', maxWidth: '100%' }} placeholder="Enter event date" required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="minidescription" className="block text-sm font-medium text-gray-700 mb-1">Mini Description</label>
                <input type="text" id="minidescription" value={formData.minidescription} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500" style={{ width: '100%', height: '62.5px', fontSize: '1.2rem', maxWidth: '100%' }} placeholder="Enter event mini description" required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-m font-medium text-gray-700 mb-1">Description</label>
                <textarea id="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500" style={{ width: '100%', height: '187.5px', fontSize: '1.2rem', maxWidth: '100%' }} placeholder="Enter event description" required></textarea>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="image" className="m-3">Image</label>
                <input type="file" id="image" onChange={handleChange} accept="image/*" required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="volunteerLink" className="block text-m font-medium text-gray-700 mb-1">Volunteer Link</label>
                <input type="url" id="volunteerLink" value={formData.volunteerLink} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500" style={{ width: '100%', height: '62.5px', fontSize: '1.2rem', maxWidth: '100%' }} placeholder="Enter volunteer link" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="participateLink" className="block text-m font-medium text-gray-700 mb-1">Participate Link</label>
                <input type="url" id="participateLink" value={formData.participateLink} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500" style={{ width: '100%', height: '62.5px', fontSize: '1.2rem', maxWidth: '100%' }} placeholder="Enter participate link" />
              </div>
              </div>
              <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.133 0-4.069-.836-5.542-2.209l1.554-1.5z"></path>
                  </svg>
                ) : (
                  'Add Event'
                )}
              </button>
            </form>
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errorMessage}</div>
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
}
export default CreateListing;

// Importing necessary libraries and modules
import React, { useState, useEffect } from 'react';// React hooks for managing state and side effects
import axios from 'axios'; // Axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Navigation hook from React Router
import { FaArrowLeft } from 'react-icons/fa'; // Icon library
import Modal from 'react-modal'; // Modal component for pop-up forms

function CurrentAssist() {
   // State variables to manage various aspects of the component
  const [bookingConfirmation, setBookingConfirmation] = useState('None');
  const [bookingId, setBookingId] = useState('');
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState(''); 
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerLocation, setCustomerLocation] = useState({ lat: null, lng: null });
  const [allocatedVolunteer, setAllocatedVolunteer] = useState('');
  const [volunteerLocation, setVolunteerLocation] = useState({ lat: null, lng: null });
  const [isRated, setIsRated] = useState(false);  
  const navigate = useNavigate();

  // Function to start navigation to mapRide page if both volunteer and customer locations are available
  const handleStartNavigation = () => {
    if (volunteerLocation.lat !== null && customerLocation.lat !== null) {
      // Navigate to the mapRide page with both customer and volunteer locations
      navigate('/mapRide', {
        state: {
          startLat: volunteerLocation.lat,
          startLng: volunteerLocation.lng,
          custLat: customerLocation.lat,
          custLong: customerLocation.lng,
        },
      });
    } else {
      setErrorMessage("Volunteer or customer location is missing");
    }
  };

  // Fetch volunteer first name and email details
  useEffect(() => {
    const fetchVolunteerStatus = async () => {
      try {
        const driverEmail = localStorage.getItem('driver') || '';

        if (driverEmail) {
          // Make a GET request to verify volunteer status using the driver's email
          const response = await axios.get(`http://localhost:8888/api/verify-volunteer/${driverEmail}`);

          if (response.data && response.data.firstName) {
            // Set volunteer name and email if available
            response.data.status ? setVolunteerName(response.data.firstName) : setVolunteerName("");
            setVolunteerEmail(driverEmail);
          } else {
            setErrorMessage('Volunteer not found or no firstName available.');
          }
        } else {
          setErrorMessage('No driver found');
        }
      } catch (error) {
        setErrorMessage('Error fetching the volunteer status. Please try again.');
        console.error('Error:', error);
      }
    };

    fetchVolunteerStatus();
  }, []);

  // Fetch booking status and check if the ride is already rated
  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const customerEmailId = localStorage.getItem('emailId');
        
        if (customerEmailId) {
          // Make a GET request to fetch booking status using customer email
          const response = await axios.get(`http://localhost:8888/api/booking-status/${customerEmailId}`);
    
          if (response.data && response.data.booking) {
            const { _id, bookingStatus, custLocationLat, custLocationLong, allocatedVolunteer, isRated } = response.data.booking; // Get isRated
            setBookingConfirmation(bookingStatus);
            setCustomerLocation({ lat: custLocationLat, lng: custLocationLong });
            setBookingId(_id);
            setIsRated(isRated);
            localStorage.setItem('bookingId', _id);

            if (allocatedVolunteer) {
              await fetchVolunteerLocation(allocatedVolunteer);  // Fetch volunteer location if available
            }
          } else {
            setBookingConfirmation('No booking found');
          }
        } else {
          setBookingConfirmation('Customer email not found');
        }
      } catch (error) {
        console.error('Error fetching booking status:', error);
        setBookingConfirmation('Error fetching booking status');
      }
    };
  
    fetchBookingStatus();
  }, []);
  
  // Handle form submission to send ride feedback and rating
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating) {
      try {
        // Post rating and feedback to the server
        const response = await axios.post('http://localhost:8888/api/currentassist', {
          bookingConfirmation,
          volunteerName,
          rating,
          feedback
        });

        if (response.status === 201) {
          // Display success message if submission is successful
          setConfirmationMessage('Your details have been successfully submitted.');
          setErrorMessage('');
        }
      } catch (error) {
        setErrorMessage('Error submitting the details. Please try again.');
        setConfirmationMessage('');
        console.error('Error:', error);
      }
    } 
  };

  // Fetch the volunteer's current location based on their email
  const fetchVolunteerLocation = async (volunteerEmail) => {
    try {
      const response = await axios.get(`http://localhost:8888/api/volunteer-location/${volunteerEmail}`);
      
      if (response.data) {
        // Set volunteer location if available
        const { lat, lng } = response.data;
        setVolunteerLocation({ lat, lng });
      } else {
        console.error('Volunteer location not found');
      }
    } catch (error) {
      console.error('Error fetching volunteer location:', error);
    }
  };

  // Functions to open and close the modal for rating submission
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

   // Handle rating and feedback submission from the modal
  const handleModalSubmit = async () => {
    if (isRated) {
      // Prevent multiple ratings if the ride has already been rated
      setErrorMessage('You have already rated this ride.');  // Prevent multiple ratings
      return;
    }

    if (rating) {
      try {
        const bookingId = localStorage.getItem('bookingId'); 
        const response = await axios.post(`http://localhost:8888/api/booking/${bookingId}/rating`, {
          rating,
          feedback
        });
  
        if (response.status === 200) {
          // Display confirmation message and mark ride as rated
          setConfirmationMessage('Thank you for your feedback.');
          setErrorMessage('');
          setIsRated(true); 
          closeModal();
        }
        localStorage.removeItem('bookingId');
      } catch (error) {
        setErrorMessage('Error submitting your feedback. Please try again.');
        console.error('Error:', error);
      }
    } else {
      setErrorMessage('Please enter a rating before submitting.');
    }
  };

    // Function to remove the volunteer from localStorage and navigate back to customer page
  const removeDriver = () => {
    localStorage.removeItem('driver');
    navigate('/customerPage');
  };

   // JSX structure for the component's UI
  return (
    <div style={containerStyle}>
      {/* Back button to navigate to customer page */}
      <div
        style={{ position: 'absolute', left: '5px', top: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>
      <div style={formContainerStyle}>
        <h2 style={headerStyle}>Current Assistance</h2>

        {/* Booking status and feedback form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Booking Confirmation:</label>
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '18px',
                color:
                  bookingConfirmation === 'Pending'
                    ? 'orange'
                    : bookingConfirmation === 'Confirmed'
                    ? 'green'
                    : 'gray',
              }}>
              {bookingConfirmation}
            </p>
          </div>

           {/* Volunteer details */}
          <div style={formGroupStyle}>
            <label htmlFor="volunteerName" style={labelStyle}>Volunteer Allocated Name:</label>
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '18px',
              }}>
              {volunteerName || "No Driver allocated yet"}
            </p>
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="volunteerEmail" style={labelStyle}>Volunteer Email ID:</label>
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '18px',
              }}>
              {volunteerEmail || "No Email available"}
            </p>
          </div>

          {/* Buttons for viewing ride on the map, opening the modal for rating, and closing the ride */}
          <button type="button" style={{ ...buttonStyle, marginTop: '10px' }} onClick={handleStartNavigation}> View Ride on Map</button>

          <button type="button" style={{ ...buttonStyle, marginTop: '10px' }} onClick={openModal}>
            Rate Your Ride
          </button>
          <button type="submit" style={buttonStyle} onClick={()=>removeDriver()}>Close the Ride</button>
        </form>

        {/* Success or error messages */}
        {confirmationMessage && (
          <p style={confirmationStyle}>{confirmationMessage}</p>
        )}

        {errorMessage && (
          <p style={errorStyle}>{errorMessage}</p>
        )}
      </div>
      {/* Modal for rating the ride */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Rate Your Ride"
        style={modalStyles}
        ariaHideApp={false}
      >
        <h2 style={modalHeaderStyle}>Rate Your Ride</h2>
        {/* Rating and feedback input fields */}
        <div style={formGroupStyle}>
          <label htmlFor="rating" style={labelStyle}>Post Completion Rating:</label>
          <div>
            {[1, 2, 3, 4, 5].map((rate) => (
              <label key={rate} style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  value={rate}
                  checked={rating === String(rate)}
                  onChange={(e) => setRating(e.target.value)}
                />
                {rate}
              </label>
            ))}
          </div>
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="feedback" style={labelStyle}>Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback"
            rows="4"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        
        {/* Modal buttons for submitting feedback or closing modal */}
        <button onClick={handleModalSubmit} style={buttonStyle}>Submit</button>
        <button onClick={closeModal} style={{ ...buttonStyle, backgroundColor: 'red', marginLeft: '10px' }}>Close</button>
      </Modal>
    </div>
  );
}

// CSS styles for the component
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: 'yellow',
  backgroundSize: 'cover',
};

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'yellow',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '600px',
};

const headerStyle = {
  color: 'blue',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  textDecoration: 'underline',
  fontSize: '40px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
};

const formGroupStyle = {
  marginBottom: '1rem',
  width: '100%',
};

const labelStyle = {
  display: 'block',
  textAlign: 'left',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem',
};

const confirmationStyle = {
  marginTop: '1.5rem',
  color: 'green',
  fontWeight: 'bold',
};

const errorStyle = {
  marginTop: '1.5rem',
  color: 'red',
  fontWeight: 'bold',
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

const modalHeaderStyle = {
  color: 'blue',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  fontSize: '24px'
};

export default CurrentAssist;
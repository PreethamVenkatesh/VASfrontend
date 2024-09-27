import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Modal from 'react-modal';

function CurrentAssist() {
  const [bookingConfirmation, setBookingConfirmation] = useState('None');
  const [volunteerName, setVolunteerName] = useState('');
  const [ratings, setRatings] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteerStatus = async () => {
      try {
        console.log("Fetching volunteer status");
        
        const driverEmail = localStorage.getItem('driver') || '';

        if (driverEmail) {
          const response = await axios.get(`http://localhost:8888/api/verify-volunteer/${driverEmail}`);

          if (response.data && response.data.firstName) {

            {response.data.bookingStatus === "Completed" ? 
              setVolunteerName(response.data.firstName)
              : setVolunteerName("")
            }

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

  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const customerEmailId = localStorage.getItem('emailId');
  
        if (customerEmailId) {
          const response = await axios.get(`http://localhost:8888/api/booking-status/${customerEmailId}`);
          
          if (response.data && response.data.bookingStatus) {
            setBookingConfirmation(response.data.bookingStatus);
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ratings) {
      try {
        const response = await axios.post('http://localhost:8888/api/currentassist', {
          bookingConfirmation,
          volunteerName,
          ratings,
          feedback
        });

        if (response.status === 201) {
          setConfirmationMessage('Your details have been successfully submitted.');
          setErrorMessage('');
        }
      } catch (error) {
        setErrorMessage('Error submitting the details. Please try again.');
        setConfirmationMessage('');
        console.error('Error:', error);
      }
    } 
    // else {
    //   setConfirmationMessage('');
    //   setErrorMessage('Please fill in all required fields.');
    // }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleModalSubmit = async () => {
    if (ratings) {
      try {
        const response = await axios.post('http://localhost:8888/api/currentassist/ratings', {
          ratings,
          feedback
        });

        if (response.status === 201) {
          setConfirmationMessage('Thank you for your feedback.');
          setErrorMessage('');
          closeModal();
        }
      } catch (error) {
        setErrorMessage('Error submitting your feedback. Please try again.');
        console.error('Error:', error);
      }
    } else {
      setErrorMessage('Please enter a rating before submitting.');
    }
  };

  const removeDriver = () => {
    setTimeout(() => {
      localStorage.removeItem('driver');
      console.log('Driver data removed from localStorage after 10 minutes');
    }, 600000); // 10 minutes
    navigate('/customerPage');
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div
          style={{ position: 'absolute', left: '5px', top: '290px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => navigate('/customerPage')}>
          <FaArrowLeft size={30} color="blue" />
        </div>
        <h2 style={headerStyle}>Current Assistance</h2>
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
                    : bookingConfirmation === 'Completed'
                    ? 'green'
                    : 'gray',
              }}>
              {bookingConfirmation}
            </p>
          </div>

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

          <button type="button" style={{ ...buttonStyle, marginTop: '10px' }} onClick={openModal}>
            Rate Your Ride
          </button>
          <button type="submit" style={buttonStyle} onClick={()=>removeDriver()}>Close the Ride</button>
        </form>

        {confirmationMessage && (
          <p style={confirmationStyle}>{confirmationMessage}</p>
        )}

        {errorMessage && (
          <p style={errorStyle}>{errorMessage}</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Rate Your Ride"
        style={modalStyles}
        ariaHideApp={false}
      >
        <h2 style={modalHeaderStyle}>Rate Your Ride</h2>
        <div style={formGroupStyle}>
          <label htmlFor="ratings" style={labelStyle}>Post Completion Ratings:</label>
          <input
            type="number"
            id="ratings"
            value={ratings}
            onChange={(e) => setRatings(e.target.value)}
            placeholder="Enter ratings (1-5)"
            min="1"
            max="5"
            style={inputStyle}
          />
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

        <button onClick={handleModalSubmit} style={buttonStyle}>Submit</button>
        <button onClick={closeModal} style={{ ...buttonStyle, backgroundColor: 'red', marginLeft: '10px' }}>Close</button>
      </Modal>
    </div>
  );
}

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
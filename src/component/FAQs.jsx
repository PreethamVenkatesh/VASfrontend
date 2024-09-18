import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I request an ambulance using the app?",
      answer:
        "To request an ambulance, open the app, tap on the “Request Assistance” button on the main screen, and fill in the necessary details like your location, type of emergency, and contact information. Once submitted, the nearest available ambulance will be dispatched.",
    },
    {
      question: "Is there any cost for using the voluntary ambulance service?",
      answer:
        "Voluntary ambulance services are free of charge."
    },
    {
      question: "How do I track the ambulance after I’ve requested it?",
      answer:
        "After requesting an ambulance, you can track its location in real time within the app. A map will show the ambulance's current position and estimated arrival time.",
    },
    {
      question: "Can I cancel my ambulance request?",
      answer:
        "Yes, you can cancel your ambulance request if it is no longer needed. Simply go to the “Current Assistance” section in the app, find your request, and tap “Cancel.”",
    },
    {
      question: "What information should I provide when requesting an ambulance?",
      answer:
        "You’ll need to provide your exact location and the destination hospital location.",
    },
    {
      question: "How long will it take for the ambulance to arrive?",
      answer:
        "Arrival times vary depending on your location and the availability of ambulances. The app provides an estimated time of arrival once your request is processed.",
    },
    {
      question: "Can I pre-book an ambulance for a non-emergency situation?",
      answer:
        "Yes, you can pre-book an ambulance for non-emergency transport, such as hospital appointments or patient transfers. Use the “Book Future Assistance” option in the app and select your preferred time and date.",
    },
    {
      question: "Can I volunteer as an ambulance driver or medic through the app?",
      answer:
        "Yes, we are always looking for volunteers! Head over to the “Help” section of the app, email regarding the interest to the mentioned email ID.",
    },
    {
      question: "What if I don’t have an internet connection during an emergency?",
      answer:
        "If you don’t have an internet connection, you can still call our emergency helpline directly from the “Help” section of the app.",
    },
    {
      question: "What if I need special medical equipment during the transport?",
      answer:
        "Sorry, the ambulance service supports only non-emergency cases and hence any support with medical equipment cannot be provided.",
    },
    {
      question: "How can I provide feedback on the service I received?",
      answer:
        "We value your feedback! During your ambulance ride, you’ll be prompted to rate the service and leave feedback in the “Current Assistance” section of the app.",
    },
    {
      question: "Is there a way to donate to support the voluntary ambulance service?",
      answer:
        "Yes, you can donate. Please drop an email to the email ID mentioned in the “Help” section of the app regarding the same and further details will be provided.",
    },
    {
      question: "What should I do if I experience issues with the app?",
      answer:
        "If you encounter technical difficulties, please contact our support team through the “Help” section in the app.",
    },
    {
      question: "Can I request an ambulance for someone else?",
      answer:
        "Yes, you can request an ambulance for another person. Be sure to provide their location accurately in the app.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'yellow' }}>
      <div
        style={{position: 'absolute',left: '80px',top: '30px',cursor: 'pointer',display: 'flex',alignItems: 'center'}}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>
      <h1 style={{ color: 'blue', fontWeight: 'bold',textDecoration: 'underline',fontSize: '40px'}}>FAQs</h1>
      <div style={{ maxWidth: '800px', margin: 'auto' , fontSize: '25px'}}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => toggleFAQ(index)}
              style={{
                padding: '15px',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: openIndex === index ? '#e6f7ff' : 'white',
                color: openIndex === index ? '#333' : 'blue',
              }}
            >
              {faq.question}
            </div>
            {openIndex === index && (
              <div style={{ padding: '15px', backgroundColor: '#f9f9f9', color: '#555' }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQs;

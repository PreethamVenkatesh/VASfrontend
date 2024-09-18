import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function Help() {
  const googleDriveVideoLink = 'https://drive.google.com/file/d/1a6MCYeJq06C1PrMmSEq0R4eSvHeFtWnT/preview';
  const navigate = useNavigate();
  return (
    <div style={containerStyle}>
      <div
        style={{position: 'absolute',left: '80px',top: '30px',cursor: 'pointer',display: 'flex',alignItems: 'center'}}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>
      <h1 style={headerStyle}>Help</h1>
      <div style={formContainerStyle}>
        <form style={formStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="helplineNumber" style={labelStyle}>Helpline Number</label>
            <input
              type="text"
              id="helplineNumber"
              value="+447435011781"
              readOnly
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="emailID" style={labelStyle}>Email ID</label>
            <input
              type="text"
              id="emailID"
              value="volambulance@gmail.com"
              readOnly
              style={inputStyle}
            />
          </div>

          <div style={videoContainerStyle}>
            <label htmlFor="videoPlayer" style={labelStyle}>Navigation Help Video</label>
            <iframe
              src={googleDriveVideoLink}
              title="Navigation Help Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={iframeStyle}
            ></iframe>
          </div>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  backgroundColor: 'yellow',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem',
};

const headerStyle = {
  color: 'blue',
  textDecoration: 'underline',
  fontSize: '40px',
  fontWeight: 'bold', 
  marginBottom: '2rem',
  textAlign: 'center',
  width: '100%',
};

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px',
};

const formStyle = {
  backgroundColor: 'yellow',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
};

const formGroupStyle = {
  marginBottom: '1rem',
  width: '100%',
};

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  textAlign: 'center',
};

const videoContainerStyle = {
  marginTop: '1rem',
  textAlign: 'center',
};

const iframeStyle = {
  width: '100%',
  height: '500px',
  border: 'Black',
};

export default Help;

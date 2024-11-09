// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQRCode from 'react-qr-code';  // Import the QR code library

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    idNumber: '',
    password: '',
  });
  const [serialNumber, setSerialNumber] = useState(null); // State to store the serial number
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateSerialNumber = () => {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    let serialNumber;
    let unique = false;

    while (!unique) {
      serialNumber = Math.floor(10000000 + Math.random() * 90000000); // 8-digit serial number
      unique = !existingUsers.some((user) => user.serialNumber === serialNumber);
    }
    return serialNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.idNumber || !formData.password) {
      setError('All fields are required!');
      return;
    }

    // Validate age is a positive number
    if (formData.age <= 0) {
      setError('Please enter a valid age.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some((user) => user.idNumber === formData.idNumber);

    if (userExists) {
      setError('A user with this ID number already exists!');
      return;
    }

    const userSerialNumber = generateSerialNumber();
    setSerialNumber(userSerialNumber); // Set the serial number to state

    const userData = {
      ...formData,
      serialNumber: userSerialNumber,
      verified: false,
    };

    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Generate the QR code for the serial number
    const qrCodeData = JSON.stringify({
      serialNumber: userSerialNumber, // Make the serial number the QR code content
    });

    // Store QR code data in localStorage
    localStorage.setItem('qrCodeData', qrCodeData);

    alert('Registration successful!');
    navigate('/login');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div>
          <label>ID Number:</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>

      {/* Display the generated serial number */}
      {serialNumber && (
        <div style={{ marginTop: '20px' }}>
          <p>Serial Number: {serialNumber}</p>
          <div>
            <ReactQRCode value={JSON.stringify({ serialNumber })} size={128} />
          </div>
        </div>
      )}

      <button onClick={() => navigate('/login')} style={{ marginTop: '10px' }}>
        Already have an account?
      </button>
    </div>
  );
};

export default Register;

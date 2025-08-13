import React, { useState, useEffect } from 'react';
import './index.css'; 

import logo from './assets/logo.png'; 

// Main App component
function App() {
  const [step, setStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [entrepreneurName, setEntrepreneurName] = useState('');
  const [hasConsent, setHasConsent] = useState(false);
  const [aadhaarError, setAadhaarError] = useState('');
  const [consentError, setConsentError] = useState('');
  
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panError, setPanError] = useState('');

  // New states for the registration form fields
  const [organizationType, setOrganizationType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [nicCode, setNicCode] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  // A valid dummy Aadhaar number that passes the Luhn check for testing.
  const validAadhaarForTesting = '381467472016';
  const mockOtpForTesting = '123456';
  
  // This useEffect will automatically fill the form for easier testing.
  useEffect(() => {
    setAadhaarNumber(validAadhaarForTesting);
  }, []);

  const handleAadhaarSubmit = async (event) => {
    event.preventDefault();

    setAadhaarError('');
    setConsentError('');
    let isValid = true;

    // Simplified validation check: only confirms it is a 12-digit number.
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      setAadhaarError('Aadhaar number must be a 12-digit number.');
      isValid = false;
    }

    if (!hasConsent) {
      setConsentError('You must agree to the terms and conditions.');
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/aadhaar-validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhaarNumber, entrepreneurName }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setStep(2); 
        } else {
          setAadhaarError(data.message || 'An error occurred during Aadhaar validation.');
        }
      } catch (error) {
        setAadhaarError('Network error. Failed to connect to the backend.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    setOtpError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/otp-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber, otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep(3); 
      } else {
        setOtpError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setOtpError('Network error. Failed to connect to the backend.');
    }
  };

  const handlePanSubmit = async (event) => {
    event.preventDefault();
    setPanError('');

    try {
      const response = await fetch('http://localhost:3001/api/pan-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panNumber }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep(4); // Move to the full registration form
      } else {
        setPanError(data.message || 'An error occurred during PAN validation.');
      }
    } catch (error) {
      setPanError('Network error. Failed to connect to the backend.');
    }
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    setRegistrationError('');

    const registrationData = {
      aadhaarNumber,
      entrepreneurName,
      panNumber,
      organizationType,
      businessName,
      businessAddress,
      bankAccount,
      ifscCode,
      businessActivity,
      nicCode,
      numEmployees,
    };
    
    if (!organizationType || !businessName || !bankAccount || !ifscCode || !businessActivity || !nicCode) {
      setRegistrationError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/submit-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        alert('Registration submitted successfully!');
      } else {
        setRegistrationError(data.message || 'Failed to submit registration.');
      }
    } catch (error) {
      setRegistrationError('Network error. Failed to submit registration.');
    }
  };

  return (
    <div className="homepage-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img 
              src={logo}
              alt="Ministry Logo" 
              className="logo"
            />
            <div className="logo-text">
              <span className="logo-text-hindi">सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</span>
              <span className="logo-text-english">Ministry of Micro, Small & Medium Enterprises</span>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">NIC Code-</a>
            <a href="#" className="nav-link">Useful Documents</a>
            <a href="#" className="nav-link">Print / Verify</a>
            <a href="#" className="nav-link">Update Details</a>
            <a href="#" className="nav-link login-button">Login</a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="aadhaar-card">
          <div className="card-header">
            {step === 1 && <h1>Aadhaar Verification With OTP</h1>}
            {step === 2 && <h1>OTP Verification</h1>}
            {step === 3 && <h1>PAN Validation</h1>}
            {step === 4 && <h1>Udyam Registration Form</h1>}
          </div>
          
          {step === 1 && (
            <form className="aadhaar-form" onSubmit={handleAadhaarSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="aadhaar-number">1. Aadhaar Number/आधार संख्या</label>
                  <input
                    type="text"
                    id="aadhaar-number"
                    placeholder="Your Aadhaar No"
                    className={`form-input ${aadhaarError ? 'input-error' : ''}`}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                  />
                  {aadhaarError && <div className="error-message">{aadhaarError}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="entrepreneur-name">2. Name of Entrepreneur/उद्यमी का नाम</label>
                  <input
                    type="text"
                    id="entrepreneur-name"
                    placeholder="Name as per Aadhaar"
                    className="form-input"
                    value={entrepreneurName}
                    onChange={(e) => setEntrepreneurName(e.target.value)}
                  />
                </div>
              </div>
              <ul className="info-list">
                <li>Aadhaar number shall be required for Udyam Registration.</li>
                <li>The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).</li>
                <li>In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust, the organisation or its authorised signatory shall provide its GSTIN and PAN along with its Aadhaar number.</li>
              </ul>
              <div className="consent-checkbox-container">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  className="consent-checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                />
                <label htmlFor="consent-checkbox" className="consent-label">
                  I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME...
                </label>
                {consentError && <div className="error-message">{consentError}</div>}
              </div>
              <div className="button-container">
                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? 'Generating OTP...' : 'Generate OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="otp-form" onSubmit={handleOtpSubmit}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  className={`form-input ${otpError ? 'input-error' : ''}`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {otpError && <div className="error-message">{otpError}</div>}
              </div>
              <div className="button-container">
                <button type="submit" className="submit-button">
                  Validate OTP
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="pan-form" onSubmit={handlePanSubmit}>
              <div className="form-group">
                <label htmlFor="pan-number">Enter PAN Number</label>
                <input
                  type="text"
                  id="pan-number"
                  placeholder="e.g., ABCDE1234F"
                  className={`form-input ${panError ? 'input-error' : ''}`}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                />
                {panError && <div className="error-message">{panError}</div>}
              </div>
              <div className="button-container">
                <button type="submit" className="submit-button">
                  Validate PAN
                </button>
              </div>
            </form>
          )}
          
          {step === 4 && (
            <form className="registration-form" onSubmit={handleRegistrationSubmit}>
              {registrationError && <div className="error-message">{registrationError}</div>}
              <div className="form-group">
                <label htmlFor="organization-type">Organization Type</label>
                <select
                  id="organization-type"
                  className="form-input"
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="proprietorship">Proprietorship</option>
                  <option value="partnership">Partnership Firm</option>
                  <option value="huf">Hindu Undivided Family (HUF)</option>
                  <option value="company">Company</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="business-name">Name of Enterprise/Business</label>
                <input
                  type="text"
                  id="business-name"
                  placeholder="e.g., My Awesome Business"
                  className="form-input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="business-address">Business Address</label>
                <input
                  type="text"
                  id="business-address"
                  placeholder="e.g., 123 Main St, Anytown"
                  className="form-input"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bank-account">Bank Account Number</label>
                <input
                  type="text"
                  id="bank-account"
                  placeholder="e.g., 1234567890"
                  className="form-input"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ifsc-code">IFSC Code</label>
                <input
                  type="text"
                  id="ifsc-code"
                  placeholder="e.g., ABCD0123456"
                  className="form-input"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="business-activity">Main Business Activity</label>
                <input
                  type="text"
                  id="business-activity"
                  placeholder="e.g., Manufacturing"
                  className="form-input"
                  value={businessActivity}
                  onChange={(e) => setBusinessActivity(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nic-code">NIC Code</label>
                <input
                  type="text"
                  id="nic-code"
                  placeholder="e.g., 28220"
                  className="form-input"
                  value={nicCode}
                  onChange={(e) => setNicCode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="num-employees">Number of Employees</label>
                <input
                  type="number"
                  id="num-employees"
                  placeholder="e.g., 5"
                  className="form-input"
                  value={numEmployees}
                  onChange={(e) => setNumEmployees(e.target.value)}
                />
              </div>
              
              <div className="button-container">
                <button type="submit" className="submit-button">
                  Submit Registration
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
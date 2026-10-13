import React, { useRef, useReducer, useState } from 'react';
import './Contact.css';

const initialState = {
  submitted: false,
  error: '',
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SUBMIT_SUCCESS':
      return { submitted: true, error: '' };
    case 'SUBMIT_ERROR':
      return { submitted: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const Contact = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  // State to hold and display submitted messages on screen
  const [messagesList, setMessagesList] = useState([]);

  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const message = messageRef.current.value.trim();

    if (!name || !email || !message) {
      dispatch({ type: 'SUBMIT_ERROR', payload: 'Please fill out all mandatory fields.' });
      return;
    }

    // Save submitted message details to local state & log to console
    const newSubmission = {
      id: Date.now(),
      name,
      email,
      message,
      time: new Date().toLocaleTimeString(),
    };

    console.log('New Contact Submission:', newSubmission);
    setMessagesList((prev) => [newSubmission, ...prev]);

    dispatch({ type: 'SUBMIT_SUCCESS' });
    nameRef.current.value = '';
    emailRef.current.value = '';
    messageRef.current.value = '';
  };

  return (
    <div className="contact-container">
      <h2>Contact BelgaumBazaar Support</h2>
      <p>College Road, Belagavi, Karnataka - 590001</p>

      {state.submitted ? (
        <div className="success-box">
          <h3>Thank you for reaching out!</h3>
          <p>Our Belagavi team will respond to your query shortly.</p>
          <button onClick={() => dispatch({ type: 'RESET' })}>Send another message</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          {state.error && <p className="form-error">{state.error}</p>}

          <div className="form-group">
            <label>Name</label>
            <input type="text" ref={nameRef} placeholder="Your Full Name" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" ref={emailRef} placeholder="name@gmail.com" />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea ref={messageRef} rows="4" placeholder="How can we help you?"></textarea>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      )}

      {/* Render list of submitted messages below */}
      {messagesList.length > 0 && (
        <div className="submitted-messages-section" style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0f172a' }}>
            Submitted Support Tickets ({messagesList.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messagesList.map((msg) => (
              <div key={msg.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong>{msg.name} ({msg.email})</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{msg.time}</span>
                </div>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem' }}>{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
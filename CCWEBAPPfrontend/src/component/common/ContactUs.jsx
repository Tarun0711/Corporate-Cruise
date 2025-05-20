import React, { useState } from 'react';
import { FaQuestion } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function ContactUs() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const user = useSelector((state) => state.auth?.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');

    const payload = {
      name: formData.name || user?.name || '',
      email: user?.email || formData.email,
      message: formData.message,
    };

    try {
      const res = await fetch( `${import.meta.env.VITE_BACKEND_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setFeedback('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback('');
        }, 2000);
      } else {
        setFeedback(result?.error || 'Something went wrong.');
      }
    } catch (err) {
      setFeedback('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
        `}
      </style>

      <div className="fixed right-10 bottom-24 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <FaQuestion />
        </button>

        {showModal && (
          <div className="absolute bottom-16 right-0">
            <div className="animate-scaleIn bg-white rounded-2xl shadow-2xl p-6 w-80 sm:w-96 relative origin-bottom-right">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowModal(false);
                  setFeedback('');
                }}
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>

              {/* Modal Header */}
              <h2 className="text-xl font-bold mb-4 text-gray-800">Contact Us</h2>

              {/* Form */}
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={user?.email || formData.email}
                    onChange={handleChange}
                    disabled={!!user?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                    loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition duration-300`}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>

                {feedback && (
                  <div className="text-center text-sm mt-2 text-green-600">{feedback}</div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ContactUs;

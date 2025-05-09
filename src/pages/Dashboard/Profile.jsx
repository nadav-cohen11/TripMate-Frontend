import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const mockUsers = {
  '1': {
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    fullName: 'John Doe',
    email: 'john@example.com',
    birthday: '1990-01-01',
    interests: ['Travel', 'Photography', 'Music'],
    bio: 'Adventurer. Dreamer. Explorer.',
    trips: ['Paris', 'New York', 'Tokyo'],
    countries: ['France', 'USA', 'Japan'],
    friends: ['Jane Smith', 'Alex Brown'],
    languages: ['English', 'French', 'Japanese']
  },
  '2': {
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    birthday: '1992-05-15',
    interests: ['Cooking', 'Hiking', 'Art'],
    bio: 'Lover of mountains and good food.',
    trips: ['Rome', 'Berlin'],
    countries: ['Italy', 'Germany'],
    friends: ['John Doe'],
    languages: ['English', 'Italian', 'German']
  }
};

const isLoggedIn = () => {
  // Replace with your real auth logic
  return Boolean(localStorage.getItem('token'));
};

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser(mockUsers[userId] || null);
      setLoading(false);
    }, 500);
  }, [userId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-semibold mb-2">User not found</h2>
      <p className="text-base">Want to join? <Link to="/register" className="text-blue-600 underline">Register here</Link></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4 pt-32 pb-16" style={{ backgroundImage: "url('/assets/images/newBackground.jpg')" }}>
      <div className="text-[#4B2E2B] p-7 w-full max-w-md mx-auto bg-white bg-opacity-80 rounded-3xl shadow-lg flex flex-col items-center mt-8 sm:mt-0 sm:mb-0 sm:justify-center" style={{marginTop: '2rem', marginBottom: 'auto'}}>
        <div className="flex items-center justify-center mb-4 w-full gap-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-56 h-56 sm:w-72 sm:h-72 rounded-full object-cover border-4 border-[#2D4A53] shadow-lg bg-orange-100"
          />
        </div>
        <h2 className="text-3xl font-bold mb-1 text-center">{user.fullName}</h2>
        <p className="text-gray-600 mb-4 text-center text-base sm:text-lg">{user.bio}</p>
        <div className="w-full flex flex-col gap-3 mb-4 text-center">
          <div>
            <span className="font-semibold"><i className="bi bi-cake2 mr-1"></i>Birthday:</span> {user.birthday}
          </div>
          <div>
            <span className="font-semibold"><i className="bi bi-envelope mr-1"></i>Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold"><i className="bi bi-star mr-1"></i>Interests:</span> {user.interests.join(', ')}
          </div>
          <div>
            <span className="font-semibold"><i className="bi bi-geo-alt mr-1"></i>Trips:</span> {user.trips.join(', ')}
          </div>
          <div>
            <span className="font-semibold"><i className="bi bi-globe mr-1"></i>Countries Visited:</span> {user.countries.join(', ')}
          </div>
          <div>
            <span className="font-semibold"><i className="bi bi-people mr-1"></i>Friends:</span> {user.friends.join(', ')}
          </div>
          <div>
            <span className="font-semibold"><i className="bi bi-translate mr-1"></i>Languages:</span> {user.languages.join(', ')}
          </div>
        </div>
        {/* Action buttons below profile info */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            className="w-full bg-[#2D4A53] hover:bg-[#22343a] text-white px-6 py-2 rounded-xl transition text-lg font-semibold shadow mb-1 flex items-center justify-center"
            onClick={() => navigate(`/chat/${userId}`)}
          >
            <span className="text-2xl mr-2">💬</span>Chat with {user.fullName}
          </button>
          <button
            className="w-full bg-[#2D4A53] hover:bg-[#22343a] text-white px-6 py-2 rounded-xl transition text-lg font-semibold shadow flex items-center justify-center"
            onClick={() => alert('Connect request sent!')}
          >
            <span role="img" aria-label="connect" className="mr-2">🤝</span>Connect
          </button>
        </div>
        {isLoggedIn() ? null : null}
      </div>
    </div>
  );
};

export default Profile;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfileActions from '../../components/profile/ProfileActions';
import mockUsers from '../../data/mockUsers';

const isLoggedIn = () => {
  return Boolean(localStorage.getItem('token'));
};

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = mockUsers[userId];
        if (userData) {
          setUser(userData);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-semibold mb-2">User not found</h2>
      <p className="text-base">Want to join? <Link to="/register" className="text-blue-600 underline">Register here</Link></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4 pt-32 pb-16 bg-[url('/assets/images/newBackground.jpg')]">
      <div className="text-[#4B2E2B] p-7 w-full max-w-md mx-auto bg-white bg-opacity-80 rounded-3xl shadow-lg flex flex-col items-center mt-8 sm:mt-0 sm:mb-0 sm:justify-center" style={{marginTop: '2rem', marginBottom: 'auto'}}>
        <ProfileHeader user={user} />
        <ProfileInfo user={user} />
        <ProfileActions user={user} userId={userId} />
        {isLoggedIn() ? null : null}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import { getAllUsers } from '../../api/userApi';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                console.log(response.data, "nadav");
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSwipe = (direction, name) => {
        console.log(`Swiped ${direction} on ${name}`);
    };

    const handleCardLeftScreen = (name) => {
        console.log(`${name} left the screen`);
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-xl text-red-500">{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-gray-50 p-4">
            <h1 className="text-4xl font-bold mb-6">Swipe Users</h1>
            <div className="relative w-full h-full flex items-center justify-center">
                {users.map((user, index) => (
                    <TinderCard
                    key={user._id}
                    className="absolute w-[300px] h-[500px]"
                    preventSwipe={['up', 'down']}
                    onSwipe={(dir) => handleSwipe(dir, user.fullName)}
                    onCardLeftScreen={() => handleCardLeftScreen(user.fullName)}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${user.photos[1]})`,
                            backgroundSize: 'cover', // changed this
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        className="rounded-lg shadow-lg overflow-hidden" // added overflow-hidden here
                    >
                        {/* Swipe Labels */}
                        <div className="absolute top-5 left-5 text-green-500 text-4xl font-bold opacity-0 swipe-like">
                            LIKE
                        </div>
                        <div className="absolute top-5 right-5 text-red-500 text-4xl font-bold opacity-0 swipe-nope">
                            NOPE
                        </div>
                
                        {/* Info Container */}
                        <div className="absolute bottom-0 w-full bg-white bg-opacity-90 backdrop-blur-md rounded-t-2xl p-4 text-center">
                            <h2 className="text-2xl font-bold">{user.fullName}</h2>
                            <p className="text-gray-700 text-sm mt-1">{user.email}</p>
                            <p className="text-gray-600 text-sm">{user.gender}</p>
                            <p className="text-gray-600 text-sm">{user.languagesSpoken.join(', ')}</p>
                            <p className="text-gray-600 text-sm mt-2">{user.bio}</p>
                            <div className="flex justify-center mt-3 space-x-4">
                                {user.socialLinks?.instagram && (
                                    <a
                                        href={user.socialLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-pink-500 hover:underline"
                                    >
                                        Instagram
                                    </a>
                                )}
                                {user.socialLinks?.facebook && (
                                    <a
                                        href={user.socialLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Facebook
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </TinderCard>
                
                ))}
            </div>
        </div>
    );
};

export default Home;

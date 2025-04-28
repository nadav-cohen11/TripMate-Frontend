import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; 



const ProfileCard = ({ name, age, location, bio, imageUrl }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="flex flex-col bg-[#182b31] text-white items-center rounded-3xl shadow-lg overflow-hidden w-[350px]">
            
            <div
                className="h-[400px] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            
            <div className="flex flex-col items-center p-6 space-y-4 pb-4 w-full">
                <h1 className="text-2xl font-bold">
                    {name}
                    {age && `, ${age}`}
                </h1>

                <p className="text-gray-400">{location?.coordinates ? `${location.coordinates[1]}, ${location.coordinates[0]}` : location}</p>
                <p className="text-center text-gray-300">{bio}</p>

               
                <button onClick={toggleExpand} className="mt-2">
                    {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>

              
                {expanded && (
                    <div className="mt-4 space-y-2 text-center text-gray-300">
                        <p>More details coming here!</p>
                        <p>Hobbies: Travel, Music</p>
                        <p>Instagram: @username</p>
                       
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;

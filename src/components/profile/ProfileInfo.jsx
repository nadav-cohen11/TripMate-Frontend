import React from 'react';

const ProfileInfo = ({ user }) => {
  return (
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
        <span className="font-semibold"><i className="bi bi-geo-alt mr-1"></i>Trips:</span> {user.trips.map(trip => trip.destination).join(', ')}
      </div>
      <div>
        <span className="font-semibold"><i className="bi bi-globe mr-1"></i>Countries Visited:</span> {user.countriesVisited.join(', ')}
      </div>
      <div>
        <span className="font-semibold"><i className="bi bi-people mr-1"></i>Friends:</span> {user.friends.map(friend => friend.name).join(', ')}
      </div>
      <div>
        <span className="font-semibold"><i className="bi bi-translate mr-1"></i>Languages:</span> {user.languages.join(', ')}
      </div>
    </div>
  );
};

export default ProfileInfo; 
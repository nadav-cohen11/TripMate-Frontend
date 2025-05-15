const mockUsers = {
  "user1": {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    profilePicture: "/assets/images/default-avatar.png",
    bio: "Travel enthusiast and adventure seeker",
    country: "United States",
    location: "New York",
    birthday: "1990-01-01",
    languages: ["English", "Spanish"],
    lookingFor: ["Travel Partners", "Local Guides"],
    mates: 2,
    interests: ["Hiking", "Photography", "Food"],
    trips: [
      {
        id: "trip1",
        destination: "Paris, France",
        date: "2024-06-15",
        duration: "7 days"
      },
      {
        id: "trip2",
        destination: "Tokyo, Japan",
        date: "2024-08-20",
        duration: "10 days"
      }
    ],
    countriesVisited: ["France", "Japan", "Italy", "Spain"],
    friends: [
      {
        id: "user2",
        name: "Jane Smith",
        profilePicture: "/assets/images/default-avatar.png"
      },
      {
        id: "user3",
        name: "Mike Johnson",
        profilePicture: "/assets/images/default-avatar.png"
      }
    ]
  }
};

export default mockUsers; 
export const HOME_FILTERS = {
  Age: [
    { label: "Under 18", query: `user.age < 18` },
    { label: "18-29", query: `user.age >= 18 && user.age < 30` },
    { label: "30-49", query: `user.age >= 30 && user.age < 50` },
    { label: "50 and above", query: `user.age >= 50` },
  ],
  Language: [
    { label: "English", query: `user.languages.includes("english")` },
    { label: "Spanish", query: `user.languages.includes("spanish")` },
    { label: "French", query: `user.languages.includes("french")` },
    { label: "German", query: `user.languages.includes("german")` },
    { label: "Chinese", query: `user.languages.includes("chinese")` },
  ],
  Gender: [
    { label: "Male", query: `user.gender === "male"` },
    { label: "Female", query: `user.gender === "female"` },
  ],
};


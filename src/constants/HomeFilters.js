import ISO6391 from 'iso-639-1';


export const HOME_FILTERS = {
  Age: [
    { label: "18-29", query: `user.age >= 18 && user.age < 30` },
    { label: "30-49", query: `user.age >= 30 && user.age < 50` },
    { label: "50 and above", query: `user.age >= 50` },
  ],
  Language: [
    ...ISO6391.getAllNames().map((lang) => ({
      label: lang,
      query: `user.languages.includes("${lang.toLowerCase()}")`
    }))
  ],
  Gender: [
    { label: "Male", query: `user.gender === "male"` },
    { label: "Female", query: `user.gender === "female"` },
  ],
};


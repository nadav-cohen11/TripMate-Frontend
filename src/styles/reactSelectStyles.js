export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#f5f5f5",
    borderColor: "#8eaccd",
    borderRadius: "8px",
    padding: "6px",
    boxShadow: "none",
    "&:hover": { borderColor: "#5c9bb5" },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#5c9bb5",
    color: "white",
    borderRadius: "4px",
    padding: "2px 6px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "white",
    fontWeight: "bold",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    backgroundColor: "#4a7e99",
    color: "white",
    "&:hover": { backgroundColor: "#326278" },
  }),
};

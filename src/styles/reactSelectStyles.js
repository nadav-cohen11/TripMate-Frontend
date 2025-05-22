
export const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.5rem",
    paddingLeft: 6,
    borderRadius: "0.75rem",
    backgroundColor: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(6px)",
    borderColor: state.isFocused ? "#0ea5e9" : "transparent",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(14,165,233,.35)"
      : "none",
    "&:hover": { borderColor: "#0ea5e9" },
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "#60a5fa", 
    borderRadius: "9999px",
    padding: "2px 10px",
    marginRight: 6,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    boxShadow: "0 1px 2px rgba(0,0,0,.08)",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "white",
    fontWeight: 600,
    padding: 0,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "white",
    borderRadius: "9999px",
    padding: "0 4px",
    ":hover": {
      backgroundColor: "#3b82f6", 
      color: "white",
    },
  }),

  option: (base, state) => ({
    ...base,
    fontSize: ".925rem",
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: state.isFocused
      ? "#e0f2fe"         
      : state.isSelected
      ? "#0ea5e9"        
      : "white",
    color: state.isSelected ? "white" : "#0f172a",
    ":active": { backgroundColor: "#0ea5e9", color: "white" },
  }),

  placeholder:  (base) => ({ ...base, color: "#64748b" }),
  singleValue:  (base) => ({ ...base, color: "#0f172a" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#0ea5e9",
    ":hover": { color: "#0284c7" },
  }),
};

export const selectTheme = (theme) => ({
  ...theme,
  borderRadius: 12,
  colors: {
    ...theme.colors,
    primary25: "#e0f2fe",  
    primary:   "#0ea5e9",  
  },
});

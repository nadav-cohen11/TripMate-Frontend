export const whiteSelect = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(99,102,241,.5)' : undefined,
    '&:hover': { borderColor: '#6366f1' },
    minHeight: '2.5rem',
  }),
  placeholder: (base) => ({ ...base, color: '#6b7280' }),
  singleValue: (base) => ({ ...base, color: '#1f2937' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#eef2ff' : '#ffffff',
    color: '#1f2937',
    '&:active': { backgroundColor: '#e0e7ff' },
  }),
  multiValue:     (base) => ({ ...base, backgroundColor: '#e5e7eb' }),
  multiValueLabel:(base) => ({ ...base, color: '#1f2937' }),
  multiValueRemove:(base) => ({
    ...base,
    ':hover': { backgroundColor: '#f87171', color: '#fff' },
  }),
};
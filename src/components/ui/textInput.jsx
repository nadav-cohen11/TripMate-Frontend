const TextInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-4 py-3 bg-[#7f99a5a0] text-[#2D4A53] placeholder-[#2D4A53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D4A53] ${className}`}
      {...props}
    />
  );
};

export default TextInput;

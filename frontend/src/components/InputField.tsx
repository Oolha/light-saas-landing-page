import { InputFieldProps } from "@/types";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}

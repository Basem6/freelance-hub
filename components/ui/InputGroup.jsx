export function InputGroup({ label, type = "text", name, value, onChange,space=true , placeholder, ...props }) {
return (
    <div className={`${space?"space-y-1.5":"space-y-0"}`}>
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none disabled:border disabled:border-gray-600 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white"
    />
    </div>
);
}
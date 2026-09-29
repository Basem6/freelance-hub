export function InputGroup({ label, type = "text", name, value, onChange, placeholder }) {
return (
    <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white"
    />
    </div>
);
}
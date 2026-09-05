'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function OptionSelect({ value, options, onChange, placeholder = 'Select an option', className = '', buttonClassName = '' }) {
const [isOpen, setIsOpen] = useState(false);
const containerRef = useRef(null);

useEffect(() => {
    const handlePointerDown = (event) => {
    if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
    if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
    document.removeEventListener('mousedown', handlePointerDown);
    document.removeEventListener('keydown', handleKeyDown);
    };
}, []);

const selectedOption = options.find((option) => (
    typeof option === 'string' ? option : option.value
) === value);
const selectedLabel = typeof selectedOption === 'string'
    ? selectedOption
    : selectedOption?.label;

return (
    <div ref={containerRef} className={`relative ${className}`}>
    <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-all hover:border-[#FF7A00] hover:bg-white focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 ${buttonClassName}`}
    >
        <span className={!selectedLabel ? 'text-gray-400' : ''}>{selectedLabel || placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>

    {isOpen && (
        <div role="listbox" className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto hide-scrollbar rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-orange-500/10">
        {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            const isSelected = optionValue === value;
            return (
            <button
                key={optionValue}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                onChange(optionValue);
                setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-all ${isSelected ? 'bg-[#FFF4E8] text-[#FF7A00]' : 'text-gray-700 hover:bg-[#FFF4E8] hover:text-[#FF7A00]'}`}
            >
                {optionLabel}
            </button>
            );
        })}
        </div>
    )}
    </div>
);
}
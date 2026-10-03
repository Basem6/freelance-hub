'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export default function OptionSelect({
value,
options,
onChange,
placeholder = 'Select an option',
className = '',
buttonClassName = '',
isSearch = false,
}) {
const [isOpen, setIsOpen] = useState(false);
const [search, setSearch] = useState('');

const containerRef = useRef(null);
const searchRef = useRef(null);

useEffect(() => {
    const handlePointerDown = (event) => {
    if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
    }
    };

    const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
    }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
    document.removeEventListener('mousedown', handlePointerDown);
    document.removeEventListener('keydown', handleKeyDown);
    };
}, []);

const selectedOption = options.find(
    (option) =>
    (typeof option === 'string' ? option : option.value) === value
);

const selectedLabel =
    typeof selectedOption === 'string'
    ? selectedOption
    : selectedOption?.label;

const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return options;

    return options.filter((option) => {
    const label =
        typeof option === 'string' ? option : option.label;

    return label.toLowerCase().includes(query);
    });
}, [options, search]);

const handleOpen = () => {
    setIsOpen(true);

    setTimeout(() => {
    searchRef.current?.focus();
    }, 0);
};

const handleClose = () => {
    setIsOpen(false);
    setSearch('');
};

const handleSelect = (optionValue) => {
    onChange(optionValue);
    handleClose();
};

return (
    <div
    ref={containerRef}
    className={`relative ${className}`}
    >
    {/* Button / Search */}
    <div
        className={`flex w-full items-center rounded-xl border bg-gray-50 px-4 py-2.5 text-sm font-medium transition-all ${
        isOpen
            ? 'border-[#FF7A00] bg-white ring-2 ring-[#FF7A00]/20'
            : 'border-gray-200 hover:border-[#FF7A00] hover:bg-white'
        } ${buttonClassName}`}
    >
        {isOpen && isSearch ? (
        <>
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />

            <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            {search ? (
            <button
                type="button"
                onClick={() => {
                setSearch('');
                searchRef.current?.focus();
                }}
                className="ml-2 shrink-0 text-gray-400 transition hover:text-gray-600"
            >
                <X className="h-4 w-4" />
            </button>
            ) : (
            <button
                type="button"
                onClick={handleClose}
                className="ml-2 shrink-0 text-gray-400 transition hover:text-gray-600"
            >
                <ChevronDown className="h-4 w-4 rotate-180" />
            </button>
            )}
        </>
        ) : (
        <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={handleOpen}
            className={`flex w-full items-center justify-between text-left ${className}`}
        >
            <span
            className={!selectedLabel ? 'text-gray-400' : 'text-gray-700'}
            >
            {selectedLabel || placeholder}
            </span>

            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
        )}
    </div>

    {/* Dropdown */}
    {isOpen && (
        <div
        role="listbox"
        className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 "
        >
        <div className="max-h-42 overflow-y-auto hide-scrollbar">
            {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
                const optionValue =
                typeof option === 'string'
                    ? option
                    : option.value;

                const optionLabel =
                typeof option === 'string'
                    ? option
                    : option.label;

                const isSelected = optionValue === value;

                return (
                <button
                    key={optionValue}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(optionValue)}
                    className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                    isSelected
                        ? 'bg-[#FFF4E8] text-[#FF7A00]'
                        : 'text-gray-700 hover:bg-[#FFF4E8] hover:text-[#FF7A00]'
                    }`}
                >
                    {optionLabel}
                </button>
                );
            })
            ) : (
            <div className="px-3 py-6 text-center text-sm text-gray-400">
                No results found
            </div>
            )}
        </div>
        </div>
    )}
    </div>
);
}
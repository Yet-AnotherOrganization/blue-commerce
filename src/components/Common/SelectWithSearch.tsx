'use client'
import { debounce } from '@/utils/clientOnlyUtils';
import { standardizeText } from '@/utils/utils';
import React, { SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';

type Item = { value: string, label: string }

type Props = {
    id: string,
    placeholder?: string,
    searchPlaceholder?: string,
    items: Item[],
    onChange: (value: string) => void,
    classes?: string,
    defaultSelected?: string
}



const SelectWithSearch = ({ id, placeholder, searchPlaceholder, items, onChange, classes, defaultSelected }: Props) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(items.find((item) => item.value === defaultSelected) || null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<Item[]>(items);
    const [activeStep, setActiveStep] = useState(0);

    const outerInputRef = useRef<HTMLInputElement>(null);
    const innerInputRef = useRef<HTMLInputElement>(null);

    // * CLOSE MODAL WHEN CLICKED OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                handleModalOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => document.removeEventListener('click', handleClickOutside);
    }, [])

    // * AUTO-FOCUS ON INPUT WHEN MODAL OPENS
    useEffect(() => {
        if (modalOpen) {
            innerInputRef.current?.focus();
        }
    }, [modalOpen]);

    //* AUTOSCROLL ON KEYBOARD INPUT
    useEffect(() => {
        document.getElementById(`${id}-opt-${activeStep}`)
            ?.scrollIntoView({ block: 'nearest' });
    }, [activeStep]);

    const handleSelect = (value: string) => {
        onChange(value); // push back data to parent
        const foundItem = items.find((item) => item.value === value)
        // console.log("found", foundItem)
        if (foundItem) setSelectedItem(foundItem)
        handleModalOpen(false);
    };

    const handleInputChange = (value: string) => {
        setSearchQuery(value);
        debouncedSearch(value);
    }

    // * CREATE DEBOUNCE FUNC TO SAVE FROM API
    const debouncedSearch = useMemo(() => debounce((value: string) => {

        if (!value.trim()) return setFilteredItems(items);

        const cleanQuery = standardizeText(value);

        const results = items.filter((item) => standardizeText(item.label).includes(cleanQuery))
        return setFilteredItems(results);
    }, 300), [items])


    // * UNMOUNT DEBOUNCE ON CLEANUP
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        }
    }, [debouncedSearch])

    // * UPDATE ITEMS ON SOURCE-CHANGE
    useEffect(() => {
        setFilteredItems(items)
    }, [items])


    const handleModalOpen = (state: boolean) => {
        setModalOpen(state);
        resetDropdown();
    }

    const resetDropdown = () => {
        setSearchQuery('');
        setFilteredItems(items);
        setActiveStep(0);
    }

    const handleOuterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            handleModalOpen(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveStep((prev) =>
                    prev < filteredItems.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredItems[activeStep]) {
                    handleSelect(filteredItems[activeStep].value);
                }
                break;
            case 'Escape':
                handleModalOpen(false);
                break;
        }
    };

    return (
        <div className={`relative inline-block  ${classes}`} ref={containerRef}>
            <input aria-label={`Select ${placeholder}`} className='block w-full border border-gray-400 rounded-md px-2 py-1' type="text" readOnly value={selectedItem?.label} placeholder={placeholder || 'Enter placeholder text'} onClick={() => handleModalOpen(true)} onKeyDown={handleOuterKeyDown} role='combobox' ref={outerInputRef} aria-controls={`${id}-listbox`} aria-expanded={modalOpen} />
            <input readOnly className='hidden' value={selectedItem?.value} id={id} name={id} />
            <div className={`absolute flex max-h-[170px] overflow-y-auto flex-col px-2 pb-2 left-0 right-0 border rounded-md shadow-lg bg-white ${modalOpen ? 'block' : 'hidden'} z-[100]`} >
                <div className='inline-flex sticky top-0 mb-2 border-b-2 items-center justify-center bg-white px-1'>
                    <input
                        ref={innerInputRef}
                        className='outline-none rounded-xl w-full'
                        type="search"
                        placeholder={searchPlaceholder || 'Search items'}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.currentTarget.value)}
                        aria-activedescendant={`${id}-opt-${activeStep}`}
                        role='searchbox'
                        onKeyDown={handleKeyDown}
                    />
                    <FaSearch />
                </div>
                <ul className='flex flex-col' role='listbox' id={`${id}-listbox`}>
                    {
                        filteredItems.length <= 0 ?

                            <span className='text-gray-300'>No items were found.</span>

                            :

                            filteredItems?.map((item, index) =>
                                <li

                                    onClick={(e) => { handleSelect(e.currentTarget.dataset.value || ''); setSearchQuery('') }}
                                    className={`inline-flex cursor-pointer hover:bg-gray-200 transition-all items-center justify-between overflow-ellipsis border-b border-gray-100 focus:outline-2 focus:outline-blue-500 ${activeStep === index ? 'bg-gray-200' : ''}`}
                                    key={item.value} data-value={item.value}
                                    role='option'
                                    id={`${id}-opt-${index}`}
                                    aria-selected={item.value === selectedItem?.value}
                                >
                                    {item.label}
                                    {item.value === selectedItem?.value && <TiTick />}
                                </li>)
                    }
                </ul>
            </div>
        </div>
    )
}

export default SelectWithSearch
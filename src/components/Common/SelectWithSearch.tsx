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

    const innerInputRef = useRef<HTMLInputElement>(null);

    // * CLOSE MODAL WHEN CLICKED OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setModalOpen(false);
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


    const handleSelect = (value: string) => {
        onChange(value); // push back data to parent
        const foundItem = items.find((item) => item.value === value)
        // console.log("found", foundItem)
        if (foundItem) setSelectedItem(foundItem)
        setModalOpen(false);
    };

    const handleInputChange = (value: string) => {
        setSearchQuery(value);
        debouncedSearch(value);
    }

    // * CREATE DEBOUNCE FUNC TO SAVE FROM API
    const debouncedSearch = useMemo(() => debounce((value: string) => {

        if (!value.trim()) return setFilteredItems(items);

        const cleanQuery = standardizeText(value);

        console.log("debounced")

        const results = items.filter((item) => standardizeText(item.label).includes(cleanQuery))

        console.log("res: ", results)
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

    return (
        <div className={`relative inline-block ${classes}`} ref={containerRef}>
            <input className='block w-full border border-gray-400 rounded-md px-2 py-1' type="text" readOnly value={selectedItem?.label} placeholder={placeholder || 'Enter placeholder text'} onClick={() => setModalOpen(true)} />
            <input id={id} name={id} readOnly className='hidden' value={selectedItem?.value} />
            <div className={`absolute flex flex-col p-2 left-0 right-0 border rounded-md shadow-lg bg-white ${modalOpen ? 'block' : 'hidden'} z-[100]`} >
                <div className='inline-flex mb-2 border-b-2 items-center justify-center bg-white px-1'>
                    <input
                        ref={innerInputRef}
                        className='outline-none rounded-xl w-full'
                        type="search"
                        placeholder={searchPlaceholder || 'Search items'}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.currentTarget.value)}
                    />
                    <FaSearch />
                </div>
                <ul className='flex flex-col'>
                    {
                        filteredItems.length <= 0 ?

                            <span className='text-gray-300'>No items were found.</span>

                            :

                            filteredItems?.map((item) =>
                                <li onClick={(e) => { handleSelect(e.currentTarget.dataset.value || ''); setModalOpen(false); setSearchQuery('') }} className='inline-flex cursor-pointer hover:bg-gray-200 transition-all items-center justify-between overflow-ellipsis border-b border-gray-100' key={item.value} data-value={item.value}>
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
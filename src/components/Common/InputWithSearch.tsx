'use client'
import { standardizeText } from '@/utils/utils';
import React, { SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';

type Item = { value: string, label: string }

type Props = {
    placeholder?: string,
    searchPlaceholder?: string,
    items: Item[],
    onChange: any
}

const InputWithSearch = ({ placeholder, searchPlaceholder, items, onChange }: Props) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchResults, setSearchResults] = useState<Item[]>();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setModalOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => document.removeEventListener('click', handleClickOutside);
    }, [])

    const handleSelect = (value: string) => {
        onChange(value); // Push data to parent
        const foundItem = items.find((item) => item.value === value)
        console.log("found", foundItem)
        setSelectedItem(foundItem)
        setModalOpen(false);
    };

    const filteredResults = useMemo(() => {

        if (!searchQuery.trim()) return items;

        const cleanQuery = standardizeText(searchQuery);

        return items.filter((item) => standardizeText(item.label).includes(cleanQuery))

    }, [searchQuery, items])

    return (
        <div className='relative inline-block' ref={containerRef}>
            <input className='block w-full border rounded-md px-2 py-1' type="text" value={selectedItem?.label} placeholder={placeholder || 'Enter placeholder text'} onClick={() => setModalOpen(true)} />
            <div className={`absolute flex flex-col p-2 left-0 right-0 border rounded-md shadow-lg bg-white ${modalOpen ? 'block' : 'hidden'}`} >
                <div className='inline-flex items-center justify-center border-2 bg-white px-1'>
                    <input
                        className='outline-none'
                        type="search"
                        placeholder={searchPlaceholder || 'Search items'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
                    />
                    <FaSearch />
                </div>
                <ul className='flex flex-col'>
                    {filteredResults?.map((item, key) =>
                        <li onClick={(e) => { handleSelect(e.currentTarget.dataset.value || ''); setModalOpen(false) }} className='inline-flex cursor-pointer hover:bg-gray-200 transition-all items-center justify-between overflow-ellipsis' key={key} data-value={item.value}>
                            {item.label}
                            {item.value === selectedItem?.value && <TiTick />}
                        </li>)}
                </ul>
            </div>
        </div>
    )
}

export default InputWithSearch
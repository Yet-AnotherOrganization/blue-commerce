'use client';
import React, { createContext, useContext, useRef, useState } from 'react'

type Props = { children: React.ReactNode }

type ConfirmResolver = (value: boolean) => void;

export const ConfirmContext = createContext<any>(null);

const ConfirmProvider = ({ children }: Props) => {

    const [config, setConfig] = useState({ open: false, text: '' });

    const resolveRef = useRef<ConfirmResolver | null>(null);

    const ask = (text: string): Promise<boolean> => {
        setConfig({ open: true, text });

        return new Promise((resolve) => {
            resolveRef.current = resolve;
        })
    }

    const handleBtnClick = (choice: boolean) => {
        setConfig({ open: false, text: '' });

        resolveRef.current?.(choice);
    }


    return (
        <ConfirmContext.Provider value={ask}>
            {children}
            {
                config.open && <div className={`${true ? 'block' : 'hidden'} fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-black bg-opacity-15 z-50`}>
                    <div className={`flex fixed flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 bg-white rounded-xl shadow-lg z-50 border-2 border-neutral-800`}>
                        <p className='text-base text-center mt-8'>{config.text}</p>
                        <div className='flex justify-around mt-8 text-white'>
                            <button className='bg-red-400 hover:bg-red-600 transition-all px-4 py-2 rounded-md hover:scale-105' onClick={() => handleBtnClick(false)}>Cancel</button>
                            <button className='bg-green-400 hover:bg-green-600 transition-all px-4 py-2 rounded-md hover:scale-105'
                                onClick={() => handleBtnClick(true)}
                            >Yes</button>
                        </div>
                    </div>
                </div>
            }
        </ConfirmContext.Provider>
    )
}

export default ConfirmProvider

export const useConfirm = () => useContext(ConfirmContext)
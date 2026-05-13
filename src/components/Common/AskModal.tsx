'use client'
import { useAppDispatch } from '@/redux/hooks'
import { cancelGenericModal } from '@/redux/slices/uiSlice'
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const AskModal = (props: Props) => {

    const dispatch = useAppDispatch();

    const { genericModalOpen, genericModalText, genericModalTitle } = useSelector((state: RootState) => state.uiReducer)

    return (
        <div className={`${genericModalOpen ? 'block' : 'hidden'} fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-black bg-opacity-15 z-50`}>
            <div className={`flex fixed flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 bg-white rounded-xl shadow-lg z-50`}>
                <h1 className='text-center text-2xl font-semibold'>{genericModalTitle}</h1>
                <p className='text-base text-center mt-8'>{genericModalText}</p>
                <div className='flex justify-around mt-8 text-white'>
                    <button className='bg-red-400 hover:bg-red-600 transition-all px-4 py-2 rounded-md hover:scale-105' onClick={() => dispatch(cancelGenericModal())}>Cancel</button>
                    <button className='bg-green-400 hover:bg-green-600 transition-all px-4 py-2 rounded-md hover:scale-105'
                    // onClick={()=>}
                    >Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default AskModal
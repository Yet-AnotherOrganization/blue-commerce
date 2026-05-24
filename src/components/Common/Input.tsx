'use client'
import { debounce } from '@/utils/clientOnlyUtils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
    id: string,
    type?: string,
    label?: string,
    placeholder?: string,
    optional?: boolean,
    defaultValue?: string | number
    defaultChecked?: boolean
}

const Input = ({ placeholder = 'value', id, label, type, optional, defaultValue, defaultChecked }: Props) => {


    return (
        type !== 'checkbox' ?
            <div className='inline-flex flex-col gap-1'>
                <label htmlFor={id} className='pl-2 text-stone-600'>{label}</label>
                <div className='border items-center justify-center gap-1 px-2 py-1 rounded-xl border-stone-400'>
                    <input
                        className=' pt-1 outline-none w-full'
                        placeholder={`${placeholder}`}
                        id={id}
                        type={type || 'text'}
                        name={id}
                        required={!optional}
                        defaultValue={defaultValue}
                    />
                </div>
            </div>
            :
            <div className='inline-flex flex-col gap-1'>
                <span className='pl-2 text-stone-600'>{label}</span>
                <div className='inline-flex items-center gap-1 px-2 rounded-xl border-stone-400'>
                    <input
                        className='outline-none'
                        placeholder={`${placeholder}`}
                        id={id}
                        type='checkbox'
                        name={id}
                        required={!optional}
                        defaultChecked={defaultChecked}
                    />
                    <label htmlFor={id} className='pt-1'>{placeholder}</label>
                </div>
            </div>
    )
}

export default Input
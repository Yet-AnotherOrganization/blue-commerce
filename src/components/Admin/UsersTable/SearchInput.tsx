import React, { ChangeEvent } from 'react'

type Props = {}

const SearchInput = (props: Props) => {

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.currentTarget.value.replace(' ', '')
    }

    return (
        <div className='bg-red-400'>
            <input placeholder='Enter user name' onChange={handleInputChange} />
        </div>
    )
}

export default SearchInput
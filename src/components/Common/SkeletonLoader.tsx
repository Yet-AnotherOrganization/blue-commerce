import React from 'react'
import '../css/index.css';

type Props = {
    height?: string
}

const SkeletonLoader = ({ height }: Props) => {

    return (
        <div className={`flex flex-col gap-4 h-full w-full `}>
            <div className='min-h-4 h-1/4 w-full  glow rounded-xl' ></div>
            <div className='min-h-4 h-3/4 w-full  glow rounded-xl'></div>
        </div>
    )
}

export default SkeletonLoader
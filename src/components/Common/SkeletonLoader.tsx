import React from 'react'
import '../css/index.css';

type Props = {
    height?: string
}

const SkeletonLoader = ({ height }: Props) => {

    return (
        <div className={`flex flex-col gap-4 h-full`}>
            <div className='h-1/4 w-full  glow rounded-xl' ></div>
            <div className='h-3/4 w-full  glow rounded-xl'></div>
        </div>
    )
}

export default SkeletonLoader
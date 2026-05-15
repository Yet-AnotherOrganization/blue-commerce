import Link from 'next/link'
import React from 'react'

const About = () => {
  return (
    <div className='text-center'>
        Thanks for visiting my e-commerce project website.
        <br/><br/>
        Please follow me on <Link href="https://www.github.com/frknecn3" target='_blank' className='text-blue-500'>Github</Link> and <Link href="https://www.linkedin.com/in/furkan-ercan-ultraviolet" target='_blank' className='text-blue-500'>LinkedIn.</Link>
    </div>
  )
}

export default About
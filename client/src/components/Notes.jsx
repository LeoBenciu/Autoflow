import React from 'react'

const Notes = ({data}) => {
  return (
    <div className='flex flex-col gap-9 items-start mt-24'>
    <h1 className='font-extrabold text-3xl text'>Notes</h1>
    <div className='bg-white p-10 rounded-lg min-w-full'>
        <p className='text-left'>{data?.notes}</p>
    </div>
    </div>
  )
}

export default Notes;

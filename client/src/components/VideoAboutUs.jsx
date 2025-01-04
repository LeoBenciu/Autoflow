import React from 'react'
import presentation from '../assets/ AutoflowVideo.mp4'

const VideoAboutUs = () => {
  return (
    <div className='mt-32 min-w-full max-w-full min-h-max max-h-max flex flex-row items-center justify-center'>
      <video width="750" height="500" controls className='rounded-xl mx-auto mt-16' id='more'>
        <source src={presentation} type="video/mp4"/>
        </video>
    </div>
  )
}

export default VideoAboutUs

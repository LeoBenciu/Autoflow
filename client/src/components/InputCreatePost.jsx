import React from 'react'

const InputCreatePost = ({type, min, max, name,required, placeholder, value,id}) => {
  return (
    <input type={type} min={min} max={max} name={name} required={required} placeholder={placeholder} value={value} id={id} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500 min-w-60 max-w-60'></input>

)
}

export default InputCreatePost

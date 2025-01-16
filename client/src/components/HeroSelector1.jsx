import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const HeroSelector1 = ({ placeholder, arrayOfValues, required, onSelect }) => {
  return (
    <Select required={required} onValueChange={(value) => {
        onSelect(value);
      }} value={selectedMake}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {arrayOfValues.map((value) => (
            <SelectItem key={value.name} value={value.name}>
              <div className='flex flex-row items-center gap-3'>
              <img src={value.icon} className='size-8 object-cover'/>
              {value.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  )
}

export default HeroSelector1

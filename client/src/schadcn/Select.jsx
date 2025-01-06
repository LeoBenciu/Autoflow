import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import React from 'react'
  
  const MySelect = ({placeholder, arrayOfValues}) => {
    return (
        <Select>
        <SelectTrigger className="min-w-60 max-w-60 min-h-11 max-h-11 bg-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
        {arrayOfValues.map((val)=>(
            <SelectItem value={val}>{val}</SelectItem>
        ))}
        </SelectContent>
      </Select>
    )
  }
  
  export default MySelect
  
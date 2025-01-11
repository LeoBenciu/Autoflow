import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
export function HeroSelector({placeholder,listValues, className, one, onValueChange, disabled, value}) {
  return (
    <Select onValueChange={onValueChange} disabled={disabled} value={value}>
      <SelectTrigger className={className? className: "w-[280px]"}>
        <SelectValue placeholder={placeholder}/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        {!one&&(listValues?.map((val, index)=> (
          <SelectItem key={index} value={val}>{val}</SelectItem>
        )))}
        {one&&(listValues.map((val, index) => (
                    <SelectItem key={index} value={val.name}>
                      <div className='flex flex-row items-center gap-3'>
                      <img src={val.icon} className='size-8 object-cover'/>
                      {val.name}
                      </div>
                    </SelectItem>
        )))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
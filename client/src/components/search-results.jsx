import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import CarsResults from './CarsResults'
import { Ellipsis } from 'lucide-react'
import { Button } from './ui/button'
import { ChevronUp } from 'lucide-react'

const SearchResults = () => {
  return (
    <div className='flex flex-col min-h-max min-w-[75%] px-8'>
        <h1 className='text-left font-bold text-3xl' id='top'>Cars finded</h1>
        <div className='flex flex-row mt-6 justify-between pl-2'>
          <div className='text-xs'><span className='font-bold text-sm'>{(1500230).toLocaleString('de-DE')}</span> results</div>
          <div className='flex flex-row'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" aria-label="Go to previous page" className="bg-red-500 size-8 text-white"/>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="border-gray-400 data-[state=active]:border-[1px] size-8">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="border-gray-400 data-[state=active]:border-[1px] size-8">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="border-gray-400 data-[state=active]:border-[1px] size-8">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="bg-red-500 size-8 text-white flex flex-row"/>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          </div>
        </div>

        <CarsResults/>
        
        <div className='flex flex-row justify-between pl-2'>
        <a className='text-red-500 hover:text-black shadow-none hover:border-transparent flex flex-row' href='#top'>
         <ChevronUp />
          Back to top
        </a>
          <div className='flex flex-row'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" aria-label="Go to previous page" className="bg-red-500 size-8 text-white"/>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="border-gray-400 data-[state=active]:border-[1px] size-8">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="border-gray-400 data-[state=active]:border-[1px] size-8">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="border-gray-400 data-[state=active]:border-[1px] size-8">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <div className='flex h-[32px] w-[32px] items-center justify-center content-center'>
                    <Ellipsis className='cursor-pointer size-4'/>
                  </div>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="bg-red-500 size-8 text-white flex flex-row"/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
    </div>
  )
}

export default SearchResults

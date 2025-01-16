import React, { useState } from 'react'
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
import { useSearchCarsQuery } from '@/redux/slices/apiSlice'
import { useSearchParams } from 'react-router'

const SearchResults = () => {

  const [dataLength, setDataLength] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page'))|| 1;
  const itemsPerPage = 20;
  const totalPages = Math.ceil(dataLength / itemsPerPage);


  const handlePageChange = (page) =>{
    setSearchParams(prev=>{
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page);
      return newParams;
    })
  };

  const handleSetDataLength = (length)=>{
    setDataLength(length);
  };

  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 3;

    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
        links.push(
            <PaginationItem key={i}>
                <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i);
                    }}
                    className={`border-gray-400 data-[state=active]:border-[1px] size-8 ${
                        currentPage === i ? 'bg-red-500 text-white' : ''
                    }`}
                >
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    }
    return links;
};


  return (
    <div className='flex flex-col min-h-max min-w-[75%] px-8'>
        <h1 className='text-left font-bold text-3xl' id='top'>Cars finded</h1>
        <div className='flex flex-row mt-6 justify-between pl-2'>
                <div className='text-xs'>
                    <span className='font-bold text-sm'>{dataLength?.toLocaleString('de-DE')}</span> results
                </div>
                <div className='flex flex-row'>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                    className="bg-red-500 size-8 text-white"
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            
                            {renderPaginationLinks()}
                            
                            {totalPages > 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            
                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                    }}
                                    className="bg-red-500 size-8 text-white flex flex-row"
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>


        <CarsResults handleSetDataLength={handleSetDataLength}/>
        
        <div className='flex flex-row justify-between pl-2'>
        <a className='text-red-500 hover:text-black shadow-none hover:border-transparent flex flex-row' href='#top'>
         <ChevronUp />
          Back to top
        </a>
          <div className='flex flex-row'>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                    className="bg-red-500 size-8 text-white"
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            
                            {renderPaginationLinks()}
                            
                            {totalPages > 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            
                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                    }}
                                    className="bg-red-500 size-8 text-white flex flex-row"
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
          </div>
        </div>
    </div>
  )
}

export default SearchResults

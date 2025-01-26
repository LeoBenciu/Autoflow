import React, { useEffect, useState } from 'react'
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
import { ChevronUp } from 'lucide-react'
import { useSearchCarsQuery } from '@/redux/slices/apiSlice'
import { useSearchParams } from 'react-router-dom'
import { useNavigationType } from 'react-router'
import { Button } from './ui/button'

const SearchResults = () => {
  const [dataLength, setDataLength] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = 20;
  const totalPages = Math.ceil(dataLength / itemsPerPage);

  const handlePageChange = (page) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  const handleSetDataLength = (length) => {
    setDataLength(length);
  };

  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [currentPage, navigationType]);

  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 3;

    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      links.push(
        <PaginationItem key={i} className="cursor-pointer">
          <PaginationLink 
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
    <div className='flex flex-col w-full px-4 md:px-8'>
      <h1 className='text-left font-bold text-2xl md:text-3xl mt-4' id='top'>
        Cars Found
      </h1>
      
      <div className='flex flex-row md:flex-row mt-4 md:mt-6 justify-between items-center'>
        <div className='text-sm mb-2 md:mb-0'>
          <span className='font-bold text-base'>{dataLength?.toLocaleString('de-DE')}</span> results
        </div>
        
        <Pagination className='w-max mx-0 '>
          <PaginationContent className='flex flex-wrap justify-center'>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious 
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
              <PaginationItem className="cursor-pointer">
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem className="cursor-pointer">
              <PaginationNext 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                className="bg-red-500 size-8 text-white"
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <CarsResults handleSetDataLength={handleSetDataLength}/>
      
      <div className='flex flex-col md:flex-row justify-between items-center mt-4 px-2'>
        <Button 
          variant="link"
          className='text-red-500 hover:text-black flex flex-row items-center'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp />
          Back to top
        </Button>

        <Pagination className='w-full md:w-auto mt-2 md:mt-0'>
          <PaginationContent className='flex flex-wrap justify-center'>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious 
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
              <PaginationItem className="cursor-pointer">
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem className="cursor-pointer">
              <PaginationNext 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                className="bg-red-500 size-8 text-white"
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default SearchResults
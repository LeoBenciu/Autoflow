import Header from '@/components/header'
import Footer from '@/components/footer'
import React from 'react'
import SideBar from '@/components/sidebar-filters'
import SearchResults from '@/components/search-results'

const CarsPage = () => {
  return (
    <div className='h-screen flex flex-col content-center overflow-scroll'>
      <Header/>
      <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto pl-24 pr-24 flex flex-row mt-10'>
      <SideBar/>
      <SearchResults/>
      </div>
      <Footer/>
    </div>
  )
}

export default CarsPage;

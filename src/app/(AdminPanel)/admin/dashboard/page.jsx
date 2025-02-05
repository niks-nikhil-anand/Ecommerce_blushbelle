import DashboardCard from '@/components/adminPanel/ui/DashboardCard'
import React from 'react'

const page = () => {
  return (
    <div className='p-5 flex gap-5'>
      <DashboardCard/>
      <DashboardCard/>
      <DashboardCard/>
      <DashboardCard/>
    </div>
  )
}

export default page
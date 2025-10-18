import UserAccount from '@/components/profile/UserAccount'
import React from 'react'

const UserAccountPage = () => {
  return (
    <div>
      <UserAccount role={`${process.env.NEXT_PUBLIC_DOCTOR_ROLE}`}/>
    </div>
  )
}

export default UserAccountPage

import ProfileDetails from './Details'
import ProfileLogout from './ProfileLogout'

const Profile = async () => {
  return (
    <div className='flex flex-col justify-between h-[70vh] min-h-[50vh]'>
      <ProfileDetails />
      <ProfileLogout />
    </div>
  )
}

export default Profile

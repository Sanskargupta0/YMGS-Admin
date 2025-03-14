import { assets } from '../assets/assets'
const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
  <div className="flex items-center gap-2 font-display text-2xl text-primary">
    <span className="text-lg sm:text-2xl">YMGS pharmacy Admin Dashboard</span>
    <img 
      src={assets.logo} 
      alt="YMGS Pharmacy Logo" 
      className="h-auto w-auto max-w-[30px] max-h-[30px] sm:max-w-[40px] sm:max-h-[40px]" 
    />
  </div>

      <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar

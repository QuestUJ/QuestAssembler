import { Link } from '@tanstack/react-router';

import logoSVG from '@/assets/logo.svg';

export default function LogoWithText() {
  return (
    <Link to='/'>
      <div className='flex h-10 lg:h-20 w-80 flex-row items-center'>
        <img src={logoSVG} alt='Quasm logo' className='h-full text-primary' />
        <h1 className='font-medieval text-2xl lg:text-5xl text-primary'>Quasm</h1>
      </div>
    </Link>
  );
}

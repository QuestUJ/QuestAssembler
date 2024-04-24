import { Link } from '@tanstack/react-router';

import logoSVG from '@/assets/logo.svg';

export default function LogoWithText() {
  return (
    <Link to='/'>
      <div className='flex h-20 w-80 flex-row items-center'>
        <img src={logoSVG} alt='Quasm logo' className='h-20 text-primary' />
        <h1 className='font-medieval text-5xl text-primary'>Quasm</h1>
      </div>
    </Link>
  );
}

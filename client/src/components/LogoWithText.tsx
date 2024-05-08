import { Link } from '@tanstack/react-router';

import logoSVG from '@/assets/logo.svg';

export default function LogoWithText() {
  return (
    <Link to='/'>
      <div className='mx-2 flex h-12 w-full flex-row items-center lg:h-16 xl:h-20'>
        <img src={logoSVG} alt='Quasm logo' className='h-full text-primary' />
        <h1 className='font-medieval text-3xl text-primary xl:text-5xl'>
          Quasm
        </h1>
      </div>
    </Link>
  );
}

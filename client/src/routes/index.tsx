import { useAuth0 } from '@auth0/auth0-react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

import diceImg from '@/assets/dice.png';
import LogoWithText from '@/components/LogoWithText';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function LandingPage() {
  useEffect(() => {
    document.querySelector('html')?.classList.add('dark');
  }, []);

  const { loginWithRedirect } = useAuth0();

  return (
    <div className='flex h-screen w-screen flex-col content-between bg-background p-2 md:p-4'>
      <nav className='w-full'>
        <LogoWithText />
      </nav>
      <div className='flex h-full w-full flex-row'>
        <div className='flex h-full w-full flex-col md:w-3/4 lg:w-1/2'>
          <main className='my-7 flex h-2/3 flex-col justify-center md:ml-24'>
            <h1 className='font-medieval text-7xl text-primary'>
              Quest Assembler
            </h1>
            <h3 className='my-4 text-4xl text-supporting'>
              The best story is your story
            </h3>
            <div className='my-3 flex flex-row justify-center md:justify-normal'>
              <Button
                onClick={() => void loginWithRedirect()}
                className='w-52 text-xl'
              >
                Join the game
              </Button>
            </div>
          </main>
          <div className='mt-auto flex w-full flex-col items-center md:items-start'>
            <Separator className='w-5/6 md:hidden' orientation='horizontal' />
            <h4 className='my-2 text-2xl text-supporting'>
              Created by QuestUJ@2024
            </h4>
            <div className='hidden flex-row text-nowrap text-sm text-secondary md:flex [&>a]:mx-2'>
              <a href='https://github.com/avgmathenjoyer'>@avgmathenjoyer</a>
              <a href='https://github.com/patrykfulara7'>@nier</a>
              <a href='https://github.com/St0pien'>@st0pien</a>
              <a href='https://github.com/werka-z'>@werka-z</a>
              <a href='https://github.com/wouchan'>@wouchan</a>
            </div>
          </div>
        </div>
        <img src={diceImg} className='hidden w-1/2 lg:block' />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: LandingPage
});

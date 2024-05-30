import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

import { useWindowSize } from '@/lib/misc/windowSize';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  const { width } = useWindowSize();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position={width > 1024 ? 'bottom-right' : 'top-center'}
      toastOptions={{
        classNames: {
          icon: 'w-10 h-10',
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          closeButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
        }
      }}
      {...props}
    />
  );
};

export { Toaster };

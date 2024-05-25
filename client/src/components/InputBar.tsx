import { useState } from 'react';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export function InputBar({
  handleSend,
  sendButtonText
}: {
  handleSend: (content: string) => void;
  sendButtonText: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleClick = () => {
    if (inputValue) {
      setInputValue('');
      handleSend(inputValue);
    }
  };

  return (
    <div className='m-4 flex h-12 flex-nowrap gap-4'>
      <Textarea
        placeholder='Type your message here...'
        value={inputValue}
        required={true}
        onChange={e => setInputValue(e.target.value)}
      />
      <Button
        className='h-full font-decorative font-bold'
        onClick={handleClick}
      >
        {sendButtonText}
      </Button>
    </div>
  );
}

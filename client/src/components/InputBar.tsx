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
    setInputValue('');
    handleSend(inputValue);
  };

  return (
    <div className='flex h-16 flex-nowrap'>
      <Textarea
        placeholder='Type your message here...'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className='h-16'
      />
      <Button className='h-full' onClick={handleClick}>
        {sendButtonText}
      </Button>
    </div>
  );
}

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
    <div className='m-4 flex h-12 flex-nowrap gap-4'>
      <Textarea
        placeholder='Type your message here...'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <Button className='h-full' onClick={handleClick}>
        <b>{sendButtonText}</b>
      </Button>
    </div>
  );
}

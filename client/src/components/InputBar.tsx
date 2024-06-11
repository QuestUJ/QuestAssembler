import { KeyboardEventHandler, useState } from 'react';

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

  const onKeyDown: KeyboardEventHandler = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className='m-4 flex h-12 flex-nowrap gap-4'>
      <Textarea
        onKeyDown={onKeyDown}
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

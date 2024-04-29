import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function InputBar({handleSend, sendButtonText}: {handleSend: () => void, sendButtonText: string}) {
    const [inputValue, setInputValue] = useState("");
    
    return (
        <div className="flex flex-nowrap h-16">
            <Textarea placeholder="Type your message here..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="h-16"/>
            <Button className="h-full" onClick={handleSend}>{sendButtonText}</Button>
        </div>
    )
}
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import dummyMessages from './data.json';

function App() {
  const [messages, setMessages] = useState(dummyMessages);

  // The scrollable div
  const divRef = useRef<HTMLDivElement>(null);

  // Track previous scrollHeight to use as scroll position after messages are loaded
  const scrollPosRef = useRef(0);

  useEffect(() => {
    // Scroll to bottom on initial load
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    function loadMore() {
      if (divRef.current) {
        const { scrollTop, scrollHeight } = divRef.current;

        if (scrollTop === 0) {
          scrollPosRef.current = scrollHeight;
          setMessages((prev) => [...dummyMessages, ...prev]);
        }
      }
    }

    divRef.current?.addEventListener('scroll', loadMore);
    () => divRef.current?.removeEventListener('scroll', loadMore);
  }, []);

  useLayoutEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight - scrollPosRef.current;
    }
  }, [messages.length]);

  return (
    <main className='py-12 max-w-4xl w-full mx-auto'>
      <h1 className='text-4xl font-semibold mb-4'>Chat scrolling</h1>

      <ol className='mb-8 text-lg'>
        <li>1. Initially loads scrolled to bottom</li>
        <li>2. On scroll to top, load & prepend more messages</li>
        <li>3. On load/prepend more messages, maintain scroll position</li>
      </ol>

      <div ref={divRef} className='h-[700px] max-h-full bg-white overflow-y-scroll rounded-lg'>
        <ul className='flex flex-col items-start p-8 gap-4'>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`p-4 rounded-2xl ${message.isSender ? 'bg-orange-500 text-white self-end' : 'bg-neutral-200'}`}
            >
              {message.text}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;

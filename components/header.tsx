import { FC } from 'react';

interface HeaderProps {
  // Can add any props needed later
}

export const Header: FC<HeaderProps> = () => {
  return (
    <div className="fixed right-0 left-0 w-full top-0 bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center p-4">
        <div className="flex flex-row items-center gap-2 shrink-0">
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">AI Chat</h1>
        </div>
      </div>
    </div>
  );
};

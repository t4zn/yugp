import { FC } from 'react';

export const Header: FC = () => {
  return (
    <div className="fixed right-0 left-0 w-full top-0 bg-white dark:bg-zinc-950 p-4">
      <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Taizun AI</h1>
    </div>
  );
};

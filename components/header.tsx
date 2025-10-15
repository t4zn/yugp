import { FC } from "react";

export const Header: FC = () => {
  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
        }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">YUG AI</h1>
      </header>
    </>
  );
};

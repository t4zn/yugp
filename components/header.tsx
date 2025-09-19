import { FC } from "react";

export const Header: FC = () => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
      }}
    >
      <img
        src="/favicon.ico"
        alt="favicon"
        style={{ width: 20, height: 20 }}
      />
    </header>
  );
};

import { FC } from "react";

export const Header: FC = () => {
  return (
    <>
      <style jsx>{`
        .header-img {
          width: 64px;
          height: 64px;
          margin-top: -36px;
          margin-left:-16px;
        }
        @media (min-width: 768px) {
          .header-img {
            width: 128px;
            height: 128px;
            margin-top: -48px;
            margin-left: 20px;
          }
        }
      `}</style>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
        }}
      >
        <img
          src="/TaizunAI.PNG"
          alt="Taizun AI"
          className="header-img"
        />
      </header>
    </>
  );
};

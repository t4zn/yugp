import { FC, useState, useEffect } from "react";
import Image from "next/image";

export const Header: FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
        }}
      >
        <Image
          src="/TaizunAI.PNG"
          alt="Taizun AI"
          width={128}
          height={128}
          priority
          style={{
            width: isMobile ? '64px' : '128px',
            height: isMobile ? '64px' : '128px',
            marginTop: isMobile ? '-36px' : '-48px',
            marginLeft: isMobile ? '-16px' : '20px',
          }}
        />
      </header>
    </>
  );
};

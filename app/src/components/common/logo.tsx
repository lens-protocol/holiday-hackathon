import Image from 'next/image';
import * as React from 'react';

interface LogoProps {
  height: number;
  width: number;
}

const Logo: React.FC<LogoProps> = ({ height, width }) => {
  return (
    <Image
      src='/logo.svg'
      alt='Tech Pills Logo'
      width={width}
      height={height}
    />
  );
};

export default Logo;

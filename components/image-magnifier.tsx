'use client';

import Image from 'next/image';
import { useState } from 'react';

type ImageMagnifierProps = {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
};

const ImageMagnifier = ({
  src,
  className,
  width,
  height,
  alt,
  magnifierHeight = 300,
  magnifierWidth = 300,
  zoomLevel = 3
}: ImageMagnifierProps) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);

  const mouseEnter = (e: any) => {
    const el = e.currentTarget;

    const { width, height } = el.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const mouseLeave = (e: any) => {
    e.preventDefault();
    setShowMagnifier(false);
  };

  const mouseMove = (e: any) => {
    const el = e.currentTarget;
    const { top, left } = el.getBoundingClientRect();

    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    setXY([x, y]);
  };

  return (
    <div className="relative inline-block cursor-zoom-in overflow-hidden">
      <Image
        src={src}
        className={className}
        width={width}
        height={height}
        alt={alt}
        onMouseEnter={(e) => mouseEnter(e)}
        onMouseLeave={(e) => mouseLeave(e)}
        onMouseMove={(e) => mouseMove(e)}
      />
      <div
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          opacity: '1',
          border: '1px dotted grey',
          backgroundColor: 'white',
          borderRadius: '0px',
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifierWidth / 2}px`,
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,
          backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
        }}
      />
    </div>
  );
};

export default ImageMagnifier;

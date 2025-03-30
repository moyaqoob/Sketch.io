'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const colors = [
  { hex: 'transparent' }, // Transparent option (default for background)
  { hex: '#000000' },
  { hex: '#cccccc' },
  { hex: '#ffffff' },
  { hex: '#a98b78' },
  { hex: '#2f80ed' },
  { hex: '#56ccf2' },
  { hex: '#bb6bd9' },
  { hex: '#f471b5' },
  { hex: '#eb5757' },
  { hex: '#27ae60' },
  { hex: '#6fcf97' },
  { hex: '#f08c00' }, // Default Selected
  { hex: '#f2994a' },
  { hex: '#ff7f7f' },
];

interface ColorPaletteProps {
  selectedColor: string;
  setColor: (color: string) => void;
  type: 'Stroke' | 'Background'; // Differentiate stroke and background
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  setColor,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const quickColors =
    type === 'Background'
      ? [colors[0], colors[9], colors[11], colors[14]]
      : [colors[4], colors[9], colors[11], colors[14]];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className='relative mb-2' ref={ref}>
      {/* Quick Color Selection */}
      <p className='mb-1 text-sm font-medium'>{type}</p>
      <div className='flex items-center gap-2'>
        {quickColors.map(({ hex }) => (
          <button
            key={hex}
            className={clsx(
              'flex h-8 w-8 items-center justify-center rounded border-2 transition-all',
              selectedColor === hex ? 'border-blue-500' : 'border-transparent',
            )}
            style={{
              backgroundColor: hex === 'transparent' ? 'white' : hex,
              backgroundImage:
                hex === 'transparent'
                  ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                  : 'none',
              backgroundSize: '6px 6px',
              backgroundPosition: '0 0, 3px 3px',
            }}
            onClick={() => setColor(hex)}
            title={hex === 'transparent' ? 'Transparent' : hex}
          ></button>
        ))}

        {/* Open Full Palette Button */}
        <div>
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className={clsx(
              'flex h-8 w-8 items-center justify-center rounded border-2 transition-all',
              selectedColor === 'transparent'
                ? 'border-gray-500 bg-white'
                : 'border-transparent',
            )}
            style={{
              backgroundColor:
                selectedColor === 'transparent' ? 'white' : selectedColor,
              backgroundImage:
                selectedColor === 'transparent'
                  ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                  : 'none',
              backgroundSize: '6px 6px',
              backgroundPosition: '0 0, 3px 3px',
            }}
            title='More Colors'
          ></button>
        </div>
      </div>

      {/* Color Palette Dropdown */}
      {isOpen && (
        <div className='bg-background absolute top-6 left-full z-10 ml-6 w-64 rounded-lg p-4 text-white shadow-md'>
          <p className='mb-2 text-sm font-medium'>
            {type === 'Stroke' ? 'Stroke Color' : 'Background Color'}
          </p>

          {/* Colors */}
          <div className='mb-4 grid grid-cols-5 gap-2'>
            {colors.map(({ hex }) => (
              <button
                key={hex}
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded border-2 transition-all',
                  selectedColor === hex
                    ? 'border-blue-500'
                    : 'border-transparent',
                )}
                style={{
                  backgroundColor: hex === 'transparent' ? 'white' : hex,
                  backgroundImage:
                    hex === 'transparent'
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                      : 'none',
                  backgroundSize: '6px 6px',
                  backgroundPosition: '0 0, 3px 3px',
                }}
                onClick={() => {
                  setColor(hex);
                  // setIsOpen(false); // Close after selection
                }}
                title={hex === 'transparent' ? 'Transparent' : hex}
              ></button>
            ))}
          </div>

          {/* Hex Code Input */}
          <p className='mb-2 text-sm font-medium'>Hex Code</p>
          <div className='bg-lighter_background flex items-center gap-2 rounded-md p-2'>
            <span className='text-gray-400'>#</span>
            <input
              type='text'
              className='w-full bg-transparent text-white outline-none'
              value={
                selectedColor === 'transparent'
                  ? 'transparent'
                  : selectedColor.replace('#', '')
              }
              readOnly
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ColorPalette;

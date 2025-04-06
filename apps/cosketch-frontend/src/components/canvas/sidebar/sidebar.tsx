'use client';

import { Tool } from '@/type/tool';
import clsx from 'clsx';
import React from 'react';
import {
  HachureSquareIcon,
  SquareIcon,
  CrossHatchSquareIcon,
} from '@/data/icons/canvas-sidebar/fill-icons';
import {
  HorizontalLineIcon,
  BoldHorizontalLineIcon,
  ThickHorizontalLineIcon,
  ThinHorizontalLineIcon,
  DashedLineIcon,
  DottedLineIcon,
  SquiggleLineIcon,
  ComplexSquiggleIcon,
  SketchyLineIcon,
} from '@/data/icons/canvas-sidebar/stroke-icons';

import ColorPalette from './color-palette';
import IconSelector from './icon-selector';

interface SidebarProps {
  selectedTool: Tool;
  isShapeSelected: boolean;
  styles: {
    strokeColor: string;
    backgroundColor: string;
    strokeWidth: 'thin' | 'medium' | 'thick';
    strokeStyle: 'solid' | 'dashed' | 'dotted';
    roughness: 'none' | 'normal' | 'high';
    fillStyle: 'hachure' | 'solid' | 'cross-hatch';
  };
  setStyles: React.Dispatch<React.SetStateAction<SidebarProps['styles']>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedTool,
  isShapeSelected,
  styles,
  setStyles,
}) => {
  return (
    <section
      onMouseUp={event => event.stopPropagation()}
      className={clsx(
        'bg-background absolute left-4 flex h-auto flex-col space-y-4 rounded-lg px-3 py-4 text-gray-400 shadow-md',
        'top-32',
        !isShapeSelected &&
          (selectedTool === 'Eraser' || selectedTool === 'Selection')
          ? 'hidden'
          : '',
      )}
    >
      {/* Stroke Settings */}
      <div>
        <ColorPalette
          selectedColor={styles.strokeColor}
          setColor={color =>
            setStyles(prev => ({ ...prev, strokeColor: color }))
          }
          type='Stroke'
        />

        <ColorPalette
          selectedColor={styles.backgroundColor}
          setColor={color =>
            setStyles(prev => ({ ...prev, backgroundColor: color }))
          }
          type='Background'
        />

        <IconSelector
          title='Fill'
          icons={[
            { Icon: HachureSquareIcon, key: 'hachure' },
            { Icon: CrossHatchSquareIcon, key: 'cross-hatch' },
            { Icon: SquareIcon, key: 'solid' },
          ]}
          selectedIcon={styles.fillStyle}
          setSelectedIcon={(fillStyle: SidebarProps['styles']['fillStyle']) =>
            setStyles(prev => ({ ...prev, fillStyle }))
          }
        />

        <IconSelector
          title='Stroke Width'
          icons={[
            { Icon: HorizontalLineIcon, key: 'thin' },
            { Icon: BoldHorizontalLineIcon, key: 'medium' },
            { Icon: ThickHorizontalLineIcon, key: 'thick' },
          ]}
          selectedIcon={styles.strokeWidth}
          setSelectedIcon={(
            strokeWidth: SidebarProps['styles']['strokeWidth'],
          ) => setStyles(prev => ({ ...prev, strokeWidth }))}
        />

        <IconSelector
          title='Stroke Style'
          icons={[
            { Icon: ThinHorizontalLineIcon, key: 'solid' },
            { Icon: DashedLineIcon, key: 'dashed' },
            { Icon: DottedLineIcon, key: 'dotted' },
          ]}
          selectedIcon={styles.strokeStyle}
          setSelectedIcon={(
            strokeStyle: SidebarProps['styles']['strokeStyle'],
          ) => setStyles(prev => ({ ...prev, strokeStyle }))}
        />

        <IconSelector
          title='Roughness'
          icons={[
            { Icon: SquiggleLineIcon, key: 'none' }, // Changed 'low' to 'none'
            { Icon: ComplexSquiggleIcon, key: 'normal' },
            { Icon: SketchyLineIcon, key: 'high' },
          ]}
          selectedIcon={styles.roughness}
          setSelectedIcon={(roughness: SidebarProps['styles']['roughness']) =>
            setStyles(prev => ({ ...prev, roughness }))
          }
        />
      </div>
    </section>
  );
};

export default Sidebar;

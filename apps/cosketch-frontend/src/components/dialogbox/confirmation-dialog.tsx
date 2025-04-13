import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
      onClick={onCancel}
    >
      <div
        className='w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg'
        onClick={e => e.stopPropagation()}
      >
        <h2 className='mb-2 text-xl font-semibold text-gray-800'>{title}</h2>
        <p className='mb-10 text-base text-gray-600'>{message}</p>

        <div className='flex justify-end gap-2'>
          <button
            className='cursor-pointer rounded-md border px-4 py-2 font-bold text-gray-600 hover:bg-gray-100'
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className='cursor-pointer rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-500'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

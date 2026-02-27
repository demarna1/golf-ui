import { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="backdrop:bg-black/50 rounded-lg p-0 max-w-lg w-full shadow-xl"
    >
      <div className="p-6">
        {title && (
          <h2 className="font-heading text-xl font-semibold text-masters-green mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </dialog>
  );
}

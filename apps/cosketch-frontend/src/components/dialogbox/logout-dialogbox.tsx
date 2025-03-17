interface LogoutDialogBoxProps {
  isOpen: boolean;
  onClose: (e: boolean) => void;
}

export const LogoutDialogBox = ({ onClose, isOpen }: LogoutDialogBoxProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-md z-[1100] h-screen"
      onClick={() => {
        onClose(false);
      }} // Close when clicking outside
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-semibold text-secondary mb-2">
          Confirm Logout
        </h2>
        <p className="text-gray-600">
          Are you sure you want to logout? You will need to sign in again to
          access your rooms.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6 font-bold">
          <button
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => {
              onClose(false);
            }}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

import * as React from "react";
import useSnackbarStore from "../../store/useSnackbarStore";

export default function SimpleSnackbar() {
  const { open, message, variant, closeSnackbar } = useSnackbarStore();

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        closeSnackbar();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [open, closeSnackbar]);

  if (!open) return null;

  const bgColor =
    variant === "success"
      ? "bg-green-500"
      : variant === "error"
        ? "bg-red-500"
        : variant === "warning"
          ? "bg-yellow-500"
          : "bg-blue-500";

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}
      >
        <span>{message}</span>
        <button
          onClick={closeSnackbar}
          className="ml-4 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

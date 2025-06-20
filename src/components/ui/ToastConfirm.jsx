import { toast } from 'react-toastify';

export function confirmToast(message,color) {
  return new Promise((resolve) => {
    const isRed = color === 'red';
    const toastId = toast.info(
      ({ closeToast }) => (
      <div>
        <span>{message}</span>
        <div className='mt-2 flex gap-2'>
        <button
          onClick={() => {
          toast.dismiss(toastId);
          resolve(false);
          }}
          className='px-3 py-1 bg-gray-300 rounded'
        >
          Cancel
        </button>
        <button
          onClick={() => {
          toast.dismiss(toastId);
          resolve(true);
          }}
          className={`px-3 py-1 rounded text-white ${isRed ? 'bg-red-600' : 'bg-green-600'}`}
        >
          Confirm
        </button>
        </div>
      </div>
      ),
      { autoClose: false, closeOnClick: false },
    );
  });
}

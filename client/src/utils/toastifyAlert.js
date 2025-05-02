import { toast } from 'react-toastify'

export const showFailedAlert = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: 'light',
  })
}

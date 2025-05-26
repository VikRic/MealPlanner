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

export const showSuccessAlert = (message) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: 'light',
  })
}

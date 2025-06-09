const ToastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  icon: true,
  style: {
    borderRadius: "12px",
    padding: "16px 20px",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#1a1a1a",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    margin: "8px",
    minWidth: "300px",
  },
  closeButton: {
    padding: "4px",
    color: "#6b7280",
    "&:hover": {
      color: "#1a1a1a",
    },
  },
  toastClassName: "toast-custom",
  bodyClassName: "toast-body-custom",
  containerClassName: "toast-container-custom",
};

export default ToastConfig;

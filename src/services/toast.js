import { toast } from "react-toastify";

/**
 * Description: Display an error message
 * @param {String} message - Error message
 */
function toastError(message) {
	toast.error(message, {
		position: "top-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	});
}

/**
 * Description: Display a success message
 * @param {String} message - Success message
 */
function toastSuccess(message) {
	toast(message, {
		position: "bottom-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		emoji: "🎉",
	});
}

/**
 * Description: Display a neutral message
 */
function toastNeutral() {
	toast("🥁 And the winner is...", {
		position: "bottom-right",
		autoClose: 4000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	});
}

export { toastError, toastSuccess, toastNeutral };

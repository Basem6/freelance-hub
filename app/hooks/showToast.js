import { hideShow, setShow } from "../lib/Features/showSlice";
import { useAppDispatch } from "@/app/lib/hooks";

export function useShowToast() {
    const dispatch = useAppDispatch();

    const showToast = (message) => {
        dispatch(setShow(message));

        setTimeout(() => {
            dispatch(hideShow());
        }, 3000);
    };

    return showToast;
}
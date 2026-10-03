let currentRef = null;
let currentClose = null;
let listenerRegistered = false;

const handleClick = (e) => {
  
  if (!currentRef?.current) return;
  if (!currentRef.current.contains(e.target)) {
    currentClose?.();
  }
};

export const registerOutsideClick = (ref, closeFn) => {
  if (currentClose && currentRef !== ref) {
    currentClose();
  }

  currentRef = ref;
  currentClose = closeFn;
  if (!listenerRegistered) {
    document.addEventListener("mousedown", handleClick);
    listenerRegistered = true;
  }
};

export const unregisterOutsideClick = (ref) => {
  if (ref && currentRef !== ref) return;

  currentRef = null;
  currentClose = null;
  if (listenerRegistered) {
    document.removeEventListener("mousedown", handleClick);
    listenerRegistered = false;
  }
};
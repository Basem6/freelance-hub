let currentRef = null;
let currentClose = null;

const handleClick = (e) => {
  
  if (!currentRef?.current) return;
  if (!currentRef.current.contains(e.target)) {
    currentClose?.();
  }
};

document.addEventListener("mousedown", handleClick);

export const registerOutsideClick = (ref, closeFn) => {
   // اقفل القديمة الأول
  if (currentClose && currentRef !== ref) {
    currentClose();
  }

  currentRef = ref;
  currentClose = closeFn;
};

export const unregisterOutsideClick = () => {
  currentRef = null;
  currentClose = null;
};
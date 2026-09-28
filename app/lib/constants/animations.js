export const staggerContainer = {
hidden: { opacity: 0 },
show: {
    opacity: 1,
    transition: {
    staggerChildren: 0.1,
    },
},
};
export const fadeUp = {
hidden: {
    opacity: 0,
    y: 20,
},
show: {
    opacity: 1,
    y: 0,
    transition: {
    type: "spring",
    stiffness: 300,
    damping: 24,
    },
},
};
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
export const slideInRight = {
hidden: { opacity: 0, x: 20 },
visible: {
    opacity: 1,
    x: 0,
    transition: {
    duration: 0.5,
    ease: "easeOut",
    },
},
};
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const DrawerContext = createContext<any>(null);

export const Drawer = ({ children, open: controlledOpen, onOpenChange }: any) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  const setOpen = (value: boolean) => {
    if (!isControlled) setUncontrolledOpen(value);
    if (onOpenChange) onOpenChange(value);
  };

  return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>;
};

export const DrawerTrigger = ({ children, asChild, className, ...props }: any) => {
  const { setOpen } = useContext(DrawerContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      onClick: (e: any) => {
        setOpen(true);
        if (children.props.onClick) children.props.onClick(e);
      },
      ...props
    });
  }
  return <button onClick={() => setOpen(true)} className={className} {...props}>{children}</button>;
};

export const DrawerClose = ({ children, asChild, className, ...props }: any) => {
  const { setOpen } = useContext(DrawerContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      onClick: (e: any) => {
        setOpen(false);
        if (children.props.onClick) children.props.onClick(e);
      },
      ...props
    });
  }
  return <button onClick={() => setOpen(false)} className={className} {...props}>{children}</button>;
};

export function DrawerBackdrop({ className, ...props }: any) {
  const { setOpen } = useContext(DrawerContext);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      onClick={() => setOpen(false)}
      className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto", className)}
      {...props}
    />
  );
}

export function DrawerPopup({ className, children, showCloseButton = false, showBar = false, direction = "bottom", ...props }: any) {
  const { open, setOpen } = useContext(DrawerContext);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isLeft = direction === "left";

  return (
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 z-50 flex touch-none pointer-events-none", isLeft ? "flex-row justify-start" : "flex-col justify-end")}>
          <DrawerBackdrop />
          <motion.div
            initial={isLeft ? { x: "-100%" } : { y: "100%" }}
            animate={isLeft ? { x: 0 } : { y: 0 }}
            exit={isLeft ? { x: "-100%" } : { y: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            drag={isLeft ? "x" : "y"}
            dragConstraints={isLeft ? { right: 0 } : { top: 0 }}
            dragElastic={0.05}
            onDragEnd={(e, info) => {
              if (isLeft) {
                if (info.offset.x < -100 || info.velocity.x < -500) {
                  setOpen(false);
                }
              } else {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setOpen(false);
                }
              }
            }}
            className={cn(
              "relative flex min-h-0 min-w-0 flex-col bg-primary text-primary shadow-xl outline-none pointer-events-auto",
              isLeft ? "w-[320px] h-full rounded-none border-r" : "w-full max-h-[85vh] rounded-t-2xl border-t pt-4 mt-auto",
              className
            )}
            {...props}
          >
            {showBar && !isLeft && (
              <div aria-hidden className="absolute inset-x-0 top-0 flex touch-none items-center justify-center p-3 before:h-1 before:w-12 before:rounded-full before:bg-component-secondary" data-slot="drawer-bar" />
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
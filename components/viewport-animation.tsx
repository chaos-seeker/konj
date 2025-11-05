"use client";

import { motion } from "framer-motion";
import { ReactNode, useId } from "react";
import { usePathname } from "next/navigation";

interface ViewportAnimationProps {
  children: ReactNode;
  className?: string;
}

export const ViewportAnimation = (props: ViewportAnimationProps) => {
  const pathname = usePathname();
  const id = useId();

  return (
    <motion.div
      key={`${pathname}-${id}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={props.className}
    >
      {props.children}
    </motion.div>
  );
};

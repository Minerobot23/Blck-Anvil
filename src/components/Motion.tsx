"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades/lifts children into view once. */
export function Reveal({ children, delay = 0, y = 28, className, ...rest }: { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line headline reveal. The observer sits on the (unclipped) heading itself. */
const MotionTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };
export function SplitHeading({ lines, className, as = "h2", delay = 0, animateOnMount = false }: { lines: string[]; className?: string; as?: "h1" | "h2" | "h3" | "p"; delay?: number; animateOnMount?: boolean }) {
  const reduce = useReducedMotion();
  const Tag = MotionTags[as];
  const trigger = animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } };
  return (
    <Tag className={className} aria-label={lines.join(" ")} initial={reduce ? false : "hidden"} {...trigger}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.04em]" aria-hidden>
          <motion.span
            className="block will-change-transform"
            variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.1, delay: delay + i * 0.09, ease: EASE } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Image wrapper with a clip-path wipe reveal. */
export function ImageReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.3, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}

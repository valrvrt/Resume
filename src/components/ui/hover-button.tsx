"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, variant = "primary", href, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [circles, setCircles] = React.useState<
      Array<{
        id: number;
        x: number;
        y: number;
        size: number;
      }>
    >([]);
    const lastAddedRef = React.useRef(0);

    const createCircle = React.useCallback((x: number, y: number) => {
      const id = Date.now() + Math.random();
      const size = 80 + Math.random() * 40;

      setCircles((prev) => [...prev, { id, x, y, size }]);

      // Remove circle after animation
      setTimeout(() => {
        setCircles((prev) => prev.filter((c) => c.id !== id));
      }, 1500);
    }, []);

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isHovered) return;

        const currentTime = Date.now();
        if (currentTime - lastAddedRef.current > 80) {
          lastAddedRef.current = currentTime;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          createCircle(x, y);
        }
      },
      [isHovered, createCircle]
    );

    const handlePointerEnter = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        setIsHovered(true);
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        createCircle(x, y);
      },
      [createCircle]
    );

    const handlePointerLeave = React.useCallback(() => {
      setIsHovered(false);
    }, []);

    const variantStyles = {
      primary: {
        base: "bg-copperwood text-cornsilk hover:bg-sunlit-clay",
        glow: "rgba(221, 161, 94, 0.6)",
        glowDark: "rgba(188, 108, 37, 0.4)",
      },
      secondary: {
        base: "bg-olive-leaf text-cornsilk hover:bg-black-forest",
        glow: "rgba(96, 108, 56, 0.6)",
        glowDark: "rgba(40, 54, 24, 0.4)",
      },
    };

    const styles = variantStyles[variant];

    const buttonElement = (
      <button
        ref={buttonRef}
        className={cn(
          "relative px-8 py-3 rounded-lg",
          "font-semibold text-base leading-6",
          "cursor-pointer overflow-hidden",
          "transition-all duration-300 ease-out",
          "shadow-lg hover:shadow-xl",
          "active:scale-[0.98]",
          styles.base,
          className
        )}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        {/* Glow circles */}
        {circles.map(({ id, x, y, size }) => (
          <span
            key={id}
            className="absolute rounded-full pointer-events-none animate-hover-glow"
            style={{
              left: x,
              top: y,
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${styles.glow} 0%, ${styles.glowDark} 40%, transparent 70%)`,
            }}
          />
        ))}
        {/* Content */}
        <span className="relative z-10">{children}</span>
      </button>
    );

    if (href) {
      return (
        <a href={href} className="inline-block">
          {buttonElement}
        </a>
      );
    }

    return buttonElement;
  }
);

HoverButton.displayName = "HoverButton";

export { HoverButton };

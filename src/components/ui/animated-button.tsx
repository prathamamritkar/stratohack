"use client";

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';

const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, type: 'spring', stiffness: 300, damping: 15 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, type: 'spring', stiffness: 400, damping: 20 },
  },
};

const AnimatedButton = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="w-full"
        >
          <Button
            ref={ref}
            className={cn('w-full', className)}
            {...props}
          >
            {children}
          </Button>
        </motion.div>
      );
    }
  )
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };

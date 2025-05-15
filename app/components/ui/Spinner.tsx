import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type SpinnerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ hidden, className, ...restProps }, ref) => {
    if (hidden) {
      return null;
    }

    return (
      <div
        ref={ref}
        data-cy="spinner"
        aria-hidden="true"
        className={twMerge(
          "inline-block h-[1em] w-[1em] animate-spin select-none rounded-full border-2 border-solid border-current border-b-transparent border-l-transparent outline-none duration-500 ease-linear repeat-infinite",
          className,
        )}
        {...restProps}
      />
    );
  },
);

Spinner.displayName = "Spinner";

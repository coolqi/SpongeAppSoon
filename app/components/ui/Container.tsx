import { cn } from "@/lib/utils";

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "bg-yellow-light rounded-3xl pb-4 shadow-inner-black",
        className,
      )}
    >
      <div className="bg-green-light dark:bg-[#1A1F2E] rounded-3xl border-4 border-black p-6">
        {children}
      </div>
    </div>
  );
};

import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import { MemeButton } from "../ui/MemeButton";

export interface BottomBtnProps {
  connected: boolean;
  handleClick?: () => void;
  loading: boolean;
  disabled: boolean;
  text: string;
}
export const BottomBtn: React.FC<BottomBtnProps> = ({
  connected,
  loading,
  disabled,
  text,
  handleClick,
}) => {
  return connected ? (
    <MemeButton
      className="mt-0 w-full bg-yellow-light hover:bg-yellow-dark border-black"
      onClick={handleClick}
      disabled={disabled}
    >
      {loading ? "Processing..." : text}
    </MemeButton>
  ) : (
    <div className="rounded-full mt-0 w-full bg-yellow-light hover:bg-yellow-dark font-bold">
      <UnifiedWalletButton buttonClassName="!transform !hover:scale-105 !transition-all !border-4 !border-black !rounded-full !w-full !py-3 !px-6 !text-base !flex !items-center !justify-center !bg-yellow-light" />
    </div>
  );
};

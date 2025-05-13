import { DepositTabs } from "@/components/borrow/BorrowTabs";
import Script from "next/script";

const DepositPage = () => {
  return (
    <>
      <div className="h-full dark:bg-[#030711] text-black dark:text-white mt-20">
        <main className="w-full p-8">
          <div className="max-w-xl mx-auto">
            <DepositTabs />
          </div>
        </main>
      </div>
      <Script
        src="https://terminal.jup.ag/main-v1.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default DepositPage;

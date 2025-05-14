import { DepositTabs } from "@/components/borrow/BorrowTabs";

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
    </>
  );
};

export default DepositPage;

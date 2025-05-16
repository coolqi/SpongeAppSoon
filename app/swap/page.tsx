import { SwapTabs } from "@/components/swap/SwapTabs";

export default function SwapPage() {
  return (
    <div className="h-full dark:bg-[#030711] text-black dark:text-white mt-20">
      <main className="w-full p-8">
        <div className="max-w-xl mx-auto">
          <SwapTabs />
        </div>
      </main>
    </div>
  );
}

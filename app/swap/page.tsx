import { CardContainer } from "@/components/ui/Container";
import dynamic from "next/dynamic";

const JupiterClient = dynamic(() => import("@/components/Jupiter"), {
  ssr: false,
});

export default function SwapPage() {
  return (
    <div className="h-full dark:bg-[#030711] text-black dark:text-white mt-20">
      <main className="w-full p-8">
        <div className="max-w-xl mx-auto">
          <CardContainer>
            <main className="p-8">
              <JupiterClient />
            </main>
          </CardContainer>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CardContainer } from "../ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
const tabs = [
  {
    label: "Swap",
    value: "swap",
  },
  {
    label: "Bridge",
    value: "bridge",
  },
];

export const SwapTabs = () => {
  const [selectedTab, setSelectedTab] = useState("swap");
  return (
    <CardContainer>
      <Tabs
        className=""
        value={selectedTab}
        onValueChange={(val) => setSelectedTab(val)}
      >
        <TabsList className="w-auto mb-6 bg-green-dark p-2 rounded-2xl border-4 border-black text-black/60 text-[15px]">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-2 py-1 data-[state=active]:bg-green-light data-[state=active]:shadow-inner-green data-[state=active]:border-green-lighter data-[state=active]:text-black font-bold"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={selectedTab} className="mt-0">
          {selectedTab}
        </TabsContent>
      </Tabs>
    </CardContainer>
  );
};

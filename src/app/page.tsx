"use client";

import ExampleComponent from "@/components/data-visualiser";
export default function Home() {
  return (
     <main className="flex min-h-screen flex-col">
      <div className="text-4xl border-b p-4 w-full font-bold text-[#219661]" >finrep</div>
       <ExampleComponent />
     </main>
  );
}

import Header from "@/components/header";
import ChatBot from "@/components/dashboard-components/ChatBot";
import News from "@/components/dashboard-components/News";
import Menu from "@/components/menu";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-4 left-[15vw] w-[400px] h-[300px] opacity-30 pointer-events-none">
          <div className="absolute top-4 left-[15vw] w-[300px] h-[300px] rounded-full bg-primary blur-[90px]"></div>
        </div>
      <Header />
      <div className="flex flex-1 relative">
        {/* Left sidebar menu - fixed width 70px */}
        <div className="w-[80px] flex-shrink-0 max-h-full">
          <Menu />
        </div>
        
        {/* Main content area - flexible width */}
        <div className="flex-1  mt-14">
          <ChatBot />
        </div>
        
        {/* Right sidebar news - fixed width 378px */}
        <div className="w-[400px] flex-shrink-0 mr-[70px] mt-14">
          <News />
        </div>
      </div>
    </div>
  );
}

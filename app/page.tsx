import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Visa } from "@/components/sections/Visa";
import { BuckeyeInvestment } from "@/components/sections/BuckeyeInvestment";
import { OsuResearch } from "@/components/sections/OsuResearch";
import { Nvidia } from "@/components/sections/Nvidia";
import { Inference } from "@/components/sections/Inference";
import { Agent } from "@/components/sections/Agent";
import { AlsoBuilt } from "@/components/sections/AlsoBuilt";
import { Leadership } from "@/components/sections/Leadership";
import { StudiedBuilt } from "@/components/sections/StudiedBuilt";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        {/* Experience: both internships, then research & learning */}
        <Visa />
        <BuckeyeInvestment />
        <OsuResearch />
        <Nvidia />
        {/* Projects */}
        <Inference />
        <Agent />
        <AlsoBuilt />
        <Leadership />
        <StudiedBuilt />
        <Contact />
      </main>
    </>
  );
}

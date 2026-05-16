import Hero from "../components/Hero";
import WhoWeWorkWith from "../components/WhoWeWorkWith";
import Equipment from "../components/Equipment";
import Services from "../components/Services";
import Lanes from "../components/Lanes";
import About from "../components/About";

const Banner = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-full h-[300px] md:h-[400px] relative border-y border-slate-700/80">
    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-[#0B0F14] z-10"></div>
    <div className="absolute inset-0 bg-[#0B0F14]/20 z-10"></div>
    <img src={src} alt={alt} className="w-full h-full object-cover brightness-110" />
  </div>
);

export default function Home() {
  return (
    <div className="bg-[#0B0F14] min-h-screen">
      <Hero />
      <Banner src="/banner_odessa_pipe.png" alt="Flatbed hauling steel pipe near Odessa Texas" />
      <WhoWeWorkWith />
      <Banner src="/banner_texas_lumber.png" alt="Flatbed lumber load on Texas highway" />
      <Equipment />
      <Services />
      <Banner src="/banner_houston_refinery.png" alt="Industrial refinery freight near Houston" />
      <Lanes />
      <About />
    </div>
  );
}

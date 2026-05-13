import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Hero />
      <Services />
      <About />
    </div>
  );
}

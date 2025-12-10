"use client"
import Navbar from "./components/navbar";
import DarkVeil from "./components/darkveil";


export default function Home() {

  return (
    <div className="flex flex-col items-center relative min-w-screen min-h-screen overflow-hidden">

      {/* background */}
      <div className="min-h-screen inset-0 -z-10 absolute">
        <DarkVeil
          hueShift={360}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={5}
          resolutionScale={1}
        />
      </div>

      {/* navbar */}
      <div className="w-full h-16 mt-20">
        <Navbar/>
      </div>

      {/* content */}
      <div className="flex flex-col items-center justify-center gap-10 mt-20">
        <h3 className="font-noto font-bold text-white text-3xl">Brain Tumor Detection APP</h3>
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-4xl mx-auto mt-4">
          <p className="font-noto font-light text-white text-center">
            Using Support Vector Machine Classifier (SVC)
            <br />
            The model is able to classify brain tumor
            <br />
            from MRI Image with 94% accuracy.
          </p>
        </div>
        
        
        {/* buttons */}
        <div className="flex h-fit gap-5">
          <a href="/prediction" className="font-noto hover:bg-white/20 text-white px-6 py-3 rounded-full bg-white/50 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-4xl mx-auto mt-4">Get Started</a>
          <a href="/about" className="font-noto hover:bg-white/20 text-white px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-4xl mx-auto mt-4">Learn More</a>
        </div>
      </div>
    </div>
  );
}

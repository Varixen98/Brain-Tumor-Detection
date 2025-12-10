"use client"
import Navbar from "../components/navbar";
import DarkVeil from "../components/darkveil";


export default function About(){


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
                <p className="font-noto font-light text-white text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-4xl mx-auto mt-4">
                  The deployment model consist of backend and frontend.
                  <br />
                  The backend is deployed using Render.com with FastAPI Framework.
                   <br />
                  The frontend is deployed using Vercel.com with Next.js Framework.
                </p>
            
            <div className="w-full grid grid-cols-2 gap-10">
               
                <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-4xl mx-auto mt-4">
                    <h4 className="text-2xl font-noto font-bold text-white text-center">
                        The preprocessing consist of:
                    </h4>
                    <ul className="font-noto font-light text-white text-center">
                        <li>Grayscaled: convert 3 class image to 1 class</li>
                        <li>Smoothing: Reduce noise of the image using GaussianBlur</li>
                        <li>Enhancing: Increase contrast of the smoothed image using CLAHE</li>
                    </ul>
                </div>
                
                <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-4xl mx-auto mt-4">
                    <h4 className="text-2xl font-noto font-bold text-white text-center">
                        The Feature Extraction consist of:
                    </h4>
                    <ul className="font-noto font-light text-white text-center">
                        <li>Local Binary Pattern (LBP): Extract brain tumor texture </li>
                        <li>Histogram Oriented Gradient (HOG): Extract the brain tumor shape/structure</li>
                        <li>Gray Level Co-Ocurrence Matrix (GLCM): Extract brain tissue texture</li>
                    </ul>
                </div>
            </div>
                
            </div>
        </div>
    );

}
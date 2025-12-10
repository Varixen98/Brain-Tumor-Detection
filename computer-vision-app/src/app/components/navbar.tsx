
export default function Navbar(){
    return(
       <header className="min-w-screen w-fit flex items-center justify-center">
            <nav className="w-[85%] h-16 flex items-center justify-between px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] max-w-4xl mx-auto mt-4">
                <div className="flex items-center gap-2 h-fit">
                    <img src="/logo.svg" alt="Gambar logo" className="h-14"/>
                    <a href="/" className="font-noto text-white text-xl font-bold">Computer Vision</a>
                </div>
                
                <div className="h-fit w-fit">
                    <a href="#" className="font-noto text-[18px] font-bold text-white hover:bg-white/15 px-4 py-2 rounded-4xl">Docs</a>
                </div>
            </nav>
       </header> 
    );
}
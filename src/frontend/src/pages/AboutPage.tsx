import type { TabId } from "../App";

interface AboutPageProps {
  onNavigate: (tab: TabId) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 border-b-2 border-black bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="p-2 rounded-xl border-2 border-black hover:bg-red-50 active:translate-x-[2px] active:translate-y-[2px] transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none"
              aria-label="Go back to home"
            >
              <span className="material-symbols-outlined text-xl leading-none">
                arrow_back
              </span>
            </button>
            <h1 className="font-headline font-black text-xl uppercase tracking-tight text-black">
              About the App
            </h1>
          </div>
          <span className="material-symbols-outlined text-red-700 text-2xl">
            info
          </span>
        </div>
      </header>

      {/* Page Content */}
      <main className="pt-28 pb-32 px-4 max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-red-600 h-24 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-black overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDYRqIDC315zGan3WMKgvh-rg8y5l0CkazvpClWg4_RP5vy52fdY5MYgcnAxiw6eo2URy3SM6pkZjt8mh4YsbX5VGpUnB_mmouDpxoZLhAcgNakj7_qH5UcQNCiAnMZQpHczwbZA_cAgp6pYZboNJNNlAN-VBEqQ9QNPcLh1QJZ2vcnHNpCRGfhgVt2bP7GJrDwGmFT-RsZEwO_Tgb-iLJiG2sM7a0KD72JdNEGJ3wVgcmmddrs5RULvZruh_7AzNz9YL96ADc4MYi"
                  alt="Dr. Adil"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-6 text-center">
            <h2 className="font-headline font-black text-2xl text-black tracking-tight">
              Dr. Adil
            </h2>
            <span className="inline-flex items-center gap-1 mt-1 bg-red-100 text-red-700 text-xs font-black font-headline uppercase tracking-widest px-3 py-1 rounded-full border border-black">
              <span className="material-symbols-outlined text-sm leading-none">
                local_hospital
              </span>
              House Surgeon
            </span>
            <p className="mt-4 text-on-surface font-medium text-base leading-relaxed">
              I'm Adil, currently doing my house surgency.
            </p>
          </div>
        </div>

        {/* About the App Card */}
        <div className="bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-xl leading-none">
                auto_stories
              </span>
            </div>
            <h3 className="font-headline font-black text-lg text-black uppercase tracking-tight">
              About the App
            </h3>
          </div>
          <p className="text-on-surface font-medium leading-relaxed">
            <span className="font-headline font-black text-red-700">
              Learn with Dr. Adil
            </span>{" "}
            is designed to help you master MCQs effectively. You can also use
            the <span className="font-bold text-black">PYQ tab</span> to
            practice frequently asked questions and strengthen your preparation.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-surface-container-low border-2 border-black rounded-3xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-xl leading-none">
                school
              </span>
            </div>
            <h3 className="font-headline font-black text-lg text-black uppercase tracking-tight">
              Our Mission
            </h3>
          </div>
          <p className="text-on-surface font-medium leading-relaxed">
            This app is a small initiative to support your learning journey.
          </p>
        </div>

        {/* Open Invitation Card */}
        <div className="bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 bg-red-600 rounded-xl border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-xl leading-none">
                forum
              </span>
            </div>
            <div>
              <h3 className="font-headline font-black text-lg text-black uppercase tracking-tight mb-2">
                Open Door
              </h3>
              <p className="text-on-surface font-medium leading-relaxed">
                Feel free to ask your doubts anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Quote — featured card */}
        <div className="bg-red-600 border-2 border-black rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 text-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-500 rounded-full opacity-40 border-2 border-black" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-red-700 rounded-full opacity-30 border-2 border-black" />
          <div className="relative z-10">
            <span
              className="material-symbols-outlined text-white text-4xl mb-4 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <p className="font-headline font-black text-2xl text-white leading-snug tracking-tight">
              Consistent hard work leads to success
            </p>
            <p className="text-3xl mt-2">✨🌟</p>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onNavigate("modules")}
            className="flex flex-col items-center gap-2 p-5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-red-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-red-700 text-2xl">
              library_books
            </span>
            <span className="font-headline font-black text-sm uppercase tracking-widest text-black">
              Modules
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("pyq")}
            className="flex flex-col items-center gap-2 p-5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-red-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-red-700 text-2xl">
              history_edu
            </span>
            <span className="font-headline font-black text-sm uppercase tracking-widest text-black">
              PYQ
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}

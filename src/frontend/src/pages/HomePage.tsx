import type { TabId } from "../App";

interface HomePageProps {
  onNavigate: (tab: TabId) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
      {/* Hero Quote Section */}
      <div className="relative mb-12">
        <div className="absolute -top-12 -left-8 opacity-10 pointer-events-none">
          <span
            className="material-symbols-outlined text-[160px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            format_quote
          </span>
        </div>
        <div className="bg-white border-2 border-black rounded-[2rem] p-8 md:p-16 neo-brutal-shadow relative z-10">
          <div className="flex flex-col gap-8">
            <span className="font-label text-[#af101a] font-extrabold uppercase tracking-[0.2em] text-sm md:text-base">
              Daily Wisdom
            </span>
            <h2 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-black">
              Medicine is a science of uncertainty and an{" "}
              <span className="text-[#af101a] italic px-2 bg-[#ffdad6]/20 rounded-xl border-2 border-black neo-brutal-shadow-sm inline-block transform -rotate-1">
                art of probability.
              </span>
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-[2px] w-12 bg-black" />
              <p className="font-headline font-bold text-xl md:text-2xl text-black/60">
                William Osler
              </p>
            </div>
          </div>
        </div>
        {/* Asymmetric Decor */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#d32f2f] rounded-full border-2 border-black hidden md:block z-0" />
      </div>

      {/* Primary Action */}
      <div className="flex flex-col items-center justify-center gap-6">
        <button
          type="button"
          data-ocid="home.primary_button"
          onClick={() => onNavigate("modules")}
          className="group relative bg-[#af101a] hover:bg-[#d32f2f] text-white px-10 py-6 rounded-full border-2 border-black neo-brutal-shadow neo-brutal-press transition-all flex items-center gap-4"
        >
          <span className="font-headline font-black text-2xl uppercase tracking-tighter">
            Start Drilling
          </span>
          <span
            className="material-symbols-outlined text-3xl transition-transform group-hover:translate-x-2"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            rocket_launch
          </span>
        </button>
        <p className="font-label text-sm font-bold text-[#5e5e5e] uppercase tracking-widest">
          342 Questions Ready Today
        </p>
      </div>

      {/* Bento Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Analytics — wide */}
        <div
          data-ocid="home.analytics.card"
          className="md:col-span-2 bg-white border-2 border-black rounded-3xl p-8 neo-brutal-shadow flex flex-col justify-between group overflow-hidden relative cursor-pointer"
        >
          <div className="relative z-10">
            <div className="bg-[#bee9ff] w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-6 neo-brutal-shadow-sm">
              <span className="material-symbols-outlined text-black">
                trending_up
              </span>
            </div>
            <h3 className="font-headline text-3xl font-extrabold mb-2">
              Performance Analytics
            </h3>
            <p className="text-[#5e5e5e] text-lg max-w-sm">
              Deep dive into your mastery across 12 distinct medical modules
              with real-time feedback.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 transition-transform group-hover:scale-110 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]">
              bar_chart
            </span>
          </div>
        </div>

        {/* Average Score */}
        <div
          data-ocid="home.score.card"
          className="bg-[#d32f2f] text-white border-2 border-black rounded-3xl p-8 neo-brutal-shadow flex flex-col items-center justify-center text-center"
        >
          <span className="font-headline text-5xl font-black mb-2">89%</span>
          <p className="font-label font-bold uppercase tracking-widest text-sm">
            Average Score
          </p>
          <div className="w-full h-2 bg-black/20 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-white w-[89%] border-r-2 border-black" />
          </div>
        </div>

        {/* Review Modules */}
        <button
          type="button"
          data-ocid="home.modules.button"
          onClick={() => onNavigate("modules")}
          className="bg-white border-2 border-black rounded-3xl p-6 neo-brutal-shadow-sm flex items-center gap-4 hover:bg-[#f3f3f4] transition-colors cursor-pointer text-left"
        >
          <div className="bg-[#e2e2e2] w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-black">
              menu_book
            </span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg leading-tight">
              Review Modules
            </h4>
            <p className="text-sm text-[#5e5e5e]">
              Refresh your foundational knowledge
            </p>
          </div>
        </button>

        {/* Past Sessions */}
        <button
          type="button"
          data-ocid="home.past_sessions.button"
          onClick={() => onNavigate("modules")}
          className="bg-white border-2 border-black rounded-3xl p-6 neo-brutal-shadow-sm flex items-center gap-4 hover:bg-[#f3f3f4] transition-colors cursor-pointer text-left"
        >
          <div className="bg-[#ffdad6] w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[#af101a]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              history
            </span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg leading-tight">
              Past Sessions
            </h4>
            <p className="text-sm text-[#5e5e5e]">Resume where you left off</p>
          </div>
        </button>

        {/* Global Ranking */}
        <button
          type="button"
          data-ocid="home.ranking.button"
          onClick={() => onNavigate("modules")}
          className="bg-white border-2 border-black rounded-3xl p-6 neo-brutal-shadow-sm flex items-center gap-4 hover:bg-[#f3f3f4] transition-colors cursor-pointer text-left"
        >
          <div className="bg-[#bee9ff] w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#005f7b]">
              emoji_events
            </span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg leading-tight">
              Global Ranking
            </h4>
            <p className="text-sm text-[#5e5e5e]">See how you stack up</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-24 text-center text-sm text-[#5e5e5e]">
        <p>
          &copy; {new Date().getFullYear()}. Built with{" "}
          <span className="text-[#af101a]">&#10084;</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

import { Toaster } from "@/components/ui/sonner";
import { useBackendData } from "@/hooks/useBackendData";
import { useRef, useState } from "react";
import AboutPage from "./pages/AboutPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ContentManagerPage from "./pages/ContentManagerPage";
import HomePage from "./pages/HomePage";
import MCQPage from "./pages/MCQPage";
import ModulesPage from "./pages/ModulesPage";
import PYQPage from "./pages/PYQPage";

export type TabId = "home" | "mcq" | "modules" | "pyq" | "admin" | "about";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  // Subject filter for MCQ tab — set when "Start Practice" is clicked from a module
  const [mcqSubjectFilter, setMcqSubjectFilter] = useState<string | null>(null);
  // Auto-start flag — when true, MCQPage starts the quiz immediately without user input
  const [mcqAutoStart, setMcqAutoStart] = useState(false);

  // Shared data store — instantiated ONCE and kept stable for the entire app lifetime.
  // All pages (admin + student) read from the same state so changes made in the
  // admin Content Manager are immediately visible on the student-facing Modules page.
  // useAdminDataStore() is called directly here (no Context Provider needed) — it
  // creates the state once in this component and threads it down as props.
  const adminData = useBackendData();

  // Hidden logo tap trigger refs
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  // Capture activeTab as a string so TypeScript doesn't narrow it after early returns
  const currentTab: string = activeTab;

  function handleLogoTap() {
    const now = Date.now();
    if (now - lastTapRef.current > 3000) {
      tapCountRef.current = 1;
    } else {
      tapCountRef.current += 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      handleTabChange("admin");
    }
  }

  function handleTabChange(tab: TabId) {
    if (tab !== "admin") {
      setIsAdminAuthenticated(false);
    }
    // Clear subject filter and autoStart when manually navigating away from MCQ tab
    if (tab !== "mcq") {
      setMcqSubjectFilter(null);
      setMcqAutoStart(false);
    }
    setActiveTab(tab);
  }

  // Called from ModulesPage "Start Practice" — navigate to MCQ tab filtered by subject
  // and immediately auto-start the quiz (no extra click needed)
  function handleStartPractice(subjectId: string) {
    setMcqSubjectFilter(subjectId);
    setMcqAutoStart(true);
    setActiveTab("mcq");
  }

  // Called from ContentManagerPage "Back" — logs admin out and navigates to modules
  // so admin-added subjects are immediately visible.
  function handleContentManagerBack() {
    setIsAdminAuthenticated(false);
    setActiveTab("modules");
  }

  // About — standalone full-screen page
  if (activeTab === "about") {
    return (
      <>
        <AboutPage onNavigate={handleTabChange} adminData={adminData} />
        <Toaster />
      </>
    );
  }

  // Admin authenticated: go directly to ContentManagerPage (no dashboard)
  if (activeTab === "admin" && isAdminAuthenticated) {
    return (
      <>
        <ContentManagerPage
          adminData={adminData}
          onBack={handleContentManagerBack}
        />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={handleTabChange} adminData={adminData} />;
      case "mcq":
        return (
          <MCQPage
            adminData={adminData}
            subjectFilter={mcqSubjectFilter}
            autoStart={mcqAutoStart}
            onClearFilter={() => {
              setMcqSubjectFilter(null);
              setMcqAutoStart(false);
            }}
            onBackToModules={() => handleTabChange("modules")}
          />
        );
      case "modules":
        return (
          <ModulesPage
            adminData={adminData}
            onStartPractice={handleStartPractice}
          />
        );
      case "pyq":
        return <PYQPage adminData={adminData} />;
      case "admin":
        return (
          <AdminLoginPage onSuccess={() => setIsAdminAuthenticated(true)} />
        );
      default:
        return <HomePage onNavigate={handleTabChange} adminData={adminData} />;
    }
  };

  return (
    <div className="bg-background font-body text-on-background antialiased overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 border-b-2 border-black bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-7xl mx-auto">
          {/* Logo — hidden 5-tap admin trigger (presentational, no keyboard role) */}
          <button
            type="button"
            className="flex items-center gap-3 cursor-default select-none bg-transparent border-0 p-0 focus:outline-none"
            onClick={handleLogoTap}
            tabIndex={-1}
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-red-700 text-2xl">
              school
            </span>
            <h1 className="font-headline font-bold tracking-tight text-xl text-black uppercase">
              Learn with Dr. Adil
            </h1>
          </button>
          <div className="hidden md:flex gap-6 items-center">
            <nav className="flex gap-8 font-label text-sm font-bold uppercase tracking-widest">
              <button
                type="button"
                data-ocid="nav.home.link"
                onClick={() => handleTabChange("home")}
                className={`transition-transform active:scale-95 hover:opacity-80 ${
                  currentTab === "home" ? "text-red-700" : "text-black"
                }`}
              >
                Home
              </button>
              <button
                type="button"
                data-ocid="nav.modules.link"
                onClick={() => handleTabChange("modules")}
                className={`transition-transform active:scale-95 hover:opacity-80 ${
                  currentTab === "modules" || currentTab === "mcq"
                    ? "text-red-700"
                    : "text-black"
                }`}
              >
                Modules
              </button>
              <button
                type="button"
                data-ocid="nav.pyq.link"
                onClick={() => handleTabChange("pyq")}
                className={`transition-transform active:scale-95 hover:opacity-80 ${
                  currentTab === "pyq" ? "text-red-700" : "text-black"
                }`}
              >
                PYQ
              </button>
              <button
                type="button"
                data-ocid="nav.about.link"
                onClick={() => handleTabChange("about")}
                className={`transition-transform active:scale-95 hover:opacity-80 ${
                  currentTab === "about" ? "text-red-700" : "text-black"
                }`}
              >
                About
              </button>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden neo-brutal-shadow-sm">
              <img
                alt="Dr. Adil Profile"
                src="/assets/generated/dr-adil-avatar.dim_200x200.jpg"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{renderPage()}</main>

      {/* Bottom Nav Bar — mobile only */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t-2 border-black z-50 md:hidden">
        <button
          type="button"
          data-ocid="bottom.home.link"
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center justify-center px-3 py-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none ${
            currentTab === "home"
              ? "bg-red-600 text-white rounded-xl border-2 border-black -translate-x-0.5 -translate-y-0.5 neo-brutal-shadow-sm"
              : "text-black hover:bg-stone-100"
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={
              currentTab === "home" ? { fontVariationSettings: "'FILL' 1" } : {}
            }
          >
            home
          </span>
          <span className="font-headline text-[10px] font-bold uppercase mt-0.5">
            Home
          </span>
        </button>

        <button
          type="button"
          data-ocid="bottom.modules.link"
          onClick={() => handleTabChange("modules")}
          className={`flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-95 ${
            currentTab === "modules" || currentTab === "mcq"
              ? "bg-red-600 text-white rounded-xl border-2 border-black -translate-x-0.5 -translate-y-0.5 neo-brutal-shadow-sm"
              : "text-black hover:bg-stone-100"
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={
              currentTab === "modules" || currentTab === "mcq"
                ? { fontVariationSettings: "'FILL' 1" }
                : {}
            }
          >
            library_books
          </span>
          <span className="font-headline text-[10px] font-bold uppercase mt-0.5">
            Modules
          </span>
        </button>

        <button
          type="button"
          data-ocid="bottom.pyq.link"
          onClick={() => handleTabChange("pyq")}
          className={`flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-95 ${
            currentTab === "pyq"
              ? "bg-red-600 text-white rounded-xl border-2 border-black -translate-x-0.5 -translate-y-0.5 neo-brutal-shadow-sm"
              : "text-black hover:bg-stone-100"
          }`}
        >
          <span className="material-symbols-outlined text-xl">history_edu</span>
          <span className="font-headline text-[10px] font-bold uppercase mt-0.5">
            PYQ
          </span>
        </button>

        <button
          type="button"
          data-ocid="bottom.about.link"
          onClick={() => handleTabChange("about")}
          className={`flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-95 ${
            currentTab === "about"
              ? "bg-red-600 text-white rounded-xl border-2 border-black -translate-x-0.5 -translate-y-0.5 neo-brutal-shadow-sm"
              : "text-black hover:bg-stone-100"
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={
              currentTab === "about"
                ? { fontVariationSettings: "'FILL' 1" }
                : {}
            }
          >
            info
          </span>
          <span className="font-headline text-[10px] font-bold uppercase mt-0.5">
            About
          </span>
        </button>
      </nav>

      <Toaster />
    </div>
  );
}

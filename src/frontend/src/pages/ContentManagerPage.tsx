import EssayManager from "@/components/admin/EssayManager";
import MCQHub from "@/components/admin/MCQHub";
import SubjectModuleManager from "@/components/admin/SubjectModuleManager";
import type { AdminData } from "@/hooks/useAdminData";
import { useState } from "react";

type SidebarTab =
  | "modules"
  | "mcqs"
  | "essays"
  | "short-essays"
  | "short-notes";

interface ContentManagerPageProps {
  adminData: AdminData;
  onBack: () => void;
}

export default function ContentManagerPage({
  adminData,
  onBack,
}: ContentManagerPageProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("modules");
  const [savedToast, setSavedToast] = useState(false);

  const tabs: Array<{ id: SidebarTab; label: string; icon: string }> = [
    { id: "modules", label: "Modules", icon: "library_books" },
    { id: "mcqs", label: "MCQs", icon: "quiz" },
    { id: "essays", label: "Essays", icon: "description" },
    { id: "short-essays", label: "Short Essays", icon: "article" },
    { id: "short-notes", label: "Short Notes", icon: "edit_note" },
  ];

  function handleSave() {
    // Show confirmation immediately — data is already committed to the shared
    // store via individual modal save buttons. This button just provides a
    // visual confirmation and navigates back so changes are visible on student pages.
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 2000);
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="bg-[#f9f9f9] border-b-2 border-black fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-4">
          <button
            type="button"
            data-ocid="content_manager.back.button"
            onClick={onBack}
            className="active:translate-x-[2px] active:translate-y-[2px] transition-all p-2 hover:bg-zinc-100 rounded-full"
          >
            <span className="material-symbols-outlined text-primary">
              arrow_back
            </span>
          </button>
          <h1 className="text-lg font-black text-black font-headline tracking-tight">
            Content Manager
          </h1>
        </div>
        <button
          type="button"
          data-ocid="content_manager.save.button"
          onClick={handleSave}
          className={`active:translate-x-[2px] active:translate-y-[2px] transition-all px-6 py-2 rounded-full border-2 border-black font-headline font-bold text-sm flex items-center gap-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:shadow-none ${
            savedToast
              ? "bg-green-600 text-white"
              : "bg-primary-container text-white"
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {savedToast ? "check" : "save"}
          </span>
          {savedToast ? "Saved!" : "Save"}
        </button>
      </header>

      {/* Saved toast */}
      {savedToast && (
        <div className="fixed top-20 right-4 z-[60] bg-green-600 text-white border-2 border-black rounded-xl px-4 py-2 font-headline font-bold text-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-sm">
            check_circle
          </span>
          Changes saved — live on student pages now!
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 z-40 bg-[#f9f9f9] border-r-2 border-black pt-20 hidden md:block overflow-y-auto">
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-white shrink-0">
            <img
              alt="Dr. Adil"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaedsnwvFtCkG-WJiOXefMtdkdUn1vEs3ZyZYF-QN0DI039hb_l6QYKa8vuVkFXSNXGa2Pcg6q9XyhkOb_eoD2lsgFBQ24b5eXEe8bIiOE4lOeedw0wsJ-cHneaNRuyRMVFijLJs4U7HUxuaAa9IDZtMLGX2_SbpQ11NKwcsdIe9OBsJDfcHAHWsXIYzOZW2stTkX6Up7xf4n26D9KaLaTiwJUcrLKtzefZ7-JKbgGOraV4KV51X8063wIT_HPLvhMKJENyDNz753L"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-headline font-black text-black text-lg">
              Dr. Adil
            </h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Administrator
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 pb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`content_manager.${tab.id}.tab`}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "bg-[#d32f2f] text-white border-2 border-black rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-all active:scale-[0.98] text-left shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  : "text-black px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#f3f3f4] rounded-lg transition-all active:scale-[0.98] text-left"
              }
            >
              <span className="material-symbols-outlined shrink-0">
                {tab.icon}
              </span>
              <span className="font-headline font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tab bar — scrollable */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-[#f9f9f9] border-t-2 border-black flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-ocid={`content_manager.mobile.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex flex-col items-center justify-center py-2 px-3 gap-0.5 transition-colors ${
              activeTab === tab.id
                ? "text-primary border-t-2 border-primary"
                : "text-zinc-500"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {tab.icon}
            </span>
            <span className="font-headline font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="md:pl-72 pt-20 px-4 pb-20 md:pb-12">
        <div className="max-w-5xl mx-auto py-8">
          {activeTab === "modules" && (
            <SubjectModuleManager
              subjects={adminData.subjects}
              modules={adminData.modules}
              addSubject={adminData.addSubject}
              updateSubject={adminData.updateSubject}
              deleteSubject={adminData.deleteSubject}
              addModule={adminData.addModule}
              updateModule={adminData.updateModule}
              deleteModule={adminData.deleteModule}
            />
          )}

          {activeTab === "mcqs" && (
            <MCQHub
              subjects={adminData.subjects}
              modules={adminData.modules}
              mcqs={adminData.mcqs}
              addMCQ={adminData.addMCQ}
              updateMCQ={adminData.updateMCQ}
              deleteMCQ={adminData.deleteMCQ}
            />
          )}

          {activeTab === "essays" && (
            <EssayManager
              title="Essay Manager"
              description="Organize long-form essay topics by module. Add modules and tick topics when completed."
              icon="description"
              essayModules={adminData.essayModules}
              addEssayModule={adminData.addEssayModule}
              deleteEssayModule={adminData.deleteEssayModule}
              addEssayTopic={adminData.addEssayTopic}
              deleteEssayTopic={adminData.deleteEssayTopic}
              toggleEssayTopic={adminData.toggleEssayTopic}
            />
          )}

          {activeTab === "short-essays" && (
            <EssayManager
              title="Short Essay Manager"
              description="Manage short essay topics by module. Add modules and tick topics when completed."
              icon="article"
              essayModules={adminData.shortEssayModules}
              addEssayModule={adminData.addShortEssayModule}
              deleteEssayModule={adminData.deleteShortEssayModule}
              addEssayTopic={adminData.addShortEssayTopic}
              deleteEssayTopic={adminData.deleteShortEssayTopic}
              toggleEssayTopic={adminData.toggleShortEssayTopic}
            />
          )}

          {activeTab === "short-notes" && (
            <EssayManager
              title="Short Note Manager"
              description="Manage short note topics by module. Add modules and tick topics when completed."
              icon="edit_note"
              essayModules={adminData.shortNoteModules}
              addEssayModule={adminData.addShortNoteModule}
              deleteEssayModule={adminData.deleteShortNoteModule}
              addEssayTopic={adminData.addShortNoteTopic}
              deleteEssayTopic={adminData.deleteShortNoteTopic}
              toggleEssayTopic={adminData.toggleShortNoteTopic}
            />
          )}
        </div>
      </main>

      {/* Background dot pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
    </div>
  );
}

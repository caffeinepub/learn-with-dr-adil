interface AdminDashboardPageProps {
  onNavigateToContent: () => void;
  onLogout: () => void;
}

export default function AdminDashboardPage({
  onNavigateToContent,
  onLogout,
}: AdminDashboardPageProps) {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 border-b-2 border-black bg-white/70 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-primary-container shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Dr. Adil"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc_riETX1TFdddWaQCGnyblHB2dKhiqO_lGPg_IEg3ArtzzzyMJf0wDZsdSbJGpO6LQLKQvgnrBbWCs9LkhgX_pE2NrT_Y6huI5kBQQgdJYwRszHu6oB183fXBE-GJ71PQ1gA3GD75nPcpAZLn3erTTgr9oOq4rlqv7MYl_m0TSu7_ntWNH7sZ4N5kHTj0aC4H1g2A9UAJufRMfRDvXuMy5dBvn36Q44F7Yop3iK3oJWVusPem_NSqV_G9GbeuF7bJpBlIM1uQLWqT"
            />
          </div>
          <h1 className="text-xl font-black text-black uppercase font-headline tracking-tight">
            Admin Panel
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8">
            <button
              type="button"
              data-ocid="admin.dashboard.tab"
              className="text-red-700 font-bold font-headline uppercase text-sm tracking-wider"
            >
              Dashboard
            </button>
            <button
              type="button"
              data-ocid="admin.content.tab"
              onClick={onNavigateToContent}
              className="text-black/60 font-bold font-headline uppercase text-sm tracking-wider hover:text-primary transition-colors"
            >
              Content
            </button>
            <button
              type="button"
              data-ocid="admin.users.tab"
              className="text-black/60 font-bold font-headline uppercase text-sm tracking-wider hover:text-primary transition-colors"
            >
              Users
            </button>
          </nav>
          <button
            type="button"
            data-ocid="admin.notifications.button"
            className="p-2 rounded-full hover:bg-red-50 transition-colors text-black"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-32 px-6 max-w-7xl mx-auto">
        {/* Welcome Hero */}
        <section className="mb-12">
          <div className="bg-primary-container border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div className="relative z-10 text-on-primary-container">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold font-headline uppercase tracking-widest mb-4 inline-block">
                System Status: Active
              </span>
              <h2 className="text-4xl md:text-5xl font-black font-headline mb-2 leading-tight">
                Welcome back, Dr. Adil.
              </h2>
              <p className="text-lg opacity-90 max-w-xl">
                Your academic ecosystem is thriving. You have 2 pending reviews
                that require your expert critique today.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <button
                type="button"
                data-ocid="admin.review_essays.primary_button"
                className="bg-white text-primary border-2 border-black rounded-full px-8 py-4 font-black font-headline uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none w-full md:w-auto flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">edit_note</span>
                Review Essays
              </button>
            </div>
            {/* Abstract decorations */}
            <div className="absolute -right-10 -top-10 w-64 h-64 border-[16px] border-white/10 rounded-full" />
            <div className="absolute right-20 bottom-[-40px] w-40 h-40 bg-white/5 rounded-xl rotate-12" />
          </div>
        </section>

        {/* Quick Overview */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">
              analytics
            </span>
            <h3 className="text-2xl font-bold font-headline">Quick Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Students */}
            <div
              data-ocid="admin.students.card"
              className="bg-surface-container-lowest border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-blue-100 border-2 border-black rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-blue-700">
                    group
                  </span>
                </div>
                <p className="font-headline font-bold text-sm uppercase tracking-wider text-black/60">
                  Total Students
                </p>
                <h4 className="text-4xl font-black font-headline mt-1">
                  1,284
                </h4>
              </div>
              <div className="mt-4 flex items-center gap-2 text-green-600 font-bold text-sm">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                <span>+12% this month</span>
              </div>
            </div>

            {/* Questions Added */}
            <div
              data-ocid="admin.questions.card"
              className="bg-surface-container-lowest border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-primary-fixed border-2 border-black rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary">
                    quiz
                  </span>
                </div>
                <p className="font-headline font-bold text-sm uppercase tracking-wider text-black/60">
                  Questions Added
                </p>
                <h4 className="text-4xl font-black font-headline mt-1">
                  4,502
                </h4>
              </div>
              <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-sm">
                  add_circle
                </span>
                <span>84 added today</span>
              </div>
            </div>

            {/* Essays Reviewed */}
            <div
              data-ocid="admin.essays.card"
              className="bg-surface-container-lowest border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-tertiary-fixed border-2 border-black rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-tertiary">
                    rate_review
                  </span>
                </div>
                <p className="font-headline font-bold text-sm uppercase tracking-wider text-black/60">
                  Essays Reviewed
                </p>
                <h4 className="text-4xl font-black font-headline mt-1">312</h4>
              </div>
              <div className="mt-4 flex items-center gap-2 text-tertiary font-bold text-sm">
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
                <span>98% completion rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Lower Grid: Activity + Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  history
                </span>
                <h3 className="text-2xl font-bold font-headline">
                  Recent Activity
                </h3>
              </div>
              <button
                type="button"
                data-ocid="admin.activity.secondary_button"
                className="text-sm font-bold font-headline text-primary uppercase underline underline-offset-4 tracking-wider"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {/* Activity 1 */}
              <div
                data-ocid="admin.activity.item.1"
                className="bg-surface-container-lowest border-2 border-black rounded-xl p-4 flex items-center gap-4 hover:translate-x-2 transition-transform cursor-pointer"
              >
                <div className="min-w-[48px] h-[48px] bg-red-50 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    post_add
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-on-surface">
                    New MCQ added to{" "}
                    <span className="text-primary">Cardiology</span>
                  </p>
                  <p className="text-xs text-black/50 font-medium">
                    By Admin Sarah • 14 minutes ago
                  </p>
                </div>
                <span className="material-symbols-outlined text-black/20">
                  chevron_right
                </span>
              </div>

              {/* Activity 2 */}
              <div
                data-ocid="admin.activity.item.2"
                className="bg-surface-container-lowest border-2 border-black rounded-xl p-4 flex items-center gap-4 hover:translate-x-2 transition-transform cursor-pointer"
              >
                <div className="min-w-[48px] h-[48px] bg-green-50 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-700">
                    task_alt
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-on-surface">
                    User <span className="text-primary">Dr. Smith</span>{" "}
                    completed Hemato Essay
                  </p>
                  <p className="text-xs text-black/50 font-medium">
                    Evaluation pending • 2 hours ago
                  </p>
                </div>
                <span className="material-symbols-outlined text-black/20">
                  chevron_right
                </span>
              </div>

              {/* Activity 3 */}
              <div
                data-ocid="admin.activity.item.3"
                className="bg-surface-container-lowest border-2 border-black rounded-xl p-4 flex items-center gap-4 hover:translate-x-2 transition-transform cursor-pointer"
              >
                <div className="min-w-[48px] h-[48px] bg-blue-50 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-700">
                    person_add
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-on-surface">
                    New registration:{" "}
                    <span className="text-primary">Dr. Elena Rossi</span>
                  </p>
                  <p className="text-xs text-black/50 font-medium">
                    Verified professional • 5 hours ago
                  </p>
                </div>
                <span className="material-symbols-outlined text-black/20">
                  chevron_right
                </span>
              </div>

              {/* Activity 4 */}
              <div
                data-ocid="admin.activity.item.4"
                className="bg-surface-container-lowest border-2 border-black rounded-xl p-4 flex items-center gap-4 hover:translate-x-2 transition-transform cursor-pointer"
              >
                <div className="min-w-[48px] h-[48px] bg-amber-50 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-700">
                    warning
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-on-surface">
                    Content Flag:{" "}
                    <span className="text-primary">Neurology Module</span>
                  </p>
                  <p className="text-xs text-black/50 font-medium">
                    Typo reported by 3 users • 1 day ago
                  </p>
                </div>
                <span className="material-symbols-outlined text-black/20">
                  chevron_right
                </span>
              </div>
            </div>
          </div>

          {/* Pending Actions Sidebar */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">
                assignment_late
              </span>
              <h3 className="text-2xl font-bold font-headline">
                Pending Actions
              </h3>
            </div>
            <div
              data-ocid="admin.pending_actions.panel"
              className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="bg-primary p-4 text-white font-headline font-bold text-center border-b-2 border-black">
                CRITICAL TASKS
              </div>
              <div className="p-6 space-y-6">
                {/* Task 1: Essays */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 min-w-[40px] bg-red-100 rounded-lg flex items-center justify-center border-2 border-black">
                    <span className="text-primary font-black">2</span>
                  </div>
                  <div>
                    <h5 className="font-bold leading-tight">
                      Essays awaiting critique
                    </h5>
                    <p className="text-sm text-black/60 mt-1">
                      Submit by EOD to maintain student feedback streak.
                    </p>
                    <button
                      type="button"
                      data-ocid="admin.review_essays.secondary_button"
                      className="mt-3 text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Review Now{" "}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
                <div className="h-px bg-black/10" />
                {/* Task 2: User verifications */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 min-w-[40px] bg-blue-100 rounded-lg flex items-center justify-center border-2 border-black">
                    <span className="text-blue-700 font-black">5</span>
                  </div>
                  <div>
                    <h5 className="font-bold leading-tight">
                      New user verifications
                    </h5>
                    <p className="text-sm text-black/60 mt-1">
                      Confirm medical credentials for new access requests.
                    </p>
                    <button
                      type="button"
                      data-ocid="admin.users.secondary_button"
                      className="mt-3 text-blue-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Go to Users{" "}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Tip Card */}
            <div className="mt-8 bg-surface-container-low border-2 border-black rounded-xl p-6 relative">
              <span
                className="material-symbols-outlined absolute top-4 right-4 text-primary opacity-20 text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                school
              </span>
              <h4 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-2">
                Academic Tip
              </h4>
              <p className="text-sm italic text-on-surface-variant font-medium">
                "Consistent feedback is the cornerstone of pedagogical
                excellence. Aim for a 24-hour turnaround on essay critiques."
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Admin Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white border-t-2 border-black rounded-t-[1.5rem] shadow-[0_-4px_0px_0px_rgba(0,0,0,1)]">
        <button
          type="button"
          data-ocid="admin.nav.dashboard.tab"
          className="flex flex-col items-center justify-center bg-red-600 text-white rounded-full px-5 py-2 border-2 border-black active:scale-95 transition-all duration-150"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-wider mt-0.5">
            Dashboard
          </span>
        </button>
        <button
          type="button"
          data-ocid="admin.nav.content.tab"
          onClick={onNavigateToContent}
          className="flex flex-col items-center justify-center text-black p-2 hover:scale-105 transition-transform active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-wider mt-0.5">
            Content
          </span>
        </button>
        <button
          type="button"
          data-ocid="admin.nav.users.tab"
          className="flex flex-col items-center justify-center text-black p-2 hover:scale-105 transition-transform active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined">group</span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-wider mt-0.5">
            Users
          </span>
        </button>
        <button
          type="button"
          data-ocid="admin.nav.settings.tab"
          onClick={onLogout}
          className="flex flex-col items-center justify-center text-black p-2 hover:scale-105 transition-transform active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-wider mt-0.5">
            Settings
          </span>
        </button>
      </nav>
    </div>
  );
}

import { useState } from "react";

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export default function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === "Tesla369") {
      setError("");
      onSuccess();
    } else {
      setError("Incorrect key. Please try again.");
    }
  }

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Decorative ornaments */}
      <div className="fixed bottom-10 left-10 hidden lg:block opacity-[0.07] z-0">
        <img
          alt="Stack of books"
          className="w-40 h-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCouEnJjnac0RT5xGtCs8iuRPjDDgD7nudVc6EdKl4qJ9H3gVLoID-5AN8QPZAW5C4-RudefeGY_i6NjgdTq_jMrDsie9aO0NznSlYZG8gSLzapUsMWBIwYv4rvy9Eni-PBiUIDN4wfNuWAC_FoSFDe70mQHUvDSocfwb9NtjGH0S46vHBW9TjI2308GEuA2En449BirspPOCGobYaODQpIqRTzkCvTe8mIl1KH85DgIre1acHBzrIgePAHaC_gcLlVLYVW7LqJD0l8"
        />
      </div>
      <div className="fixed top-10 right-10 hidden lg:block opacity-[0.07] z-0">
        <img
          alt="Scales of justice"
          className="w-40 h-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqBXr998RD5mnqWMpkWEwvDf8Dy2Q_0jfN-TubvVk6VAxntWNvAAy9LjQJPUyndXRd3N4lsfuBy0PKXpEL3VuG9fq_Be5dN0_xD9L08LG2wfz1QpsxY_Zcj_AAvONWmd0GXW9bPDfdCaXQtNd4g--p_buc83OgbDhWmrbOqtJ3bsHvxLgOhaqMcK0iT2CBMsZqu5vtkXOf3SypX2Rz6lRR1zdLQH0wAuvAC6YECsobLnkCZhLSGKHJzzUWiKTjUzMGhZ8NRUhwRLRl"
        />
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary border-2 border-black rounded-2xl neo-brutal-shadow mb-4">
            <span className="material-symbols-outlined text-white text-4xl">
              shield_person
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface uppercase leading-none">
            Secure Administrative
            <br />
            <span className="text-primary font-black">Access</span>
          </h1>
          <p className="font-body text-secondary text-sm font-bold uppercase tracking-widest">
            Academic Ink Admin Hub
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest border-2 border-black rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="admin-password"
                  className="font-label text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">key</span>
                  Administrative Key
                </label>
                <span className="text-primary">
                  {password ? (
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      lock_open
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-lg">
                      lock
                    </span>
                  )}
                </span>
              </div>

              <div className="relative group">
                <input
                  id="admin-password"
                  data-ocid="admin.login.input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Admin Key"
                  required
                  className="w-full bg-surface border-2 border-black rounded-2xl px-5 py-5 font-body text-lg font-bold focus:ring-0 focus:border-primary focus:border-[2px] transition-all outline-none placeholder:text-secondary/30 placeholder:font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                />
                <button
                  type="button"
                  data-ocid="admin.login.toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p
                  data-ocid="admin.login.error_state"
                  className="text-sm font-bold font-body text-error flex items-center gap-1.5 px-1"
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    error
                  </span>
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              data-ocid="admin.login.submit_button"
              className="neo-brutal-press w-full bg-primary text-white font-headline font-black text-lg py-5 rounded-2xl border-2 border-black neo-brutal-shadow flex items-center justify-center gap-3 hover:bg-primary-container transition-colors group uppercase tracking-widest"
            >
              <span>Enter Archives</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-between items-center px-4">
          <button
            type="button"
            className="text-xs font-black font-label uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">help</span>
            Support
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(175,16,26,0.4)]" />
            <span className="text-[11px] font-black font-label uppercase tracking-widest text-secondary">
              System Online
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useAuth } from "../store/AuthContext";

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const ssoProviders = [
  { id: "microsoft", name: "Microsoft", Icon: MicrosoftIcon },
  { id: "google", name: "Google", Icon: GoogleIcon },
];

export function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8]">
      {/* Header */}
      <header className="flex h-16 w-full shrink-0 items-center justify-center border-b border-[#e8e8e8] bg-white px-4">
        <img src="/logo.png" alt="HomeServices of America" className="h-9 w-auto object-contain" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e8] p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#3e4543]">Welcome back</h1>
              <p className="text-[#6b7270] mt-2">Sign in to access the Agent Dashboard</p>
            </div>

            <div className="space-y-3">
              {ssoProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => login(provider.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#e8e8e8] bg-white text-[#3e4543] font-medium hover:border-[#832238]/30 hover:bg-[#fafafa] transition-all"
                >
                  <provider.Icon />
                  Continue with {provider.name}
                </button>
              ))}
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e8e8e8]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#6b7270]">or</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                login("email");
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3e4543] mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-[#e8e8e8] px-4 py-3 text-[#3e4543] placeholder:text-[#6b7270] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238]"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#3e4543] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#e8e8e8] px-4 py-3 text-[#3e4543] placeholder:text-[#6b7270] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238]"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#6b7270]">
                  <input type="checkbox" className="rounded border-[#e8e8e8]" />
                  Remember me
                </label>
                <button type="button" className="text-sm text-[#832238] hover:underline">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-[#832238] text-white font-medium hover:bg-[#6b1c2e] transition-colors"
              >
                Sign in
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-[#6b7270] mt-6">
            Need help? Contact{" "}
            <a href="mailto:support@homeservices.com" className="text-[#832238] hover:underline">
              IT Support
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

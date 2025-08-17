import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
      {/* Simple top nav */}
      <nav className="navbar sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <i className="fas fa-globe-americas text-2xl text-blue-600"></i>
              <i className="fas fa-leaf text-sm text-green-500 absolute -top-1 -right-1"></i>
            </div>
            <span className="font-bold text-lg text-gradient-unep">PLANET PULSE AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
            <a href="#solutions" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Solutions</a>
            <a href="#impact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Impact</a>
            <Link href="/dashboard" className="btn btn-primary px-4 py-2">Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/70 via-transparent to-transparent dark:from-blue-900/20" />
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Climate Intelligence for a Resilient Future
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                Real-time climate analytics, AI insights, and spatial mapping to protect ecosystems and empower climate‑smart agriculture.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className="btn btn-primary px-6 py-3">
                  Launch Dashboard
                </Link>
                <a href="#features" className="btn btn-secondary px-6 py-3">
                  Explore Features
                </a>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-alt text-green-500" />
                  Open, secure, privacy-first
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-bolt text-yellow-500" />
                  Live data streams
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-leaf text-emerald-500" />
                  Impact-driven
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-tr from-blue-500/10 to-green-500/10 blur-3xl rounded-full" />
              <div className="relative card p-0 overflow-hidden">
                <div className="aspect-[16/10] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <Image src="/globe.svg" alt="Globe" className="h-32 w-32 opacity-80" width={128} height={128} />
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700">
                  <div className="p-4">
                    <p className="text-xs text-gray-500">Regions tracked</p>
                    <p className="text-xl font-semibold">120+</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">Data sources</p>
                    <p className="text-xl font-semibold">30+</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">AI models</p>
                    <p className="text-xl font-semibold">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to act on climate</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Unified analytics from satellite, sensor, and market data—made actionable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <i className="fas fa-globe-africa text-blue-600"></i>
                <h3 className="font-semibold">Spatial Explorer</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interactive maps with tree loss, deforestation alerts, rainfall, and temperature overlays.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <i className="fas fa-brain text-blue-600"></i>
                <h3 className="font-semibold">AI Insights</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recommendations and risk predictions to guide climate-smart agriculture.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <i className="fas fa-seedling text-blue-600"></i>
                <h3 className="font-semibold">Carbon & Biodiversity</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimate carbon credits and track biodiversity health with modern visualizations.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <i className="fas fa-store text-blue-600"></i>
                <h3 className="font-semibold">Market Intelligence</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Live crop prices and trends to optimize timing and revenue for farmers.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <i className="fas fa-database text-blue-600"></i>
                <h3 className="font-semibold">Unified Data Hub</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure, scalable data ingestion with transparent sourcing and provenance.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <i className="fas fa-users text-blue-600"></i>
                <h3 className="font-semibold">For Teams & Communities</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Collaborate across agencies, NGOs, and farmer groups with shared workspaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact strip */}
      <section id="impact" className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="card">
              <p className="text-3xl font-bold">5M+</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">hectares monitored</p>
            </div>
            <div className="card">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">model uptime</p>
            </div>
            <div className="card">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">live updates</p>
            </div>
            <div className="card">
              <p className="text-3xl font-bold">30+</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">data integrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold">Ready to explore your climate landscape?</h3>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Jump into the live dashboard to view maps, insights, and market data for your region.</p>
          <div className="mt-6">
            <Link href="/dashboard" className="btn btn-primary px-6 py-3">Open Dashboard</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <i className="fas fa-globe text-blue-600" />
            <span className="font-semibold">PLANET PULSE AI</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Planet Pulse Labs. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

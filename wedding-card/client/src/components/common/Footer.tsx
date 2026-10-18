import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Building2,
  ChevronRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#121015',
        color: '#e2d9dc',
        borderTop: '3px solid #941b45',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      className="text-xs w-full"
    >
      {/* ============================================================
          DESKTOP & TABLET VIEW: FULL 4-COLUMN RICH MILAP FOOTER
          ============================================================ */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Company Profile & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Milap Logo"
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400/40 shadow-sm"
              />
              <div>
                <h3 className="text-white text-lg font-bold tracking-tight">Milap</h3>
                <p className="text-amber-400 text-xs font-semibold">Har Rishte ka Utsav</p>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              India&apos;s premier wedding and celebration management platform. We provide
              end-to-end venue reservations, authentic catering plans, bespoke decor,
              and complete ceremony coordination.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 bg-rose-950/60 border border-rose-800/50 text-rose-300 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> 10,000+ Happy Weddings
              </span>
              <span className="bg-amber-950/60 border border-amber-800/50 text-amber-300 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                ★ 4.9/5 Rated Service
              </span>
            </div>
          </div>

          {/* Column 2: Quick Services Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              Wedding Services
            </h4>
            <ul className="space-y-2 text-stone-300 text-xs">
              <li>
                <a href="http://localhost:5173" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-500" /> Food & Catering Planner
                </a>
              </li>
              <li>
                <a href="http://localhost:5173" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-500" /> Banquet & Venue Booking
                </a>
              </li>
              <li>
                <a href="http://localhost:5173" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-500" /> Royal Tent & Floral Decor
                </a>
              </li>
              <li>
                <a href="http://localhost:5173" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-500" /> DJ, Sound & Ambient Lighting
                </a>
              </li>
              <li>
                <a href="/editor" className="text-amber-400 font-semibold hover:underline flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-400" /> AI Indian Invitation Cards
                </a>
              </li>
              <li>
                <a href="http://localhost:5173" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-rose-500" /> About Milap & BKC HQ Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Location Information */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              Company Location
            </h4>
            <div className="space-y-3 text-stone-300 text-xs">
              <div className="flex gap-2.5 items-start">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Milap Corporate Headquarters</strong>
                  <p className="text-stone-400 text-[11.5px]">Milap Tower, 4th & 5th Floor, Plot No. 42</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-stone-400 text-[11.5px] leading-relaxed">
                  G-Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051, India
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11.5px] text-stone-400">
                  <p>Mon – Sat: 9:00 AM – 8:30 PM</p>
                  <p>Sunday: 10:00 AM – 5:00 PM (By Appointment)</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-stone-400">
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Delhi NCR</span>
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Jaipur</span>
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Bengaluru</span>
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">Udaipur</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              Contact & Helpdesk
            </h4>
            <div className="space-y-3 text-stone-300 text-xs">
              <div className="flex gap-2.5 items-start">
                <Phone className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <small className="text-stone-400 block text-[10.5px]">Direct Line / Helpdesk</small>
                  <a href="tel:+912226548900" className="text-white hover:text-amber-400 block font-semibold">
                    +91 (022) 2654-8900
                  </a>
                  <a href="tel:+919876543210" className="text-emerald-400 hover:underline block text-[11px]">
                    +91 98765 43210 (WhatsApp)
                  </a>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <small className="text-stone-400 block text-[10.5px]">Email Support</small>
                  <a href="mailto:contact@milapweddings.com" className="text-stone-300 hover:text-amber-400 block text-[11.5px]">
                    contact@milapweddings.com
                  </a>
                  <a href="mailto:support@milap.in" className="text-stone-400 hover:text-amber-400 block text-[11.5px]">
                    support@milap.in
                  </a>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authorized Staff Portal</span>
                </div>
                <p className="text-stone-400 mb-2">For managers, coordinators & vendors</p>
                <a
                  href="http://localhost:5173"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-rose-900/60 text-white rounded text-[11px] font-medium transition-colors"
                >
                  <Lock className="w-3 h-3 text-amber-400" /> Admin Access
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-stone-400 text-[11px] gap-2">
          <p>© {new Date().getFullYear()} Milap Wedding & Event Management Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="http://localhost:5173" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="http://localhost:5173" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <span>·</span>
            <span className="flex items-center gap-1 text-rose-400">
              Crafted with <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> for Indian Weddings
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          SMALL DEVICES (PHONE) VIEW: MINIMAL & SHORT MILAP FOOTER
          Contains ONLY Company Name & Copyright Information
          ============================================================ */}
      <div className="block md:hidden px-4 py-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/logo.jpg"
            alt="Milap Logo"
            className="w-8 h-8 rounded-full object-cover border border-amber-400/50"
          />
          <div className="text-left">
            <h3 className="text-white text-sm font-bold leading-tight">Milap</h3>
            <p className="text-stone-400 text-[11px]">Milap Wedding & Event Management Pvt. Ltd.</p>
          </div>
        </div>
        <p className="text-stone-500 text-[11px] pt-1 border-t border-white/10">
          © {new Date().getFullYear()} Milap Wedding & Event Management Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

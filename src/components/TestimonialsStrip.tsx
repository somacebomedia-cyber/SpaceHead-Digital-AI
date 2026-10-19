import React, { useState, useMemo } from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
} from "lucide-react";
import { whatsappLinkWithMessage } from "../lib/contactInfo";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  business: string;
  location: string;
  rating: number;
  serviceCategory: "Web Design" | "Video Ads" | "SaaS & Web Apps";
  serviceTag: string;
  quote: string;
  resultMetric: string;
  verified: boolean;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Linda Tuntulwana",
    role: "Founder & Principal",
    business: "Nawi Learn Toddler Center",
    location: "Umzimkhulu, KwaZulu-Natal",
    rating: 5,
    serviceCategory: "Web Design",
    serviceTag: "Custom Website + Local Google SEO",
    quote:
      "SpaceHead built our preschool website in under two weeks and set up our Google Maps location so parents can find us easily. Parents constantly tell us how professional and easy to navigate the site is. The 50% deposit option made the whole build completely stress-free for our school budget.",
    resultMetric: "3x increase in online parent inquiries",
    verified: true,
  },
  {
    id: "test-2",
    name: "Sipho Mkhize",
    role: "Programme Coordinator",
    business: "Esayidi TVET Incubation Hub",
    location: "Port Shepstone, KZN",
    rating: 5,
    serviceCategory: "SaaS & Web Apps",
    serviceTag: "IncuTrack AI Web Application",
    quote:
      "The custom IncuTrack portal automated what used to take our managers weeks of manual spreadsheet follow-ups across dozens of small businesses. Direct WhatsApp communication with the dev team meant any tweaks were deployed the exact same afternoon. Exceptional technical execution.",
    resultMetric: "Automated 36 months of tracking",
    verified: true,
  },
  {
    id: "test-3",
    name: "Jacques van der Merwe",
    role: "Managing Director",
    business: "Cape Coastal Logistics",
    location: "Cape Town, Western Cape",
    rating: 5,
    serviceCategory: "Web Design",
    serviceTag: "Corporate Digital Portal & Lead Intake",
    quote:
      "We needed a sleek, high-speed digital presence to win corporate logistics tenders. SpaceHead delivered clean branding, mobile-first intake forms, and fast cloud hosting with zero hidden retainers. Best investment we made this financial year.",
    resultMetric: "Secured 2 new enterprise tenders",
    verified: true,
  },
  {
    id: "test-4",
    name: "Tshepo Molefe",
    role: "Head Coach & Owner",
    business: "Apex Performance Studio",
    location: "Sandton, Johannesburg",
    rating: 5,
    serviceCategory: "Video Ads",
    serviceTag: "30s AI Promo Video Advert (Reels & Status)",
    quote:
      "The 30-second animated video advert they created for our Instagram and WhatsApp marketing was stunning. It immediately stopped the scroll and drove over 40 qualified trial bookings in our first month alone. Rapid 4-day turnaround too.",
    resultMetric: "40+ paid trial bookings in month 1",
    verified: true,
  },
  {
    id: "test-5",
    name: "Dr. Lerato Sithole",
    role: "Principal Practitioner",
    business: "Sithole Aesthetic Wellness",
    location: "Pretoria East, Gauteng",
    rating: 5,
    serviceCategory: "Web Design",
    serviceTag: "Medical Practice Website & Booking Intake",
    quote:
      "Our patients love being able to read about our treatments and book directly from their phones. SpaceHead handled the copy, the domain setup, and our professional emails in one neat package. Honest pricing, exactly as quoted.",
    resultMetric: "70% of bookings now digital",
    verified: true,
  },
];

interface TestimonialsStripProps {
  compact?: boolean;
  onNavigateToServices?: () => void;
}

export default function TestimonialsStrip({
  compact = false,
  onNavigateToServices,
}: TestimonialsStripProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filterOptions = ["All", "Web Design", "Video Ads", "SaaS & Web Apps"];

  const filteredList = useMemo(() => {
    if (selectedFilter === "All") return TESTIMONIALS;
    return TESTIMONIALS.filter((t) => t.serviceCategory === selectedFilter);
  }, [selectedFilter]);

  const whatsappInquiryUrl = whatsappLinkWithMessage(
    "Hi SpaceHead AI, I saw your client testimonials and would like to discuss building something similar for my business."
  );

  return (
    <section
      id="client-testimonials-section"
      className={`w-full max-w-7xl mx-auto ${compact ? "py-6" : "py-12"} font-sans`}
    >
      {/* Section Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-mono font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real South African Business Outcomes</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
          Trusted by Growth-Focused Brands
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          From local schools and medical practices to regional logistics and tech incubators — see how our clean design and rapid turnaround drive real results.
        </p>

        {/* Stats Row */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
          <div className="flex items-center space-x-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-900 font-mono">5.0 Star Rating</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Code & Asset Ownership</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>10–14 Day Standard Launch</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-3 flex flex-wrap justify-center gap-1.5">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedFilter === filter
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
          >
            {/* Top Accent & Star row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 space-x-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100/80">
                  {item.serviceTag}
                </span>
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic relative">
                "{item.quote}"
              </p>
            </div>

            {/* Client Info & Outcome Metric */}
            <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center space-x-2 text-[11px] text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-2.5 py-1 rounded-lg font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{item.resultMetric}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-display font-bold text-xs text-slate-900 leading-tight">
                      {item.name}
                    </h4>
                    {item.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Client" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.role}, <strong className="text-slate-700 font-semibold">{item.business}</strong>
                  </p>
                </div>

                <div className="flex items-center text-[10px] text-slate-400 font-mono">
                  <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                  <span>{item.location.split(",")[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Conversion Prompt */}
      <div className="mt-10 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-display font-bold text-sm text-slate-900">
            Ready to launch your own high-impact web presence or video ad?
          </h4>
          <p className="text-xs text-slate-500">
            Transparent pricing with upfront cash savings (R3,500 once-off) or 12-month payment plans (R499/month), then R199/month hosting & maintenance, and zero hidden contracts.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {onNavigateToServices && (
            <button
              type="button"
              onClick={onNavigateToServices}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <span>View Packages & Pricing</span>
            </button>
          )}

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Ask on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

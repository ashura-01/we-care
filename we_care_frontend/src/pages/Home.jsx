import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeafDecor from "../components/LeafDecor";
import { getStats } from "../services/statsService";

import doctorIcon from "../assets/doctor.svg";
import aiIcon from "../assets/ai.svg";
import hospitalIcon from "../assets/hospital.svg";
import mainDoctorsIcon from "../assets/mainDoctor.png";

import GlassCard from "../components/GlassCard";
import PillButton from "../components/PillButton";

const Home = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getStats();
      setStats(data || []);
    };
    loadStats();
  }, []);

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-white pb-[40px] max-[480px]:pb-[28px]">
        {/* Background Blobs */}
        <div className="pointer-events-none absolute left-[-20px] top-[15px] z-[1] h-[150px] w-[150px] rounded-full bg-[#94d82d] opacity-[0.92] blur-[28px] max-[480px]:h-[100px] max-[480px]:w-[100px]" />
        <div className="pointer-events-none absolute right-[-35px] top-[40px] z-[1] h-[150px] w-[150px] rounded-full bg-[#8fd629] opacity-[0.88] blur-[35px] max-[480px]:h-[100px] max-[480px]:w-[100px]" />
        <div className="pointer-events-none absolute left-[85px] top-[300px] z-[1] h-[150px] w-[300px] rounded-[50px] bg-[#4f93a7] opacity-[0.75] blur-[18px] max-[480px]:top-[200px] max-[480px]:left-0 max-[480px]:w-full max-[480px]:h-[100px]" />
        <div className="pointer-events-none absolute right-[5px] top-[190px] z-[1] h-[300px] w-[150px] rounded-[50px] bg-[#5a99ac] opacity-[0.72] blur-[18px] max-[760px]:hidden" />
        <div className="pointer-events-none absolute left-[450px] top-[245px] z-[1] h-[160px] w-[200px] rounded-full bg-[#8fda28] opacity-[0.92] blur-[38px] max-[760px]:hidden" />
        <div className="pointer-events-none absolute right-1/2 top-[150px] z-[1] h-[250px] w-[130px] rounded-[70px] bg-[#5a99ac] opacity-[0.68] blur-[18px] max-[760px]:hidden" />
        <div className="pointer-events-none absolute right-[35%] top-[25px] z-[1] h-[100px] w-[350px] rounded-[70px] bg-[#5a99ac] opacity-[0.68] blur-[18px] max-[760px]:w-[60vw]" />
        <div className="absolute left-0 top-0 z-[2] h-full w-full bg-white/[0.02] backdrop-blur-[18px]" />

        <div className="relative z-[3] box-border px-[clamp(16px,3vw,34px)] pt-[38px] max-[760px]:px-[16px] max-[480px]:pt-[20px]">
          <div className="flex w-full items-start justify-start gap-[clamp(40px,16vw,260px)] max-[900px]:gap-[28px] max-[760px]:flex-col-reverse max-[760px]:items-center max-[760px]:gap-0">
            
            <div className="ml-[clamp(8px,2.5vw,40px)] flex min-w-0 flex-[0_1_690px] flex-col max-[900px]:ml-[clamp(4px,1.5vw,16px)] max-[760px]:ml-0 max-[760px]:w-full max-[760px]:flex-none">
              <GlassCard className="left-[clamp(20px,8vw,150px)] w-[clamp(360px,52vw,640px)] max-w-full rounded-[clamp(26px,3vw,42px)] px-[clamp(18px,2.2vw,30px)] py-[clamp(20px,2.4vw,34px)] max-[1200px]:w-[clamp(500px,58vw,640px)] max-[1100px]:left-[clamp(12px,5vw,90px)] max-[1100px]:w-[clamp(340px,50vw,560px)] max-[900px]:left-[clamp(8px,3vw,40px)] max-[900px]:w-[clamp(320px,56vw,500px)] max-[760px]:left-0 max-[760px]:w-full max-[760px]:min-w-0 backdrop-blur-[12px] bg-white/10">
                <h1 className="relative z-[4] m-0 text-[34px] font-bold leading-[1.45] max-[760px]:text-[clamp(24px,6vw,34px)]">
                  <span className="ml-[18px] block text-[#00887f] max-[760px]:ml-0">Right doctor.</span>
                  <span className="ml-[116px] block text-[#0a6678] max-[1100px]:ml-[clamp(20px,5vw,80px)] max-[900px]:ml-[clamp(14px,4vw,48px)] max-[760px]:ml-0">Right place.</span>
                  <span className="ml-[18px] block text-[#003a46] max-[760px]:ml-0">Right care.</span>
                </h1>
              </GlassCard>

              <div className="mt-[14px] ml-[clamp(8px,2vw,30px)] max-[760px]:ml-0 max-[760px]:text-center">
                <p className="ml-[clamp(24px,8vw,150px)] w-[clamp(220px,28vw,315px)] max-w-full text-[clamp(13px,1.2vw,17px)] font-bold leading-[1.25] text-[#111111] max-[1100px]:ml-[clamp(18px,6vw,90px)] max-[900px]:ml-[clamp(10px,4vw,50px)] max-[760px]:ml-0 max-[760px]:w-full">
                  Smart symptom insights with trusted doctors, locations, and appointment details.
                </p>
                <PillButton to="/symptoms" className="mt-[10px] ml-[clamp(24px,8vw,150px)] px-[22px] py-[11px] max-[1100px]:ml-[clamp(18px,6vw,90px)] max-[900px]:ml-[clamp(10px,4vw,50px)] max-[760px]:ml-0 max-[480px]:w-full max-[480px]:text-center">
                  CHECK SYMPTOMS
                </PillButton>
              </div>
            </div>

            <div className="relative z-[3] flex shrink-0 items-center justify-center min-[761px]:-translate-y-[70px] h-[380px] w-[540px] max-[1100px]:h-[320px] max-[1100px]:w-[460px] max-[900px]:h-[280px] max-[900px]:w-[380px] max-[760px]:translate-y-0 max-[760px]:h-auto max-[760px]:max-h-[220px] max-[760px]:w-full max-[760px]:mb-[12px] max-[480px]:max-h-[180px]">
              <img
                src={mainDoctorsIcon}
                alt="Doctors"
                className="h-full w-full object-contain object-center [mask-image:radial-gradient(ellipse_at_center,black_30%,black_45%,transparent_73%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,black_45%,transparent_73%)]"
              />
            </div>
          </div>

          {/* ── Stats Cards ── */}
          <div className="mt-[35px] flex flex-wrap justify-center gap-[20px] max-[480px]:mt-[20px]">
            {stats.map((item, index) => (
              <GlassCard
                key={index}
                className="flex h-[200px] w-[300px] cursor-pointer items-center justify-center rounded-[35px] border border-white/30 bg-white/10 backdrop-blur-[12px] shadow-[0_15px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.15)] max-[760px]:h-[160px] max-[760px]:w-[45%] max-[480px]:w-[46%]"
              >
                {/* Internal Wrapper to fix centering without breaking global GlassCard */}
                <div className="flex flex-col items-center justify-center text-center w-full h-full gap-[8px]">
                  <h2 className="relative z-[2] m-0 text-[32px] font-extrabold leading-none text-[#0d404b] max-[480px]:text-[24px]">
                    {item.number}
                  </h2>
                  <p className="relative z-[2] m-0 bg-[linear-gradient(to_right,#0a6678,#00887f)] bg-clip-text text-[24px] font-bold leading-[1.3] text-transparent max-[480px]:text-[16px]">
                    {item.label}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>

          <p className="mt-[50px] text-center text-[20px] italic text-[#369679] max-[480px]:mt-[30px]">Your path to the right care...</p>
        </div>
      </section>

      {/* ── Feature Sections ── */}
      {[
        {
          reverse: false,
          icon: doctorIcon,
          alt: "Doctor",
          title: "Find Doctors Near You",
          desc: "Browse doctors by specialty and location.",
          btn: "Browse Doctors",
          to: "/doctors",
          iconStyle: "drop-shadow-[0_6px_14px_rgba(0,0,0,0.15)]",
        },
        {
          reverse: true,
          icon: aiIcon,
          alt: "AI",
          title: "Not Sure Where to Start?",
          desc: "Enter your symptoms and we'll guide you to the right specialist.",
          btn: "Get Guidance",
          to: "/symptoms",
          iconStyle: "drop-shadow-[0_8px_18px_rgba(104,178,160,0.35)]",
        },
        {
          reverse: false,
          icon: hospitalIcon,
          alt: "Hospitals",
          title: "Care, Close to You",
          desc: "Find hospitals and diagnostic centers around you with ease.",
          btn: "Find Hospitals",
          to: "/hospitals",
          iconStyle: "drop-shadow-[0_8px_18px_rgba(104,178,160,0.35)] transition-transform duration-300 hover:scale-105",
        },
      ].map(({ reverse, icon, alt, title, desc, btn, to, iconStyle }) => (
        <section
          key={title}
          className={`relative flex items-center justify-center gap-[42px] overflow-hidden px-[48px] pb-[38px] pt-[48px] ${
            reverse
              ? "flex-row-reverse bg-[linear-gradient(to_left,rgba(224,236,222,0.22)_30.173%,rgba(104,178,160,0.45)_100%)]"
              : "bg-[linear-gradient(122.176deg,rgba(224,236,222,0.22)_30.173%,rgba(104,178,160,0.45)_100%)]"
          } max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[20px] max-[900px]:px-[24px] max-[900px]:pb-[24px] max-[900px]:pt-[34px] max-[480px]:px-[16px] max-[480px]:pb-[20px] max-[480px]:pt-[28px]`}
        >
          <div className="flex h-[220px] w-[220px] shrink-0 items-center justify-center max-[900px]:h-[140px] max-[900px]:w-[140px] max-[480px]:h-[100px] max-[480px]:w-[100px]">
            <img src={icon} alt={alt} className={`h-[180px] w-[180px] opacity-90 max-[900px]:h-[120px] max-[900px]:w-[120px] max-[480px]:h-[85px] max-[480px]:w-[85px] ${iconStyle}`} />
          </div>

          <div className={`relative w-full max-w-[760px] ${reverse ? "mr-[50px] max-[900px]:mr-0" : "ml-[70px] max-[900px]:ml-0"} max-[480px]:ml-0 max-[480px]:mr-0`}>
            <div className={`absolute ${reverse ? "left-[18px] max-[900px]:left-auto max-[900px]:right-[18px]" : "right-[18px]"} top-[-14px] z-[0] h-[170px] w-[110px] opacity-[0.55] max-[480px]:hidden`}>
              <LeafDecor />
            </div>
            <div className={`absolute bottom-[-32px] ${reverse ? "right-[-6px] max-[900px]:left-[-6px] max-[900px]:right-auto" : "left-[-6px]"} z-[0] h-[170px] w-[110px] rotate-180 opacity-[0.45] max-[480px]:hidden`}>
              <LeafDecor />
            </div>
            
            <GlassCard className="relative z-[1] w-full max-w-[720px] rounded-[50px] border border-white/30 bg-white/10 px-[34px] py-[34px] shadow-[0_15px_25px_rgba(0,0,0,0.15)] backdrop-blur-[12px] max-[480px]:rounded-[28px] max-[480px]:px-[20px] max-[480px]:py-[22px]">
              <h2 className="mb-[14px] max-w-[420px] text-[32px] font-bold leading-[1.12] text-[#1d5f71] max-[900px]:text-[28px] max-[480px]:text-[22px]">
                {title}
              </h2>
              <p className="mb-[24px] max-w-[500px] text-[15px] font-semibold leading-[1.25] text-[#4f7f89] max-[480px]:text-[14px] max-[480px]:mb-[16px]">
                {desc}
              </p>
              <PillButton to={to} className="px-[24px] py-[13px] max-[480px]:w-full max-[480px]:text-center">
                {btn}
              </PillButton>
            </GlassCard>
          </div>
        </section>
      ))}

      {/* ── Why Choose updated ── */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f4faf7_0%,#edf7f2_45%,#e4f1eb_100%)] px-[40px] pb-[50px] pt-[70px] text-center max-[900px]:px-[24px] max-[900px]:pb-[30px] max-[900px]:pt-[50px] max-[480px]:px-[16px] max-[480px]:pt-[36px]">
        <div className="pointer-events-none absolute left-[-40px] top-[10px] h-[240px] w-[240px] rounded-full bg-[rgba(104,178,160,0.45)] opacity-50 blur-[60px]" />
        <div className="pointer-events-none absolute bottom-[20px] right-[-60px] h-[280px] w-[280px] rounded-full bg-[rgba(90,153,172,0.35)] opacity-50 blur-[60px]" />

        <h2 className="relative z-[2] mb-[34px] text-[clamp(24px,4vw,36px)] font-bold text-[#1d5f71]">Why Choose WeCare</h2>

        <div className="relative z-[2] grid grid-cols-3 gap-[24px] max-[900px]:grid-cols-1 max-[900px]:max-w-[480px] max-[900px]:mx-auto">
          {[
            ["✓", "Verified Doctors", "Connect with trusted professionals through clear profiles and reliable healthcare information."],
            ["+", "Easy Access", "Search symptoms, compare options, and move through care choices with a simple experience."],
            ["★", "Confident Decisions", "Explore doctors, locations, and support tools that help you choose the right path."],
          ].map(([icon, title, text]) => (
            <GlassCard key={title} className="min-h-[230px] w-full rounded-[34px] px-[24px] py-[28px] text-left border border-white/30 bg-white/10 backdrop-blur-[12px] shadow-[0_15px_25px_rgba(0,0,0,0.1)] max-[480px]:min-h-0 max-[480px]:rounded-[22px] max-[480px]:px-[18px] max-[480px]:py-[20px]">
              <div className="mb-[18px] flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[linear-gradient(to_right,#046ea3,#90e0cc)] text-[22px] font-bold text-white shadow-[0_10px_18px_rgba(4,110,163,0.18)]">
                {icon}
              </div>
              <h3 className="mb-[12px] text-[clamp(18px,2.5vw,22px)] text-[#1d5f71]">{title}</h3>
              <p className="m-0 text-[15px] font-semibold leading-[1.45] text-[#4f7f89]">{text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="relative flex justify-center overflow-hidden bg-[linear-gradient(180deg,#eaf5ef_0%,#e0efe8_100%)] px-[40px] pb-[80px] pt-[40px] max-[900px]:px-[24px] max-[900px]:pb-[50px] max-[900px]:pt-[30px] max-[480px]:px-[16px] max-[480px]:pb-[36px]">
        <div className="pointer-events-none absolute left-[5%] top-[10%] h-[280px] w-[280px] rounded-full bg-[rgba(104,178,160,0.5)] opacity-[0.45] blur-[70px]" />
        <div className="pointer-events-none absolute bottom-0 right-[2%] h-[300px] w-[300px] rounded-full bg-[rgba(4,110,163,0.22)] opacity-[0.45] blur-[70px]" />

        <GlassCard className="relative z-[2] w-full max-w-[960px] rounded-[46px] px-[34px] py-[46px] text-center border border-white/30 bg-white/10 backdrop-blur-[12px] shadow-[0_15px_25px_rgba(0,0,0,0.15)] max-[900px]:px-[24px] max-[900px]:py-[36px] max-[480px]:rounded-[28px] max-[480px]:px-[18px] max-[480px]:py-[28px]">
          <p className="mb-[12px] text-[14px] font-bold uppercase tracking-[0.4px] text-[#369679]">Start your care journey</p>
          <h2 className="mb-[16px] text-[clamp(22px,5vw,38px)] font-bold leading-[1.15] text-[#1d5f71]">
            Find clarity, comfort, and the care you deserve.
          </h2>
          <p className="mb-[24px] text-[16px] font-semibold text-[#4f7f89] max-[480px]:text-[14px] max-[480px]:mb-[18px]">
            Explore symptoms, discover doctors, and take the next step with confidence.
          </p>
          <PillButton to="/login" className="px-[28px] py-[14px] max-[480px]:w-full max-[480px]:text-center">
            Get Started
          </PillButton>
        </GlassCard>
      </section>

      {/* ── Footer ── */}
      <section className="bg-[#eef4ec] px-[40px] pb-[30px] pt-[50px] max-[480px]:px-[16px] max-[480px]:pt-[36px]">
        <div className="grid grid-cols-4 gap-[40px] max-[900px]:grid-cols-2 max-[900px]:gap-[24px] max-[480px]:grid-cols-1 max-[480px]:gap-[28px]">
          <div>
            <h3 className="mb-[10px] text-[22px] text-[#1d5f71]">WeCare</h3>
            <p className="text-[14px] leading-[1.5] text-[#4f7f89]">Your trusted platform for finding doctors, exploring care options, and booking appointments with ease.</p>
          </div>
          <div>
            <h4 className="mb-[10px] text-[18px] text-[#1d5f71]">Quick Links</h4>
            <ul className="m-0 list-none p-0">
              {["Symptoms", "Doctors", "Hospitals"].map(link => (
                <li key={link} className="mb-[6px] cursor-pointer text-[14px] text-[#4f7f89]">{link}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-[10px] text-[18px] text-[#1d5f71]">Contact</h4>
            <ul className="m-0 list-none p-0 text-[14px] text-[#4f7f89]">
              <li className="mb-[6px] hover:text-[#046ea3] cursor-pointer">Email: support@wecare.com</li>
              <li className="mb-[6px] hover:text-[#046ea3] cursor-pointer">Phone: +880 1234-567890</li>
              <li className="mb-[6px] hover:text-[#046ea3] cursor-pointer">Location: Dhaka, Bangladesh</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-[10px] text-[18px] text-[#1d5f71]">Hours</h4>
            <ul className="m-0 list-none p-0 text-[14px] text-[#4f7f89]">
              <li>Sun - Thurs: 9:00 AM - 8:00 PM</li>
              <li>Sat: 10:00 AM - 6:00 PM</li>
              <li>Fri: Closed</li>
            </ul>
          </div>
        </div>
        <div className="mt-[30px] text-center text-[13px] text-[#6c8f95]">© 2026 WeCare. All rights reserved.</div>
      </section>
    </>
  );
};

export default Home;
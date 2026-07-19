'use client';

import AIInDepth from "@/components/Home/AIInDepth";
import CallToAction from "@/components/Home/CallToAction";
import HeroBanner from "@/components/Home/HeroBanner";
import HowItWorks from "@/components/Home/HowItWorks";
import KeyFeatures from "@/components/Home/KeyFeatures";
import LatestInsights from "@/components/Home/LatestInsights";
import LearningPath from "@/components/Home/LearningPath";
import StudentSuccess from "@/components/Home/StudentSuccess";


export default function HomePage() {

  return (
    <div className="overflow-x-hidden bg-slate-50 min-h-screen">
      <HeroBanner />
      <LatestInsights />
      <KeyFeatures />
      <HowItWorks />
      <AIInDepth />
      <StudentSuccess />
      <LearningPath />
      <CallToAction />
    </div>
  );
}

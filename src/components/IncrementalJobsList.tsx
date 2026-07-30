"use client";

import React, { useState, useEffect, useRef } from "react";
import JobCard from "@/components/JobCard";
import { ArrowDownCircle } from "lucide-react";

interface IncrementalJobsListProps {
  jobs: any[];
  lang: "en" | "hi" | "mr";
  dict: any;
  initialCount?: number;
  step?: number;
}

export default function IncrementalJobsList({
  jobs,
  lang,
  dict,
  initialCount = 15,
  step = 10,
}: IncrementalJobsListProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sensorRef = useRef<HTMLDivElement | null>(null);

  const totalJobs = jobs.length;
  const visibleJobs = jobs.slice(0, visibleCount);
  const hasMore = visibleCount < totalJobs;
  const remainingCount = totalJobs - visibleCount;

  useEffect(() => {
    if (!hasMore || !sensorRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + step, totalJobs));
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(sensorRef.current);
    return () => observer.disconnect();
  }, [hasMore, step, totalJobs]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + step, totalJobs));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleJobs.map((job, index) => (
          <JobCard
            key={`${job.id}-${index}`}
            title={job.title[lang] || job.title.en || "Untitled"}
            org={job.organization[lang] || job.organization.en || "Unknown"}
            qual={job.quick_facts?.qualification?.[lang] || job.quick_facts?.qualification?.en}
            vac={job.quick_facts?.vacancies || "-"}
            date={job.quick_facts?.last_date?.[lang] || job.quick_facts?.last_date?.en || "-"}
            status={job.status}
            statusColor={job.statusColor}
            isLive={job.isLive}
            isTrending={job.isTrending}
            daysLeft={job.daysLeft}
            link={`/${lang}/jobs/${job.slug}`}
            logoUrl={job.logo_url}
            logoAlt={
              job.logo_alt?.[lang] ||
              job.logo_alt?.en ||
              job.organization[lang] ||
              job.organization.en ||
              "Logo"
            }
            lang={lang}
            imgPriority={index < 6}
            labels={{
              trending: dict?.home?.trending || "Trending",
              daysLeft: dict?.home?.daysLeft || "Days Left",
              lastDate: dict?.job?.lastDate || "Last Date",
              details: dict?.job?.vacancyDetails?.split(" ")[1] || "Details",
              applyNow: dict?.job?.applyNow || "Apply Now",
            }}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={sensorRef} className="flex flex-col items-center justify-center pt-4 pb-8">
          <button
            onClick={handleLoadMore}
            className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:border-[#0A58CA] text-[#0B1B3D] hover:text-[#0A58CA] font-extrabold text-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          >
            <span>
              Load {Math.min(step, remainingCount)} More Updates ({remainingCount} remaining)
            </span>
            <ArrowDownCircle className="w-5 h-5 text-[#0A58CA] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}

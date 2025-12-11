"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

interface BreadcrumbProps {
  paths: { name: string; href?: string }[];
}

export default function BreadCrumb({ paths }: BreadcrumbProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isOverview = pathname === "/dashboard/academic/overview";

  return (
    <div className="flex sticky top-0 space-x-1 font-medium mt-6 items-center">
      <button
        onClick={() => {
          if (!isOverview) {
            router.push("/dashboard/academic/overview");
          }
        }}
        disabled={isOverview}
        className={`text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-2 ${
          isOverview ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FiChevronLeft size={28} className="text-gray-800 dark:text-gray-200" />
      </button>

      {/* Static Academic label */}
      <div className="flex items-center text-[17px] font-inter text-indigo-500 dark:text-indigo-400">
        Academic
      </div>

      {/* Dynamic Path Segments */}
      {paths.map((path, index) => (
        <div
          key={index}
          className="flex items-center space-x-1 text-[17px] font-inter"
        >
          <span className="text-gray-600 dark:text-gray-400">
            <FiChevronRight size={16} />
          </span>
          {path.href ? (
            <Link href={path.href}>
              <span className="text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer">
                {path.name}
              </span>
            </Link>
          ) : (
            <span className="text-indigo-500 dark:text-indigo-400">{path.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

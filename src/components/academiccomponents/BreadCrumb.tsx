'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import { FiChevronRight, FiChevronLeft } from "react-icons/fi";


interface BreadcrumbProps {
  paths: { name: string; href?: string }[]; // name is what to show, href is optional for links
}

export default function BreadCrumb({ paths }: BreadcrumbProps) {


  const router = useRouter();
  const pathname = usePathname();

  const academicRoutes = [
    '/dashboard/academic/overview',
    '/dashboard/academic/centers',
    '/dashboard/academic/leads',
    '/dashboard/academic/students',
    '/dashboard/academic/courses',
    '/dashboard/academic/batches',
  ];
  return (
    <div className="flex  space-x-1 font-medium  mt-6">
      {/* ← Back Button */}
      <button
        onClick={() => {
          // If current path is NOT the overview, then go to overview
          if (pathname !== '/dashboard/academic/overview') {
            router.push('/dashboard/academic/overview');
          } else {
            // Else, do nothing (or disable the button)
          }
        }}
        className="text-indigo-600 hover:text-indigo-800 mr-2"
      >

        <FiChevronLeft size={28} className="text-[rgba(0,0,0,0.7)] " />
      </button>

      {/* Path Segments */}
      {paths.map((path, index) => (
        <div key={index} className="flex items-center space-x-1 text-[17px] font-inter text-indigo-500">
          {index !== 0 && <span className="text-[rgba(0,0,0,0.7)]"><FiChevronRight size={16} /></span>}

          {path.href ? (
            <Link href={path.href}>
              <span className="hover:underline cursor-pointer">{path.name}</span>
            </Link>
          ) : (
            <span className="text-indigo-500">{path.name}</span> // Current page
          )}
        </div>
      ))}
    </div>
  );
}

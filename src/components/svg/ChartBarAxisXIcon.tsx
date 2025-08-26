import React from "react";

const ChartBarAxisXIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinejoin="miter"
      strokeLinecap="butt"
      strokeWidth="2"
      strokeMiterlimit={10}
    >
      <path d="M3 43L45 43" strokeLinecap="square" />
      <path d="M13 20H5V38H13V20Z" strokeLinecap="square" />
      <path d="M28 5H20V38H28V5Z" strokeLinecap="square" />
      <path d="M43 28H35V38H43V28Z" strokeLinecap="square" />
    </g>
  </svg>
);

export default ChartBarAxisXIcon;

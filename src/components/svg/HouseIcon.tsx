const HouseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    {...props}
  >
    <title>house-6</title>
    <g
      fill="currentColor"
      stroke="currentColor"
      strokeLinejoin="miter"
      strokeLinecap="butt"
    >
      <polyline
        points="2 13 16 2 30 13"
        fill="none"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
      <polyline
        points="13 29 13 20 19 20 19 29"
        fill="none"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
      <path
        d="m5,16v10c0,1.657,1.343,3,3,3h16c1.657,0,3-1.343,3-3v-10"
        fill="none"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
    </g>
  </svg>
);

export default HouseIcon;

export const Spinner = ({
  size,
  color = "#eff6ff",
  className,
}: {
  size: number;
  color?: string;
  className?: string;
}) => (
  <div className={` ${className} `}>
    <svg
      width={`${size}`}
      height={`${size}`}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={`${color}`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="30 150"
        strokeDashoffset="0"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dasharray"
          values="30 150;90 150;30 150"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="0;-40;-120"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

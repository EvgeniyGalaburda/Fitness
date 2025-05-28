export const ProgressLine = ({ percentage }: { percentage: number }) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage)) * 100;
  return (
    <div
      style={{
        width: "100%",
        height: "5px",
        backgroundColor: "#c0c0c0",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${clampedPercentage}%`,
          height: "100%",
          backgroundColor: "rgb(108, 232, 129)",
          borderRadius: "5px",
          transition: "width 0.3s ease-in-out",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></div>
    </div>
  );
};

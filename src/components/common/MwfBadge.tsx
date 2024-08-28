import { Unit } from "../../types/unit.ts";

export const MwfBadge = ({ unit }: { unit: Unit }) => {
  if (!unit.MWFW || unit.MWFW.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: "4px", marginLeft: "4px" }}>
      <span className="m-0 mwf-name border border-secondary">M W F</span>
      <span className="m-0 mwf-value border border-secondary">
        {unit.MWFW[0][1].split(":")[0]}{" "}
        <span className="m-0" style={{ color: "lightgrey" }}>
          /
        </span>{" "}
        {unit.MWFW[0][1].split(":")[1]}{" "}
        <span className="m-0" style={{ color: "lightgrey" }}>
          /
        </span>{" "}
        {unit.MWFW[0][1].split(":")[2]}
      </span>
    </div>
  );
};

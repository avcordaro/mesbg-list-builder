import { BuilderModeSidebar } from "./sidebar/BuilderModeSidebar.tsx";
import { Warbands } from "./warbands/Warbands.tsx";

export const BuilderMode = () => {
  return (
    <>
      <BuilderModeSidebar />
      <Warbands />
    </>
  );
};

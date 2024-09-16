import { FunctionComponent, PropsWithChildren } from "react";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";

export const AppContainer: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

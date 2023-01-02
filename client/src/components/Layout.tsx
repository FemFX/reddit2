import React, { FC, ReactNode } from "react";
import Navbar from "./Navbar";
import Wrapper from "./Wrapper";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Wrapper>{children}</Wrapper>
    </>
  );
};

export default Layout;

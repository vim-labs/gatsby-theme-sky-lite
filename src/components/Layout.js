import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/styles";
import "../style/reset.css";
import theme from "../style/theme";
import Appbar from "../components/Appbar";
import Drawer from "../components/Drawer";
import Footer from "../components/Footer";

export default ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleToggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <ThemeProvider theme={theme}>
      <Appbar onToggleDrawer={handleToggleDrawer} />
      {children}
      <Footer />
      <Drawer open={isDrawerOpen} onClose={handleToggleDrawer} />
    </ThemeProvider>
  );
};

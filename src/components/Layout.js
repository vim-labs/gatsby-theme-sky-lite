import React, { useState } from "react";
import { StaticQuery, graphql } from "gatsby";
import Helmet from "react-helmet";
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
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              components {
                layout {
                  googleFonts
                }
              }
            }
          }
        }
      `}
      render={({
        site: {
          siteMetadata: {
            components: {
              layout: { googleFonts }
            }
          }
        }
      }) => {
        return (
          <ThemeProvider theme={theme}>
            <Helmet>
              <link
                href={`https://fonts.googleapis.com/css?family=${googleFonts}`}
                rel="stylesheet"
              />
            </Helmet>
            <Appbar onToggleDrawer={handleToggleDrawer} />
            {children}
            <Footer />
            <Drawer open={isDrawerOpen} onClose={handleToggleDrawer} />
          </ThemeProvider>
        );
      }}
    />
  );
};

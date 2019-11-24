import React from "react";
import Layout from "../components/Layout";
import { Box, Typography } from "@material-ui/core";
import theme from "../style/theme";

export default function Error404Template() {
  return (
    <Layout>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Box
          flexGrow={1}
          textAlign="center"
          paddingTop={4}
          paddingBottom={12}
          paddingX={8}
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white
          }}
        >
          <Box marginBottom={4}>
            <Typography
              color="inherit"
              variant="h2"
              style={{
                fontWeight: "bold",
                fontFamily:
                  "Work Sans, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
                marginBottom: 4
              }}
            >
              404 Error
            </Typography>
            <Typography color="inherit" variant="body1">
              The requested page was not found.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { makeStyles } from "@material-ui/styles";
import { Box, Drawer, IconButton, Typography } from "@material-ui/core";
import { MdClose } from "react-icons/md";
import Link from "../components/Link";

const useStyles = makeStyles(theme => ({
  drawer: {
    minWidth: 300
  },
  ul: {
    padding: 0,
    listStyle: "none",
    "& li": {
      marginBottom: theme.spacing(0.5)
    },
    "& a": {
      textDecoration: "none"
    },
    "& a:hover": {
      textDecoration: "underline"
    }
  }
}));

const DrawerItems = ({ title, links, onClose }) => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" padding={1}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} paddingLeft={1}>
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </Box>
      <Box padding={1}>
        <ul className={classes.ul}>
          {links.map(link => {
            return (
              <li key={link.title}>
                <Link to={link.url}>{link.title}</Link>
              </li>
            );
          })}
        </ul>
      </Box>
    </Box>
  );
};

export default ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              components {
                appbar {
                  links {
                    title
                    url
                  }
                }
              }
            }
          }
        }
      `}
      render={({
        site: {
          siteMetadata: {
            title,
            components: {
              appbar: { links }
            }
          }
        }
      }) => (
        <Drawer
          classes={{ paper: classes.drawer }}
          open={open}
          onClose={onClose}
        >
          <DrawerItems title={title} onClose={onClose} links={links} />
        </Drawer>
      )}
    />
  );
};

import React from "react";
import { Link, StaticQuery, graphql } from "gatsby";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  useMediaQuery
} from "@material-ui/core";
import { MdMenu } from "react-icons/md";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(1)
  },
  titleButton: {
    padding: theme.spacing(1),
    borderRadius: "4px",
    transition: "background-color .125s ease",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.25)"
    }
  }
}));

const AppBarLinks = ({ links }) => {
  const classes = useStyles();

  return links.map(link => {
    return (
      <ButtonBase
        component={Link}
        to={link.url}
        classes={{ root: classes.titleButton }}
        key={link.title}
      >
        {link.title}
      </ButtonBase>
    );
  });
};

export default ({ onToggleDrawer }) => {
  const classes = useStyles();
  const isXs = useMediaQuery(theme => theme.breakpoints.down("xs"));

  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              components {
                appbar {
                  position
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
              appbar: { links, position }
            }
          }
        }
      }) => (
        <AppBar position={position}>
          <Toolbar>
            {isXs && (
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={onToggleDrawer}
              >
                <MdMenu />
              </IconButton>
            )}
            <Box display="flex" flexGrow={1}>
              <ButtonBase
                component={Link}
                to="/"
                classes={{ root: classes.titleButton }}
              >
                {title}
              </ButtonBase>
            </Box>
            {// Display the appbar action links if the media query breakpoint is larger than Xs.
            !isXs && <AppBarLinks links={links} />}
          </Toolbar>
        </AppBar>
      )}
    />
  );
};

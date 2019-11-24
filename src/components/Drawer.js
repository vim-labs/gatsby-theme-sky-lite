import React from "react";
import { Link, StaticQuery, graphql } from "gatsby";
import { makeStyles } from "@material-ui/styles";
import { Box, Drawer, IconButton, List, ListItem, Typography } from "@material-ui/core";
import { MdClose } from "react-icons/md";

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
					<Box display="flex" flexDirection="column" padding={1}>
						<Box display="flex" alignItems="center">
							<Box flexGrow={1} paddingLeft={1}>
								<Typography color='textSecondary' variant="h6" style={{ fontFamily: "Work Sans, -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}>
									{title}
								</Typography>
							</Box>
							<IconButton onClick={onClose}>
								<MdClose />
							</IconButton>
						</Box>
						<List>
							{links.map(link => {
								return (
									<ListItem button key={link.title} to={link.url} component={Link}>
										{link.title}
									</ListItem>
								);
							})}
						</List>
					</Box>
        </Drawer>
      )}
    />
  );
};

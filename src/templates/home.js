import React from "react";
import path from "path";
import { Link, graphql } from "gatsby";
import Img from "gatsby-image";
import Layout from "../components/Layout";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography
} from "@material-ui/core";
import theme from "../style/theme";
import moment from "moment";
import { useHasScroll } from "has-scroll-hook";

const useStyles = makeStyles(() => ({
  cardActions: {
    justifyContent: "flex-end"
  },
  card: {
    background: "transparent"
  },
  cardContent: {
    padding: "8px 0"
  }
}));

const Posts = ({ posts, pathPrefix }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      {posts.map(
        ({
          node: {
            excerpt,
            fileAbsolutePath,
            frontmatter: { id, title, featuredImage }
          }
        }) => {
          const postDate = path
            .basename(fileAbsolutePath)
            .split("-")
            .splice(0, 3)
            .join("-");
          return (
            <Grid item xs={12} sm={4} key={id}>
              <Card elevation={0} classes={{ root: classes.card }}>
                <Img
                  fluid={featuredImage.childImageSharp.fluid}
                  style={{ borderRadius: 2 }}
                />
                <CardContent classes={{ root: classes.cardContent }}>
                  <Box>
                    <Typography
                      gutterBottom
                      variant="h6"
                      style={{
                        marginBottom: 0,
                        fontWeight: 600,
                        fontFamily:
                          "Work Sans, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
                        lineHeight: 1.25
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {moment(postDate).format("LL")}
                    </Typography>
                  </Box>
                  <Box marginY={1}>
                    <Divider light />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    component="p"
                    style={{ fontFamily: "Merriweather, Georgia, serif" }}
                  >
                    {excerpt}
                  </Typography>
                </CardContent>
                <CardActions classes={{ root: classes.cardActions }}>
                  <Button
                    component={Link}
                    to={`/${pathPrefix}/${id}`}
                    variant="outlined"
                    color="secondary"
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        }
      )}
    </Grid>
  );
};

export default function HomeTemplate({
  data: {
    site: {
      siteMetadata: {
        title,
        description,
        templates: {
          posts: { pathPrefix }
        }
      }
    },
    allMdx: { edges: posts }
  }
}) {
  /* Get the vertical scrollbar offset as a boolean value. */
  const hasScroll = useHasScroll();

  return (
    <Layout elevateAppBar={hasScroll}>
      <Box display="flex" flexDirection="column">
        <Box
          textAlign="center"
          paddingTop={4}
          paddingBottom={12}
          paddingX={8}
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            clipPath: "polygon(0 0, 100% 0, 100% 60%, 0% 100%)"
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
              {title}
            </Typography>
            <Typography color="inherit" variant="body1">
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box flexGrow={1} marginX="auto" width="100%" maxWidth={960}>
        <Box padding={2}>
          <Posts posts={posts} pathPrefix={pathPrefix} />
          {posts.length > 1 && (
            <Box
              display="flex"
              justifyContent="flex-end"
              padding={1}
              marginTop={1}
            >
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to={`/${pathPrefix}/page/1`}
              >
                View All
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
}

export const pageQuery = graphql`
  query($limit: Int!) {
    site {
      siteMetadata {
        title
        description
        templates {
          posts {
            pathPrefix
          }
        }
      }
    }
    allMdx(
      filter: { fileAbsolutePath: { regex: "/content/posts/" } }
      sort: { order: DESC, fields: [fileAbsolutePath] }
      limit: $limit
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          fileAbsolutePath
          frontmatter {
            id
            title
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 720) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;

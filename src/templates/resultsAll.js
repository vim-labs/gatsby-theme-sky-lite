import React from "react";
import path from "path";
import { Link, graphql, navigate } from "gatsby";
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
import Pagination from "materialui-pagination-component";
import moment from "moment";

const useStyles = makeStyles(() => ({
  cardActions: {
    justifyContent: "flex-end"
  },
  card: {
    background: "transparent"
  },
  cardContent: {
    padding: 12
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

export default function ResultsAllTemplate({
  data: {
    site: {
      siteMetadata: {
        templates: {
          posts: { pathPrefix }
        }
      }
    },
    allMdx: { edges: posts }
  },
  pageContext: { totalPages, currentPage }
}) {
  return (
    <Layout>
      <Box flexGrow={1} width="100%" maxWidth={960} marginX="auto">
        <Box padding={2}>
          <Posts posts={posts} pathPrefix={pathPrefix} />
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ display: "block", marginTop: 32, marginBottom: 4 }}
          >
            Select page:
          </Typography>
          <Pagination
            selectVariant="button"
            page={currentPage}
            totalPages={totalPages}
            onChange={page => navigate(`/${pathPrefix}/page/${page}`)}
          />
        </Box>
      </Box>
    </Layout>
  );
}

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
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
      skip: $skip
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

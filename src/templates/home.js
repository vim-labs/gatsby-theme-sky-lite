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
import moment from "moment";

const useStyles = makeStyles(() => ({
  cardActions: {
    justifyContent: "flex-end"
  }
}));

const Posts = ({ posts, pathPrefix }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
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
              <Card>
                <Img
                  fluid={featuredImage.childImageSharp.fluid}
                  style={{ borderRadius: 2 }}
                />
                <CardContent>
                  <Box textAlign="center">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: 0 }}
                    >
                      {title}
                    </Typography>
                    <Typography variant="caption">
                      {moment(postDate).format("LL")}
                    </Typography>
                  </Box>
                  <Box marginY={1.5}>
                    <Divider light />
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{ fontFamily: "Merriweather" }}
                  >
                    {excerpt}
                  </Typography>
                </CardContent>
                <CardActions classes={{ root: classes.cardActions }}>
                  <Button
                    component={Link}
                    to={`${pathPrefix}/${id}`}
                    variant="contained"
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

const IndexPage = ({
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
}) => {
  return (
    <Layout>
      <Box flexGrow={1} width="100%" maxWidth={960} marginX="auto">
        <Box padding={2}>
          <Box textAlign="center" padding={4}>
            <Box marginBottom={4}>
              <Typography
                color="primary"
                variant="h2"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Work Sans",
                  marginBottom: 4
                }}
              >
                {title}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {description}
              </Typography>
            </Box>
            <Divider variant="middle" />
          </Box>
          <Posts posts={posts} pathPrefix={pathPrefix} />
        </Box>
      </Box>
    </Layout>
  );
};

export default IndexPage;

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

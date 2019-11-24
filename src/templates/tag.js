import React from "react";
import path from "path";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { Box, Button, Divider, Grid, Typography } from "@material-ui/core";

const Posts = ({ posts, pathPrefix }) => {
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
              <Card
                featuredImage={featuredImage}
                title={title}
                url={`/${pathPrefix}/${id}`}
                postDate={postDate}
                excerpt={excerpt}
              />
            </Grid>
          );
        }
      )}
    </Grid>
  );
};

export default function TagTemplate({
  data: {
    site: {
      siteMetadata: {
        templates: {
          posts: {
            pathPrefix,
            filters: {
              tag: { pathPrefix: pathPrefixTag }
            }
          }
        }
      }
    },
    allMdx: { edges: posts }
  },
  pageContext: { tag }
}) {
  return (
    <Layout>
      <Box flexGrow={1} width="100%" maxWidth={960} marginX="auto">
        <Box padding={2}>
          <Box textAlign="center" padding={4}>
            <Box marginBottom={4}>
              <Typography
                color="primary"
                variant="h3"
                style={{
                  fontWeight: "bold",
                  fontFamily:
                    "Work Sans, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
                  marginBottom: 4,
                  textDecoration: "none"
                }}
              >
                #{tag}
              </Typography>
            </Box>
            <Divider variant="middle" />
          </Box>
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
                to={`/${pathPrefixTag}/${tag}/page/1`}
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
  query($tag: String!, $limit: Int!) {
    site {
      siteMetadata {
        templates {
          posts {
            pathPrefix
            filters {
              tag {
                pathPrefix
              }
            }
          }
        }
      }
    }
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/content/posts/" }
        frontmatter: { tags: { in: [$tag] } }
      }
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

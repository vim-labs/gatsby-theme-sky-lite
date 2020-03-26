module.exports = {
  plugins: [
    `gatsby-plugin-material-ui`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `src/content/pages`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-posts`,
        path: `src/content/posts`
      }
    },
    {
      resolve: "gatsby-plugin-prefetch-google-fonts",
      options: {
        fonts: [
          {
            family: "Roboto"
          },
          {
            family: "Work Sans",
            variants: ["800"]
          }
        ]
      }
    }
  ]
};

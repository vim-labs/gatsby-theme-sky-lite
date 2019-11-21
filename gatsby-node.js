const path = require(`path`);

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  // Get the config settings for the templates.
  const {
    data: {
      site: {
        siteMetadata: { templates }
      }
    }
  } = await graphql(`
    {
      site {
        siteMetadata {
          templates {
            home {
              numberOfPosts
              template
            }
            pages {
              path
              template
            }
            posts {
              path
              pathPrefix
              template
              filters {
                tag {
                  pathPrefix
                  template
                  numberOfPosts
                }
              }
            }
          }
        }
      }
    }
  `);

  // Find all of the markdown files, sorted by filename.
  const createMarkdownPages = async ({ regex, pathPrefix = "", template }) => {
    const result = await graphql(`
			{
				allMdx(
					filter: { fileAbsolutePath: { regex: "${regex}" } }
					sort: { order: DESC, fields: [fileAbsolutePath] }
				) {
					edges {
						node {
							body
							fileAbsolutePath
							frontmatter {
								id
							}
						}
					}
				}
			}
		`);

    // Report any errors if they occurred.
    if (result.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`);
      return;
    }

    // Create each page.
    const pages = result.data.allMdx.edges;

    pages.forEach(({ node }, index) => {
      // Use a permalink based on the frontmatter id in each markdown file.
      const postId = node.frontmatter.id;

      // Define the date based on the filename.
      const postDate = path
        .basename(node.fileAbsolutePath)
        .split("-")
        .splice(0, 3)
        .join("-");

      const previousPath =
        index === pages.length - 1
          ? null
          : `${pathPrefix}/${pages[index + 1].node.frontmatter.id}`;
      const nextPath =
        index === 0
          ? null
          : `${pathPrefix}/${pages[index - 1].node.frontmatter.id}`;

      createPage({
        path: `${pathPrefix}/${postId}`,
        component: path.resolve(`${__dirname}/src/templates/${template}.js`),
        context: {
          postId,
          postDate,
          previousPath,
          nextPath
        }
      });
    });
  };

  // Find all of the tags used in posts.
  const createPostTagFilterPages = async ({
    regex,
    pathPrefix = "",
    template
  }) => {
    const result = await graphql(`
      {
        allMdx {
          group(field: frontmatter___tags) {
            tag: fieldValue
            totalCount
          }
        }
      }
    `);

    // Report any errors if they occurred.
    if (result.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`);
      return;
    }

    // Create a page for each tag.
    const tags = result.data.allMdx.group;
    tags.forEach(({ tag }) => {
      createPage({
        path: `${pathPrefix}/${tag}`,
        component: path.resolve(`${__dirname}/src/templates/${template}.js`),
        context: {
          tag,
          limit: templates.posts.filters.tag.numberOfPosts
        }
      });
    });
  };

  // Create the home page.
  createPage({
    path: "/",
    component: path.resolve(
      `${__dirname}/src/templates/${templates.home.template}.js`
    ),
    context: {
      limit: templates.home.numberOfPosts
    }
  });

  // Create the site pages.
  await createMarkdownPages({
    regex: templates.pages.path,
    template: templates.pages.template
  });

  // Create the site blog post pages.
  await createMarkdownPages({
    regex: templates.posts.path,
    pathPrefix: templates.posts.pathPrefix,
    template: templates.posts.template
  });

  // Create the site blog tag pages.
  await createPostTagFilterPages({
    regex: templates.posts.path,
    pathPrefix: templates.posts.filters.tag.pathPrefix,
    template: templates.posts.filters.tag.template
  });
};

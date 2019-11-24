const path = require(`path`);

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  // Get the template config settings.
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
              totalPosts
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
                  totalPosts
                  pagination {
                    template
                    resultsPerPage
                  }
                }
              }
              pagination {
                template
                resultsPerPage
              }
            }
          }
        }
      }
    }
  `);

  /* Find all of the markdown files, sorted descending by filename.
   * Newest-to-oldest with YYYY-MM-DD date file prefix.
   */

  const createMarkdownPages = async ({
    regex,
    template,
    pathPrefix = "",
    paginate = false
  }) => {
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

    // Iterate through the query results to create individual pages.
    const pages = result.data.allMdx.edges;

    // Calculate the number of paginated results pages.
    const totalPages = Math.ceil(
      pages.length / templates.posts.pagination.resultsPerPage
    );

    const staticPages = pages.map(({ node }, index) => {
      // Use a permalink based on the frontmatter id in each markdown file header.
      const postId = node.frontmatter.id;

      // Define the date based on the filename.
      const postDate = path
        .basename(node.fileAbsolutePath)
        .split("-")
        .splice(0, 3)
        .join("-");

      // The path to the previous page.
      const previousPath =
        index === pages.length - 1
          ? null
          : `/${pathPrefix}/${pages[index + 1].node.frontmatter.id}`;

      // The path to the next page.
      const nextPath =
        index === 0
          ? null
          : `/${pathPrefix}/${pages[index - 1].node.frontmatter.id}`;

      return createPage({
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

    return !paginate
      ? staticPages
      : Promise.all([
          ...staticPages,
          Array.from({ length: totalPages }).map((_, i) =>
            createPage({
              path: `${pathPrefix}/page/${i + 1}`,
              component: path.resolve(
                `${__dirname}/src/templates/${templates.posts.pagination.template}.js`
              ),
              context: {
                limit: templates.posts.pagination.resultsPerPage,
                skip: i * templates.posts.pagination.resultsPerPage,
                totalPages,
                currentPage: i + 1
              }
            })
          )
        ]);
  };

  // Find all of the tags used in posts and create search result pages.
  const createPostTagFilterPages = async ({
    pathPrefix = "",
    paginate = false,
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
    const staticTagPages = tags.map(async ({ tag }) => {
      const staticTagPage = createPage({
        path: `${pathPrefix}/${tag}`,
        component: path.resolve(`${__dirname}/src/templates/${template}.js`),
        context: {
          tag,
          limit: templates.posts.filters.tag.totalPosts
        }
      });

      if (!paginate) return staticTagPage;

      const postsWithTagResult = await graphql(`{
				allMdx(filter: {
					fileAbsolutePath: {regex: "/content/posts/"},
							frontmatter: {tags: {in: ["${tag}"]}}
				}
				) {
					totalCount
				}
			}`);

      // Report any errors if they occurred.
      if (postsWithTagResult.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`);
        return;
      }

      const totalPostsWithTag = postsWithTagResult.data.allMdx.totalCount;

      const totalPages = Math.ceil(
        totalPostsWithTag /
          templates.posts.filters.tag.pagination.resultsPerPage
      );

      const staticTagPagination = Array.from({ length: totalPages }).map(
        (_, i) =>
          createPage({
            path: `${pathPrefix}/${tag}/page/${i + 1}`,
            component: path.resolve(
              `${__dirname}/src/templates/${templates.posts.filters.tag.pagination.template}.js`
            ),
            context: {
              limit: templates.posts.filters.tag.pagination.resultsPerPage,
              skip: i * templates.posts.filters.tag.pagination.resultsPerPage,
              totalPages: totalPostsWithTag,
              currentPage: i + 1,
              tag
            }
          })
      );

      return Promise.all([staticTagPage, ...staticTagPagination]);
    });

    return staticTagPages;
  };

  return await Promise.all([
    //Create the home page with paginated results views.
    createPage({
      path: "/",
      component: path.resolve(
        `${__dirname}/src/templates/${templates.home.template}.js`
      ),
      context: {
        limit: templates.home.totalPosts
      }
    }),

    // Create the individual content pages for mdx files in src/content/pages.
    createMarkdownPages({
      regex: templates.pages.path,
      template: templates.pages.template
    }),

    // Create individual blog post pages and paginated results pages for mdx files in src/content/posts.
    createMarkdownPages({
      regex: templates.posts.path,
      pathPrefix: templates.posts.pathPrefix,
      template: templates.posts.template,
      paginate: true
    }),

    // Create pages for each frontmatter tag used in src/content/posts with paginated result pages.
    createPostTagFilterPages({
      regex: templates.posts.path,
      pathPrefix: templates.posts.filters.tag.pathPrefix,
      template: templates.posts.filters.tag.template,
      paginate: true
    })
  ]);
};

import React from "react";
import { Link } from "gatsby";

const isExternalUrl = url => url.indexOf("//") > -1;

export default ({ to, children }) => {
  // Open external links in a new browser tab and internal links using Gatsby's router.
  return isExternalUrl ? (
    <a href={to} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <Link to={to}>{children}</Link>
  );
};

'use client';

import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';

/**
 * NextLinkComposed Component
 *
 * Extends Next.js Link to accept a `to` prop (alias pre `href`)
 * and preserve styling on page reload.
 *
 * @component
 * @example
 * <NextLinkComposed to="/about" className="custom-link">
 *   About Us
 * </NextLinkComposed>
 *
 * @remarks
 * Accepts all standard anchor attributes plus Next.js Link props.
 *
 * @dependencies
 * Next.js (Link), React
 */

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  NextLinkProps & {
    to?: NextLinkProps['href']; // alias for href (compatibility with other routing libraries)
  };

// ---------- Component

const NextLinkComposed = forwardRef<HTMLAnchorElement, Props>(
  ({ to, href, replace, scroll, shallow, prefetch, locale, ...other }, ref) => {
    return (
      <NextLink
        href={to || href}
        prefetch={prefetch} // Next.js page prefetching
        replace={replace}   // Replace current history entry
        scroll={scroll}     // Scroll to top after navigation
        shallow={shallow}   // Shallow routing
        locale={locale}     // Internationalization
        passHref            // Force pass href to child
        legacyBehavior
      >
        <a ref={ref} {...other} />
      </NextLink>
    );
  }
);

export default NextLinkComposed;

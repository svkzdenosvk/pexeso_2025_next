//this component is help from chatgpt to fix problems with styling changes during reloading page

'use client';
import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  NextLinkProps & {
    to?: NextLinkProps['href']; // this  add `to` with same type as `href`
  };

const NextLinkComposed = forwardRef<HTMLAnchorElement, Props>(
  ({ to, href, replace, scroll, shallow, prefetch, locale, ...other }, ref) => {
    return (
      <NextLink
        href={to || href}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        passHref
        legacyBehavior
      >
        <a ref={ref} {...other} />
      </NextLink>
    );
  }
);

export default NextLinkComposed;

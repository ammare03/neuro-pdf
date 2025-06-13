"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: any;
  className?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink = ({
  children,
  href,
  ...props
}: TransitionLinkProps) => {
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    const body = document.querySelector("body");
    body?.classList.add("page-transition");
    await sleep(600);
    router.push(href);
    await sleep(200);
    body?.classList.remove("page-transition");
  };
  return (
    <Link onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
};

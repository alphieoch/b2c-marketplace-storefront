"use client";

import Link from "next/link";
import { DIcons } from "dicons";

import ThemeToogle from "@/components/ui/footer";

const navigation = {
  sections: [
    {
      id: "shop",
      name: "Shop",
      items: [
        { name: "Home", href: "/" },
        { name: "All Products", href: "/categories" },
        { name: "Stores", href: "/stores" },
        { name: "Cart", href: "/cart" },
        { name: "Checkout", href: "/checkout" },
      ],
    },
    {
      id: "account",
      name: "My Account",
      items: [
        { name: "Profile", href: "/user" },
        { name: "Orders", href: "/user/orders" },
        { name: "Wishlist", href: "/user/wishlist" },
        { name: "Returns", href: "/user/returns" },
        { name: "Reviews", href: "/user/reviews" },
        { name: "Messages", href: "/user/messages" },
        { name: "Addresses", href: "/user/addresses" },
      ],
    },
    {
      id: "sellers",
      name: "For Sellers",
      items: [
        { name: "My Store", href: "/user" },
        { name: "Become a Seller", href: "/register" },
        { name: "Seller Sign In", href: "/login" },
      ],
    },
    {
      id: "support",
      name: "Help & Access",
      items: [
        { name: "Sign In", href: "/login" },
        { name: "Create Account", href: "/register" },
        { name: "Forgot Password", href: "/forgot-password" },
        { name: "Settings", href: "/user/settings" },
      ],
    },
  ],
};

const underlineClass =
  "hover:-translate-y-1 rounded-xl border border-dotted p-2.5 transition-transform";

export function Footer() {
  return (
    <footer
      className="mx-auto w-full border-b border-t border-ali/20 bg-primary px-2 md:px-4"
      data-testid="footer"
    >
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
        <Link href="/">
          <p className="flex items-center justify-center rounded-full">
            <DIcons.Designali className="w-8 text-red-600" />
          </p>
        </Link>
        <p className="bg-transparent text-center text-xs leading-4 text-primary/60 md:text-left">
          Welcome to Farm Marketplace, where trusted local sellers and happy
          customers come together every day. We are building a positive
          commerce experience that makes it easy to discover quality products,
          support real businesses, and shop with confidence. From fresh ideas
          to reliable delivery, our focus is simple: create meaningful
          connections, keep quality high, and help our community grow stronger
          with every order.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted"> </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 md:grid-cols-4">
          {navigation.sections.map((section) => (
            <div key={section.id}>
              <h3
                id={`footer-${section.id}-heading`}
                className="mb-4 text-xs font-semibold uppercase tracking-wide text-black dark:text-white"
              >
                {section.name}
              </h3>
              <ul
                role="list"
                aria-labelledby={`footer-${section.id}-heading`}
                className="flex flex-col space-y-2"
              >
                {section.items.map((item) => (
                  <li key={item.name} className="flow-root">
                    <Link
                      href={item.href}
                      className="text-sm text-slate-600 hover:text-black dark:text-slate-400 hover:dark:text-white md:text-xs"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-b border-dotted"> </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-6 gap-y-6 px-6 pb-10 md:grid md:grid-cols-3 md:gap-0 md:px-10">
        <div
          className="flex flex-row flex-wrap items-center justify-center gap-1 text-xs text-slate-600 dark:text-slate-400 md:order-1 md:flex-nowrap md:justify-start md:justify-self-start"
          data-testid="footer-copyright"
        >
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span>An</span>
          <Link
            aria-label="Ochieng & Co website"
            href="https://ochiengandco.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-black hover:underline dark:text-white"
          >
            Ochieng &amp; Co
          </Link>
          <span>product. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 md:order-2 md:justify-self-center">
          <Link
            aria-label="Email"
            href="mailto:contact@designali.in"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.Mail strokeWidth={1.5} className="h-5 w-5" />
          </Link>
          <Link
            aria-label="X"
            href="https://x.com/designali_in"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.X className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Instagram"
            href="https://www.instagram.com/designali.in/"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.Instagram className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Threads"
            href="https://www.threads.net/designali.in"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.Threads className="h-5 w-5" />
          </Link>
          <Link
            aria-label="WhatsApp"
            href="https://chat.whatsapp.com/LWsNPcz5BlWDVOha41vzuh"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.WhatsApp className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Behance"
            href="https://www.behance.net/designali-in"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.Behance className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Facebook"
            href="https://www.facebook.com/designali.agency"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.Facebook className="h-5 w-5" />
          </Link>
          <Link
            aria-label="LinkedIn"
            href="https://www.linkedin.com/company/designali"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.LinkedIn className="h-5 w-5" />
          </Link>
          <Link
            aria-label="YouTube"
            href="https://www.youtube.com/@designali-in"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
          >
            <DIcons.YouTube className="h-5 w-5" />
          </Link>
        </div>

        <div className="md:order-3 md:justify-self-end">
          <ThemeToogle />
        </div>
      </div>
    </footer>
  );
}


import { Variants } from "motion/react";
import { isDev } from "./helpers";

export const pricingPlans = [
  {
    name: "Basic",
    price: 9,
    description: "Perfect for occasional users",
    items: [
      "5 Summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_14AdR9eTHd0Vgq85a84ko00"
      : "https://buy.stripe.com/test_14AdR9eTHd0Vgq85a84ko00",
    priceId: isDev
      ? "price_1Rarb4ImsQm3JXX3zEHehEYa"
      : "price_1Rarb4ImsQm3JXX3zEHehEYa",
  },
  {
    name: "Pro",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown export",
    ],
    id: "pro",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_9B69AT5j74up0ra0TS4ko01"
      : "https://buy.stripe.com/test_9B69AT5j74up0ra0TS4ko01",
    priceId: isDev
      ? "price_1RarcxImsQm3JXX3vD9FhKol"
      : "price_1RarcxImsQm3JXX3vD9FhKol",
  },
];

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      duration: 0.8,
    },
  },
};

export const buttonVariants = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10,
  },
} as const;

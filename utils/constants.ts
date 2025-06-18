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
      : "",
    priceId: isDev ? "price_1Rarb4ImsQm3JXX3zEHehEYa" : "",
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
      : "",
    priceId: isDev ? "price_1RarcxImsQm3JXX3vD9FhKol" : "",
  },
];

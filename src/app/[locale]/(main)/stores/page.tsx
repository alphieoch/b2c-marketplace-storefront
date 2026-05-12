import type { Metadata } from "next";

import { StoresListing } from "@/components/sections/StoresListing/StoresListing";
import { computeSellerHighlights } from "@/lib/data/seller-highlights";
import { listSellers } from "@/lib/data/seller";
import { getSellerSpecialties } from "@/lib/data/seller-specialties";

export const metadata: Metadata = {
  title: "Stores",
  description: "Browse all marketplace stores.",
};

export default async function StoresPage() {
  const [sellers, { specialties, productCounts }] = await Promise.all([
    listSellers(),
    getSellerSpecialties(),
  ]);
  const highlights = computeSellerHighlights(sellers, specialties, productCounts);

  return (
    <main className="container">
      <h1 className="heading-xl uppercase">Stores</h1>
      <StoresListing
        sellers={sellers}
        specialties={specialties}
        highlights={highlights}
      />
    </main>
  );
}


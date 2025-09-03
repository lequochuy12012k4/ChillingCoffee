import Footer from "@/app/components/client/Footer";
import Hero from "@/app/components/client/HomeContext/HomeHero";
import Navbar from "@/app/components/client/Navbar";
import ProductGrid from "@/app/components/client/ProductsHero/ProductGrid";
import ProductsHero from "@/app/components/client/ProductsHero/ProductsHero";

export default function ProductsPage() {
    return (
        <>
            <Navbar />
            <ProductsHero/>
            <ProductGrid/>
            <Footer />
        </>
    );
}
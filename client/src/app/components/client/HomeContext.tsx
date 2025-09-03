import AboutUsSection from "./HomeContext/AboutUsSection";
import Hero from "./HomeContext/HomeHero";
import IntroductionSection from "./HomeContext/IntroductionSection";

export default function HomeContext(){
    return(
        <>
            <Hero/>
            <IntroductionSection/>
            <AboutUsSection/>
        </>
    );
}
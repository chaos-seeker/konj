import { Banner } from "@/containers/routes/home/banner";
import { Category } from "@/containers/routes/home/category";
import { Newest } from "@/containers/routes/home/newest";

export default function Home() {
  return (
    <>
      <Banner
        image="/images/routes/home/banner-1-desktop.png"
        imageMobile="/images/routes/home/banner-1-mobile.png"
      />
      <Category />
      <Newest />
    </>
  );
}

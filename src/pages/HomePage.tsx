import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/layout/HeroSection";
// import BlogList from "@/components/blog/BlogList"; // Example for later

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Latest Posts
        </h2>
        {/* <BlogList /> */}
        <p className="text-center text-gray-500">
          Blog posts will be displayed here.
        </p>
        {/* Placeholder for blog cards similar to the image */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <div className="h-40 bg-gray-200 mb-4 rounded"></div>{" "}
            {/* Image Placeholder */}
            <p className="text-sm text-gray-500 uppercase mb-1">
              Travel - January 21, 2015
            </p>
            <h3 className="text-xl font-semibold mb-2">
              LOVE WRITING AND SHARING
            </h3>
            <p className="text-gray-700 text-sm">
              Dignissimos ducimus qui blanditiis praesentium voluptatum modi
              tempora incidunt ut labore et dolore deleniti atque corrupti lorem
              ipsum
            </p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <div className="h-40 bg-gray-200 mb-4 rounded"></div>{" "}
            {/* Image Placeholder */}
            <p className="text-sm text-gray-500 uppercase mb-1">
              Magazine - January 21, 2015
            </p>
            <h3 className="text-xl font-semibold mb-2">
              THE ULTIMATE CONSUMERS
            </h3>
            <p className="text-gray-700 text-sm">
              Reiciendis voluptatibus maiores alias consequatur aut perferendis
              doloribus asperiores repellat lorem ipsum sit modi tempora
              incidunt ut labore et dolore
            </p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <div className="h-40 bg-gray-200 mb-4 rounded"></div>{" "}
            {/* Image Placeholder */}
            <p className="text-sm text-gray-500 uppercase mb-1">
              Tech, Travel - December 25, 2014
            </p>
            <h3 className="text-xl font-semibold mb-2">
              IT IS BEYOND BLOGGING
            </h3>
            <p className="text-gray-700 text-sm">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium on the doloremque laudantium sunt in culpa qui officia
              deserunt mollitia
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

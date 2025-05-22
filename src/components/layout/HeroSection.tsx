export default function HeroSection() {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat pt-48 pb-32 md:pt-64 md:pb-48"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523657895111-376b5d07a55a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Using a high-quality placeholder for demonstration
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
    </div>
  );
}

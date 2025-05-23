import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // Import the new AuthPage
import HomePage from "./pages/HomePage"; // Import HomePage
import PostsPage from "./pages/PostsPage"; // Import the new PostsPage
import FeaturesPage from "./pages/FeaturesPage"; // Import the new FeaturesPage
import CategoryPage from "./pages/CategoryPage"; // Import the new CategoryPage
import MyWorksPage from "./pages/MyWorksPage"; // Import MyWorksPage
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import SinglePostPage from "./pages/SinglePostPage";
import HandleTokenPage from "./pages/HandleTokenPage"; // Import HandleTokenPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
        {/* Set HomePage as the default route */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/handle-token" element={<HandleTokenPage />} />{" "}
        {/* Add route for HandleTokenPage */}
        {/* Route for all posts */}
        <Route path="/posts" element={<PostsPage />} />{" "}
        <Route path="/features" element={<FeaturesPage />} />{" "}
        <Route path="/category/:categoryName" element={<CategoryPage />} />{" "}
        <Route path="/my-works" element={<MyWorksPage />} />{" "}
        {/* Route for my works page */}
        <Route path="/my-works/create" element={<CreatePostPage />} />
        <Route path="/my-works/edit/:postId" element={<EditPostPage />} />
        <Route path="/posts/:slug" element={<SinglePostPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

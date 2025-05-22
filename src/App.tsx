import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage"; // No longer needed
// import SignupPage from "./pages/SignupPage"; // No longer needed
import AuthPage from "./pages/AuthPage"; // Import the new AuthPage
import HomePage from "./pages/HomePage"; // Import HomePage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
        {/* Set HomePage as the default route */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Add other specific routes here if they don't use MainLayout or have a different layout */}
        {/* For example, if MyBlogsPage uses MainLayout, you'd just add: */}
        {/* <Route path="/my-blogs" element={<MyBlogsPage />} /> */}
        {/* And MyBlogsPage would import and use MainLayout internally */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

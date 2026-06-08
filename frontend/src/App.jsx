import { useState } from "react";
import Home from "./pages/Home.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import AdminMenu from "./pages/AdminMenu.jsx";
import Feedback from "./pages/Feedback.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";


function App() {
  const [isAdminMode, setIsAdminMode] = useState(
    localStorage.getItem("adminMode") === "true"
  );

  const path = window.location.pathname;

  const openAdminMode = () => {
    const pin = window.prompt("Enter Admin PIN");

    if (pin === "1234") {
      localStorage.setItem("adminMode", "true");
      setIsAdminMode(true);
    } else {
      alert("Wrong admin PIN");
    }
  };

  const closeAdminMode = () => {
    localStorage.removeItem("adminMode");
    setIsAdminMode(false);
    window.location.href = "/";
  };

  if (path === "/feedback") {
    return <Feedback />;
  }

  if (isAdminMode && path === "/admin/menu") {
    return <AdminMenu />;
  }

  if (isAdminMode && path === "/admin/feedback") {
    return <AdminFeedback />;
  }


  if (isAdminMode) {
    return <AdminHome closeAdminMode={closeAdminMode} />;
  }

  return <Home openAdminMode={openAdminMode} />;
}

export default App;
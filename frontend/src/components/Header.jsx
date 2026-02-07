import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">ParaTrain Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Patient Mode</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-para-teal hover:text-para-teal-dark font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

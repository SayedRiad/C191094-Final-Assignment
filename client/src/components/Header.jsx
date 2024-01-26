import Budget from "./Budget";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-violet-400 to-violet-600">
      <Navbar />
      <Budget />
    </div>
  );
}

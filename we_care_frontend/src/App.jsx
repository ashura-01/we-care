import NavBar from "./components/NavBar";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="app-shell">
        <NavBar />
        <main className="app-main">
          <AppRoutes />
        </main>
      </div>
    </>
  );
}

export default App;
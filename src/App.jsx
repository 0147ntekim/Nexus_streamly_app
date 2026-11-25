import AuthProvider from "./context/AuthProvider.jsx";
import WatchlistProvider from "./context/WatchlistProvider.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <AppRoutes />
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;
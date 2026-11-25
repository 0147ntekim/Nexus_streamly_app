import AuthProvider from "./context/AuthProvider.jsx";
import SubscriptionProvider from "./context/SubscriptionProvider.jsx";
import WatchlistProvider from "./context/WatchlistProvider.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <WatchlistProvider>
          <AppRoutes />
        </WatchlistProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
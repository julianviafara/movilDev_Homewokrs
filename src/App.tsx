import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Navigate, Route } from "react-router-dom";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "./theme/app.scss";

import { AppProvider, useApp } from "./context/AppContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Results from "./pages/Results";

setupIonicReact();

const Routes: React.FC = () => {
  const { user, authReady } = useApp();

  if (!authReady) {
    return (
      <div className="splash">
        <IonSpinner />
      </div>
    );
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/results" element={user ? <Results /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AppProvider>
      <Routes />
    </AppProvider>
  </IonApp>
);

export default App;

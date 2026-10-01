import { IonApp } from "@ionic/react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { TasksProvider } from "./contexts/TasksContext";

import AppRoute from "./components/AppRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import TaskDetail from "./pages/TaskDetail";

import "./theme/app.css";

const App = () => {
  return (
    <IonApp>
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <Routes>

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              <Route
                path="/tasks"
                element={
                  <AppRoute>
                    <Tasks />
                  </AppRoute>
                }
              />

              <Route
                path="/tasks/add"
                element={
                  <AppRoute>
                    <AddTask />
                  </AppRoute>
                }
              />

              <Route
                path="/tasks/:id"
                element={
                  <AppRoute>
                    <TaskDetail />
                  </AppRoute>
                }
              />

              <Route
                path="/tasks/:id/edit"
                element={
                  <AppRoute>
                    <EditTask />
                  </AppRoute>
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to="/tasks"
                    replace
                  />
                }
              />

            </Routes>
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    </IonApp>
  );
};

export default App;
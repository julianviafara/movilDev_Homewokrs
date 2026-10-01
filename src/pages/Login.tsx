import {
    IonButton,
    IonContent,
    IonInput,
    IonPage,
    IonText,
  } from "@ionic/react";
  
  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useAuthContext } from "../contexts/AuthContext";
  
  const Login = () => {
    const navigate = useNavigate();
  
    const { login } = useAuthContext();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleLogin = async () => {
      setError("");
  
      try {
        await login(email, password);
        navigate("/tasks");
      } catch (error: any) {
        setError("Invalid email or password.");
        console.error(error);
      }
    };
  
    return (
      <IonPage>
        <IonContent className="art-deco-page">
          <div className="auth-container">
            <div className="deco-symbol">✦</div>
  
            <h1>TASK DECO</h1>
  
            <p className="subtitle">
              Organize your world with style.
            </p>
  
            <div className="deco-line" />
  
            <div className="auth-card">
              <h2>WELCOME BACK</h2>
  
              <IonInput
                className="deco-input"
                label="Email"
                labelPlacement="stacked"
                type="email"
                value={email}
                onIonInput={(e) =>
                  setEmail(e.detail.value ?? "")
                }
              />
  
              <IonInput
                className="deco-input"
                label="Password"
                labelPlacement="stacked"
                type="password"
                value={password}
                onIonInput={(e) =>
                  setPassword(e.detail.value ?? "")
                }
              />
  
              {error && (
                <IonText color="danger">
                  <p>{error}</p>
                </IonText>
              )}
  
              <IonButton
                expand="block"
                className="deco-button"
                onClick={handleLogin}
              >
                LOGIN
              </IonButton>
  
              <p className="auth-footer">
                Don't have an account?
                <br />
                <Link to="/register">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;
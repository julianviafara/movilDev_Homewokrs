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
  
  const Register = () => {
    const navigate = useNavigate();
  
    const { register } = useAuthContext();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
      useState("");
  
    const [error, setError] = useState("");
  
    const handleRegister = async () => {
      setError("");
  
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      if (password.length < 6) {
        setError(
          "Password must contain at least 6 characters."
        );
        return;
      }
  
      try {
        await register(email, password);
        navigate("/tasks");
      } catch (error: any) {
        setError(
          error.message || "Unable to create account."
        );
      }
    };
  
    return (
      <IonPage>
        <IonContent className="art-deco-page">
          <div className="auth-container">
            <div className="deco-symbol">◆</div>
  
            <h1>TASK DECO</h1>
  
            <p className="subtitle">
              Create your account.
            </p>
  
            <div className="deco-line" />
  
            <div className="auth-card">
              <h2>REGISTER</h2>
  
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
  
              <IonInput
                className="deco-input"
                label="Confirm password"
                labelPlacement="stacked"
                type="password"
                value={confirmPassword}
                onIonInput={(e) =>
                  setConfirmPassword(
                    e.detail.value ?? ""
                  )
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
                onClick={handleRegister}
              >
                CREATE ACCOUNT
              </IonButton>
  
              <p className="auth-footer">
                Already have an account?
                <br />
                <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Register;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
} from "@ionic/react";

interface LoginProps {
  onLoginSuccess: () => void;
}

const VALID_EMAIL = "joke@mail.com";
const VALID_PASSWORD = "123";

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem("logged", "true");
      setError("");
      onLoginSuccess();
      navigate("/home");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Email"
            labelPlacement="floating"
            type="email"
            placeholder="joke@mail.com"
            value={email}
            onIonInput={(e: CustomEvent<{ value?: string | null }>) =>
              setEmail(e.detail.value ?? "")
            }
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Password"
            labelPlacement="floating"
            type="password"
            placeholder="123"
            value={password}
            onIonInput={(e: CustomEvent<{ value?: string | null }>) =>
              setPassword(e.detail.value ?? "")
            }
          />
        </IonItem>

        {error && (
          <IonText color="danger">
            <p className="ion-text-center">{error}</p>
          </IonText>
        )}

        <IonButton expand="block" color="secondary" onClick={handleLogin}>
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
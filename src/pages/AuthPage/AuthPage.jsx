import { useParams } from 'react-router-dom';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm.jsx';
import LoginForm from '../../components/LoginForm/LoginForm.jsx';

export default function AuthPage() {
  const { authType } = useParams();

  if (authType === 'register') {
    return <RegistrationForm />;
  }

  if (authType === 'login') {
    return <LoginForm />;
  }

  return <p>Unknown auth type</p>;
}

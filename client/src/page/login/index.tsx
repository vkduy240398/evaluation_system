import LoginForm from '../../views/login/LoginForm';

const Login: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '86vh',
      }}
    >
      <LoginForm />
    </div>
  );
};

export default Login;

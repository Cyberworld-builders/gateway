import { RegisterForm } from "./RegisterForm";

type RegisterPageProps = {
  searchParams?: { 
    client_id?: string;
    redirect_uri?: string;
    state?: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const clientId = searchParams?.client_id;
  const redirectUri = searchParams?.redirect_uri;
  const state = searchParams?.state;

  const oauthParams = clientId && redirectUri ? {
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
  } : undefined;

  return <RegisterForm oauthParams={oauthParams} />;
}


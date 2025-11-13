import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams?: { 
    redirectedFrom?: string;
    client_id?: string;
    redirect_uri?: string;
    state?: string;
    response_type?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams?.redirectedFrom;
  const clientId = searchParams?.client_id;
  const redirectUri = searchParams?.redirect_uri;
  const state = searchParams?.state;

  // If OAuth parameters are present, pass them to the form
  const oauthParams = clientId && redirectUri ? {
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
  } : undefined;

  return <LoginForm redirectTo={redirectTo} oauthParams={oauthParams} />;
}


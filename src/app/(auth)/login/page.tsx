import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ 
    redirectedFrom?: string;
    client_id?: string;
    redirect_uri?: string;
    state?: string;
    response_type?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params?.redirectedFrom;
  const clientId = params?.client_id;
  const redirectUri = params?.redirect_uri;
  const state = params?.state;

  // If OAuth parameters are present, pass them to the form
  const oauthParams = clientId && redirectUri ? {
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
  } : undefined;

  return <LoginForm redirectTo={redirectTo} oauthParams={oauthParams} />;
}


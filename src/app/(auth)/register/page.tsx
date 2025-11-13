import { RegisterForm } from "./RegisterForm";

type RegisterPageProps = {
  searchParams: Promise<{ 
    client_id?: string;
    redirect_uri?: string;
    state?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const clientId = params?.client_id;
  const redirectUri = params?.redirect_uri;
  const state = params?.state;

  const oauthParams = clientId && redirectUri ? {
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
  } : undefined;

  return <RegisterForm oauthParams={oauthParams} />;
}


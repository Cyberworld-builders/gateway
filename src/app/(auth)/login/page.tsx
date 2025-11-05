import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams?: { redirectedFrom?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams?.redirectedFrom;

  return <LoginForm redirectTo={redirectTo} />;
}


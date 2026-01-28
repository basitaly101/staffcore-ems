import LoginPage from "./login/page";
import HRSignupPage from "./HR/signup/page";
export default function Page() {
  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <LoginPage />
      <HRSignupPage />
    </div>
  );
}

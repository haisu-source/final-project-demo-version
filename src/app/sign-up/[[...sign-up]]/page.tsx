import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-12">
      <SignUp />
    </div>
  );
}

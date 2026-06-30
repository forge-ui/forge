"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Button,
  Checkbox,
  TextField,
} from "@forge-ui-official/core";
import {
  EyeLinear,
  LockKeyholeLinear,
  MailboxLinear,
  UserLinear,
} from "solar-icon-set";

type AuthMode = "login" | "register" | "forgot" | "reset";

type AuthCopy = {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  footerText: string;
  footerLabel: string;
};

const copyByMode: Record<AuthMode, AuthCopy> = {
  login: {
    title: "Welcome Back!",
    subtitle: "Welcome back, please enter your details.",
    primaryLabel: "Log in",
    footerText: "Don't have an account?",
    footerLabel: "Register now",
  },
  register: {
    title: "Welcome to Protask!",
    subtitle: "Register now and start your adventure.",
    primaryLabel: "Register",
    footerText: "Already have an account?",
    footerLabel: "Log in",
  },
  forgot: {
    title: "Forgot Password",
    subtitle:
      "Enter the email address you used when joined and we'll send reset instructions to reset your password.",
    primaryLabel: "Send Reset Instructions",
    footerText: "Back to log in page?",
    footerLabel: "Back now",
  },
  reset: {
    title: "Reset Password",
    primaryLabel: "Reset Password",
    footerText: "Don't have an account?",
    footerLabel: "Register now",
  },
};

export function ProtaskAuthPage({
  mode,
  basePath,
  enterPath,
  previewImage,
}: {
  mode: AuthMode;
  basePath: string;
  enterPath: string;
  previewImage: string;
}) {
  const router = useRouter();
  const copy = copyByMode[mode];
  const heroImage = previewImage.startsWith("/images/protask/")
    ? previewImage
    : "/images/protask/auth-login.jpg";

  const footerHref =
    mode === "login"
      ? `${basePath}/register`
      : mode === "reset"
        ? `${basePath}/register`
        : basePath;

  const handlePrimary = () => {
    if (mode === "forgot") {
      router.push(`${basePath}/reset-password`);
      return;
    }
    router.push(enterPath);
  };

  return (
    <main className="min-h-screen bg-white p-4 lg:p-6">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-6 lg:min-h-[calc(100vh-48px)] lg:grid-cols-[minmax(360px,640px)_minmax(420px,1fr)]">
        <section className="relative hidden overflow-hidden rounded-2xl bg-fg-grey-100 lg:block">
          <Image
            src={heroImage}
            alt="Protask auth preview"
            fill
            sizes="640px"
            className="object-cover object-left"
            priority
          />
        </section>

        <section className="relative flex min-h-[720px] items-center justify-center rounded-2xl bg-white">
          <div className="flex w-full max-w-96 flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-2xl font-semibold leading-8 tracking-fg text-fg-black">
                {copy.title}
              </h1>
              {copy.subtitle && (
                <p className="text-base font-normal leading-6 tracking-fg text-fg-grey-700">
                  {copy.subtitle}
                </p>
              )}
            </div>

            {(mode === "login" || mode === "register") && (
              <>
                <div className="flex w-full flex-col gap-4">
                  <SocialButton iconSrc="/images/brands/google.svg">
                    Register with Google
                  </SocialButton>
                  <SocialButton iconSrc="/images/brands/facebook.svg">
                    Register with Facebook
                  </SocialButton>
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="h-px flex-1 bg-fg-grey-200" />
                  <span className="text-sm font-normal leading-5 tracking-fg text-fg-grey-700">
                    or
                  </span>
                  <div className="h-px flex-1 bg-fg-grey-200" />
                </div>
              </>
            )}

            <div className="flex w-full flex-col gap-4">
              {mode === "register" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Name"
                    placeholder="Your name..."
                    iconLeft={<UserLinear size={18} />}
                  />
                  <TextField
                    label="Username"
                    placeholder="Your username..."
                    iconLeft={<UserLinear size={18} />}
                  />
                </div>
              )}

              {(mode === "login" || mode === "register" || mode === "forgot") && (
                <TextField
                  label={mode === "login" ? "Username/email" : "Email"}
                  placeholder={mode === "login" ? "Your username/email..." : "Your email..."}
                  iconLeft={<MailboxLinear size={18} />}
                />
              )}

              {mode === "login" && (
                <TextField
                  label="Password"
                  placeholder="Your password..."
                  type="password"
                  iconLeft={<LockKeyholeLinear size={18} />}
                  iconRight={<EyeLinear size={18} />}
                  headerAction={
                    <button
                      type="button"
                      onClick={() => router.push(`${basePath}/forgot-password`)}
                      className="text-sm font-bold leading-5 tracking-fg text-fg-violet"
                    >
                      Forgot Password
                    </button>
                  }
                />
              )}

              {mode === "register" && (
                <>
                  <TextField
                    label="Password"
                    placeholder="Your password..."
                    type="password"
                    iconLeft={<LockKeyholeLinear size={18} />}
                    iconRight={<EyeLinear size={18} />}
                  />
                  <div className="flex items-start gap-2 overflow-hidden">
                    <Checkbox checked={false} color="purple" />
                    <span className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">
                      I agree to all the Terms & Privacy Policy
                    </span>
                  </div>
                </>
              )}

              {mode === "reset" && (
                <>
                  <TextField
                    label="New Password"
                    placeholder="Your password..."
                    type="password"
                    iconLeft={<LockKeyholeLinear size={18} />}
                    iconRight={<EyeLinear size={18} />}
                  />
                  <TextField
                    label="Confirm Password"
                    placeholder="Your password..."
                    type="password"
                    iconLeft={<LockKeyholeLinear size={18} />}
                    iconRight={<EyeLinear size={18} />}
                  />
                </>
              )}

              <Button className="w-full" onClick={handlePrimary}>
                {copy.primaryLabel}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm leading-5 tracking-fg">
              <span className="font-normal text-fg-grey-700">{copy.footerText}</span>
              <button
                type="button"
                onClick={() => router.push(footerHref)}
                className="font-bold text-fg-violet"
              >
                {copy.footerLabel}
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-1 text-sm font-normal leading-5 tracking-fg text-fg-grey-700 md:flex">
            <span>2024 Made With By Sugab</span>
          </div>
        </section>
      </div>
    </main>
  );
}

function SocialButton({
  iconSrc,
  children,
}: {
  iconSrc: string;
  children: string;
}) {
  return (
    <Button
      type="button"
      color="grey"
      variant="tertiary"
      className="w-full"
      iconLeft={<Image src={iconSrc} alt="" width={20} height={20} />}
    >
      {children}
    </Button>
  );
}

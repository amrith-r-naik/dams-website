import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SignInAuthForm } from "@/components/signIn-auth-form";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";  // Import Image from next/image

export default function SignInRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await signOut();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "absolute right-4 top-4 md:right-8 md:top-8 md:py-1"
          )}
        >
          <ArrowLeft />
          Home
        </Link>
        
        {/* Left Side Background Section */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          {/* Image Background Section */}
          <div className="absolute inset-0 z-10">
            <Image
              src="/human-dog.png" // Path to the image in the public directory
              alt="Human and Dog"
              layout="fill" // This will make the image fill the container
              objectFit="cover" // Ensures the image covers the area without distortion
              className="opacity-60" // Reduced opacity
            />
          </div>

          {/* Content on top of the image */}
          <div className="absolute inset-0 bg-secondary z-20 opacity-60" />
          <Link
            href={"/"}
            className="relative z-30 flex items-center text-lg font-medium"
          >
            <Icons.logo className="h-12 w-12" />
            <span className="hidden font-bold lg:inline-block text-xl">
              FurEver
            </span>
          </Link>
          {/* <Icons.logo className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-10 z-10 w-full h-[80%]" /> */}
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                Adopting one dog won&apos;t change the world, but for that one dog, the world will change forever.
              </p>
            </blockquote>
          </div>
        </div>

        {/* Right Side Sign In Section */}
        {session ? (
          // Logged-in view
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            <h1 className="font-foreground font-semibold">
              You are logged in as {session.user.name}
            </h1>
            <Button
              variant="destructive"
              className="w-fit"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          // Not logged-in view
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign In to FurEver
                </h1>
                <p className="text-sm text-muted-foreground">
                  using your google account
                </p>
              </div>
              <SignInAuthForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

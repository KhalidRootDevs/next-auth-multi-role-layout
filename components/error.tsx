import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  message: string;
  backPage: string;
  backRoute: string;
}

export default function ErrorPage({
  message,
  backPage,
  backRoute = '/'
}: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        500
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        Something&apos;s went wrong!
      </h2>
      <p>{message}</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Go back
        </Button>
        <Button
          onClick={() => router.push(backRoute)}
          variant="outline"
          size="lg"
        >
          Back to {backPage}
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="default"
          size="lg"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

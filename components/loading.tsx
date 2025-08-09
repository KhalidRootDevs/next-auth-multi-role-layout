import { Icons } from './icons';

export default function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-ping">
        <Icons.logo />
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileImage({
  link,
  name,
  className
}: {
  link?: string;
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={link} alt={name} />
      <AvatarFallback>
        {name
          ?.split(' ')
          .map((n: string) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
  );
}

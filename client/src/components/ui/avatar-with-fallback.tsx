import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";

type AvatarWithFallbackProps = {
  user: Partial<User>;
  className?: string;
};

export function AvatarWithFallback({ user, className = "" }: AvatarWithFallbackProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar} alt={user.name || "User"} />
      <AvatarFallback className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
        {user.name ? getInitials(user.name) : "U"}
      </AvatarFallback>
    </Avatar>
  );
}

import { User } from "../common/types";
import UserAvatar from "./avatar/avatar";
interface CardProps {
  displayedUser: User | null;
}

export const Card = ({ displayedUser }: CardProps) => {
  return (
    <div>
      <p>Name: {displayedUser?.name}</p>
      <p>id: {displayedUser?.id}</p>
      <UserAvatar
        pictureUrl={displayedUser?.pictureUrl}
        width="300px"
        height="300px"
      />
    </div>
  );
};

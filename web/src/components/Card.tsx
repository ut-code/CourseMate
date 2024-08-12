import { User } from "../common/types";
import UserAvatar from "./avatar/avatar";
interface CardProps {
  displayedUser: User | null;
}

export const Card = ({ displayedUser }: CardProps) => {
  const NameTag = displayedUser?.name
    ? ({ name }: { name: string | undefined }) => <p>{name}</p>
    : () => null;
  const IdTag = displayedUser?.id
    ? ({ id }: { id: number | undefined }) => <p>{id}</p>
    : () => null;
  return (
    <div>
      <NameTag name={displayedUser?.name} />
      <IdTag id={displayedUser?.id} />
      <UserAvatar
        pictureUrl={displayedUser?.pictureUrl}
        width="300px"
        height="300px"
      />
    </div>
  );
};

type RelationshipStatus = "PENDING" | "MATCHED" | "REJECTED";

export type Relationship = {
  id: number;
  requestingUserId: number;
  requestedUserId: number;
  status: RelationshipStatus;
};

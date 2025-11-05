export type TComment = {
  id: string;
  bookSlug: string;
  fullName: string;
  text: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
};


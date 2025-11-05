export type TComment = {
  id: string;
  bookSlug: string;
  bookName?: string;
  fullName: string;
  text: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
};


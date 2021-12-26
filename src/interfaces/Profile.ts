interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    profession: string;
    balance: number;
    type: "client" | "contractor";
    createdAt: Date;
    updatedAt: Date;
}

export default Profile
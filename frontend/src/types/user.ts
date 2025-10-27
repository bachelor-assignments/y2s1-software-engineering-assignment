export interface PostUserParams {
    role: "admin" | "editor" | "viewer";
    username: string;
    password: string;
}
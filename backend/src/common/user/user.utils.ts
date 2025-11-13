import { User } from "./user.interface";

const superUserRoles = ['KF_SUPER_USER', 'GLOBAL_ADMIN'];

export const checkIfSuperUser = (user: User): boolean =>
    (user?.roles || []).some(role => superUserRoles.includes(role?.type));

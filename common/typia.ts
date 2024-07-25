import typia from 'typia';
import { User } from './types';

export function assertUser(input: unknown): User{
    return typia.assert<User>(input);
};
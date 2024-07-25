import { assert } from 'typia';
import { User } from './types';
export function assertUser(input: unknown): User {
    return assert<User>(input);
}


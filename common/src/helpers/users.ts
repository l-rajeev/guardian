
import { AuthEvents, GenerateUUIDv4, IRootConfig, UserRole } from '@guardian/interfaces';
import { Singleton } from '../decorators/singleton';
import { KeyType, Wallet } from './wallet';
import { NatsService } from '../mq';
import { AuthenticatedRequest, IAuthUser } from '../interfaces';

/**
 * Users service
 */
@Singleton
export class Users extends NatsService {
    /**
     * Wallet helper
     * @private
     */
    private readonly wallet: Wallet;

    /**
     * Message queue name
     */
    public messageQueueName = 'users-service-' + GenerateUUIDv4();

    /**
     * Reply subject
     * @private
     */
    public replySubject = this.messageQueueName + `-reply-${GenerateUUIDv4()}`;

    constructor() {
        super();
        this.wallet = new Wallet();
    }

    /**
     * Get user
     * @param target
     * @private
     */
    private async _getUser(target: IAuthUser | AuthenticatedRequest): Promise<IAuthUser> {
        let user: IAuthUser;
        if (!target) {
            return null;
        }
        if (!!(target as IAuthUser).username) {
            user = target as IAuthUser;
        } else {
            if (!(target as AuthenticatedRequest).user || !(target as AuthenticatedRequest).user.username) {
                return null;
            }
            user = await this.sendMessage(AuthEvents.GET_USER, { username: (target as AuthenticatedRequest).user.username });
        }
        return user;
    }

    /**
     * User permission
     * @param target
     * @param role
     */
    public async permission(target: IAuthUser | AuthenticatedRequest, role: UserRole | UserRole[]): Promise<boolean> {
        const user = await this._getUser(target);
        if (!user) {
            return false;
        }
        if (Array.isArray(role)) {
            return role.indexOf(user.role) !== -1;
        } else {
            return user.role === role;
        }
    }

    /**
     * Return current user
     * @param req
     */
    public async currentUser(req: AuthenticatedRequest): Promise<IAuthUser> {
        return await this._getUser(req);
    }

    /**
     * Return user by username
     * @param username
     */
    public async getUser(username: string): Promise<IAuthUser> {
        return await this.sendMessage(AuthEvents.GET_USER, { username });
    }

    /**
     * Return user by did
     * @param did
     */
    public async getUserById(did: string): Promise<IAuthUser> {
        return await this.sendMessage(AuthEvents.GET_USER_BY_ID, { did });
    }

    /**
     * Return user by account
     * @param account
     */
    public async getUserByAccount(account: string): Promise<IAuthUser> {
        return await this.sendMessage(AuthEvents.GET_USER_BY_ACCOUNT, { account });
    }

    /**
     * Return user by did
     * @param dids
     */
    public async getUsersByIds(dids: string[]): Promise<IAuthUser[]> {
        return await this.sendMessage(AuthEvents.GET_USERS_BY_ID, { dids });
    }

    /**
     * Return users with role
     * @param role
     */
    public async getUsersByRole(role: UserRole): Promise<IAuthUser[]> {
        return await this.sendMessage(AuthEvents.GET_USERS_BY_ROLE, { role });;
    }

    /**
     * Update current user entity
     * @param req
     * @param item
     */
    public async updateCurrentUser(username: string, item: any) {
        return await this.sendMessage(AuthEvents.UPDATE_USER, { username, item });
    }

    /**
     * Save user
     * @param user
     */
    public async save(user: IAuthUser) {
        return await this.sendMessage(AuthEvents.SAVE_USER, user);
    }

    /**
     * Get user by token
     * @param token
     */
    public async getUserByToken(token: string) {
        return await this.sendMessage(AuthEvents.GET_USER_BY_TOKEN, { token });
    }

    /**
     * Register new user
     * @param username
     * @param password
     * @param role
     */
    public async registerNewUser(username: string, password: string, role: string) {
        return await this.sendMessage(AuthEvents.REGISTER_NEW_USER, { username, password, role });
    }

    /**
     * Generate new token
     * @param username
     * @param password
     */
    public async generateNewToken(username: string, password: string) {
        return await this.sendMessage(AuthEvents.GENERATE_NEW_TOKEN, { username, password });
    }

    /**
     * Get all users accounts
     */
    public async getAllUserAccounts() {
        return await this.sendMessage(AuthEvents.GET_ALL_USER_ACCOUNTS);
    }

    /**
     * Get all standard registry accounts
     */
    public async getAllStandardRegistryAccounts(): Promise<unknown[]> {
        return await this.sendMessage(AuthEvents.GET_ALL_STANDARD_REGISTRY_ACCOUNTS);
    }

    /**
     * Get all user accounts demo
     */
    public async getAllUserAccountsDemo() {
        return await this.sendMessage(AuthEvents.GET_ALL_USER_ACCOUNTS_DEMO);
    }

    /**
     * Get hedera account
     * @param did
     */
    public async getHederaAccount(did: string): Promise<IRootConfig> {
        if (!did) {
            throw new Error('Invalid DID');
        }
        const userFull = await this.getUserById(did);
        if (!userFull) {
            throw new Error('User not found');
        }
        const userID = userFull.hederaAccountId;
        const userDID = userFull.did;
        if (!userDID || !userID) {
            throw new Error('Hedera Account not found');
        }
        const userKey = await this.wallet.getKey(userFull.walletToken, KeyType.KEY, userDID);
        return {
            did: userDID,
            hederaAccountId: userID,
            hederaAccountKey: userKey
        }
    }
}

import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IAuthRepository, IAuthService, IUser } from '../interface/interface';
dotenv.config();
const client = new OAuth2Client(process.env.AUTH_GOOGLE_ID);
export class AuthService implements IAuthService {
    private authRepository: IAuthRepository;
    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

async register(data: Partial<IUser>): Promise<{ user: IUser, token: string }> {
    if (!data.email || !data.password) {
        throw new Error('Email and password are required');
    }

    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) throw new Error('Email already exists');

    data.password = await bcrypt.hash(data.password, 10);
    const user = await this.authRepository.createUser(data);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });

    return { user, token };
}

    async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const user = await this.authRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign(
            { id: user._id,},
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        return { user, token };
    }
    async verifyGoogleToken(token: string) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.AUTH_GOOGLE_ID
        });
        return ticket.getPayload();
    }
    async authenticateGoogleUser(accessToken: string) {
        const payload = await this.verifyGoogleToken(accessToken);
        if (!payload) {
            throw new Error("Invalid Google token!");
        }
        const { email, sub: googleId, name, picture } = payload;
        let user = await this.authRepository.findByEmail(email as string);
        const username=email?.split('@')[0];
        if (!user) {
            user = await this.authRepository.createUser({
                email,
                googleId,
                username
            });
        }
        const token = jwt.sign(
            { id: user._id, },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        return { user, token };  
    }
}

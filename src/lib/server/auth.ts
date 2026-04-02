import * as helpers from "$lib/utils/helpers";
import { PrismaClient, type Session } from "$lib/db";
import { DATABASE_URL } from "$env/static/private";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

interface SessionWithToken {
    id: string;
    secretHash: Uint8Array;
    createdAt: Date;
    token: string;
}

class Auth {
    #prisma: PrismaClient;
    #sessionExpiryTime: number;
    #inactivityTimeoutSeconds: number;
    #activityCheckIntervalSeconds: number;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
        this.#sessionExpiryTime = 60 * 60 * 24; // 1 day
        this.#inactivityTimeoutSeconds = 60 * 60 * 24 * 10; // 10 days
        this.#activityCheckIntervalSeconds = 60 * 60; // 1 hour
    }

    async createSession(): Promise<string> {
        const now = new Date();
        const id = helpers.generateSecureRandomString();
        const secret = helpers.generateSecureRandomString();
        const secretHash = await this.#hashSecret(secret);
        const token = id + "." + secret;
        const sessionWithToken: SessionWithToken = {
            id,
            secretHash,
            createdAt: now,
            token,
        };

        await this.#prisma.session.create({
            data: {
                id: Number(sessionWithToken.id),
                secretHash: sessionWithToken.secretHash,
                createdAt: sessionWithToken.createdAt,
            },
        });

        return sessionWithToken.token;
    }

    async #hashSecret(secret: string): Promise<Uint8Array> {
        const secretBytes = new TextEncoder().encode(secret);
        const secretHashBuffer = await crypto.subtle.digest(
            "SHA-256",
            secretBytes,
        );
        return new Uint8Array(secretHashBuffer);
    }

    async validateSessionToken(token: string): Promise<Session | null> {
        const now = new Date();
        const tokenParts = token.split(".");
        if (tokenParts.length !== 2) {
            return null;
        }
        const sessionId = tokenParts[0];
        const sessionSecret = tokenParts[1];

        const session = await this.getSession(sessionId);
        if (!session) {
            return null;
        }

        const tokenSecretHash = await this.#hashSecret(sessionSecret);
        const validSecret = helpers.constantTimeEqual(
            tokenSecretHash,
            session.secretHash,
        );

        if (!validSecret) {
            return null;
        }

        if (
            session.lastVerifiedAt &&
            now.getTime() - session.lastVerifiedAt.getTime() >=
                this.#activityCheckIntervalSeconds * 1000
        ) {
            await this.#prisma.session.update({
                where: { id: Number(sessionId) },
                data: { lastVerifiedAt: now },
            });
        }

        return session;
    }

    async getSession(sessionId: string): Promise<Session | null> {
        const now = new Date();
        const result = await this.#prisma.session.findUnique({
            where: { id: Number(sessionId) },
        });

        if (!result) return null;

        const session: Session = {
            id: result.id,
            secretHash: result.secretHash,
            lastVerifiedAt: result.lastVerifiedAt,
            createdAt: result.createdAt,
        };

        // Inactivity timeout
        if (
            session.lastVerifiedAt &&
            now.getTime() - session.lastVerifiedAt.getTime() >=
                this.#inactivityTimeoutSeconds * 1000
        ) {
            await this.#prisma.session.delete({
                where: { id: Number(sessionId) },
            });
            return null;
        }

        return session;
    }
}

export default new Auth(
    new PrismaClient({
        adapter: new PrismaPostgresAdapter({ connectionString: DATABASE_URL }),
    }),
);

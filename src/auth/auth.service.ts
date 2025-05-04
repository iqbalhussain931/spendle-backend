import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthSignupDto, AuthSigninDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthSignupDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);

      // Save the new user in the database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          name: dto.name,
        },
      });

      // delete user.hash; // Remove the hash from the user object before returning

      // retrun the saved user
      return this.signToken(user.id, user.email);
    } catch (error) {
      // Handle any errors that occur during the signup process
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle specific Prisma errors, e.g., unique constraint violation
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      // For any other errors, throw a generic error
      throw new Error('Signup failed');
    }
  }

  async signin(dto: AuthSigninDto) {
    // Finder the user by email.
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If the user not exist thorw an exception.
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Ccompare the password with the hash.
    const passwordMatches = await argon.verify(user.hash, dto.password);

    // If the password is incorrect, throw an exception.
    if (!passwordMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // If the password is correct, return the JWT token. Sign and return the JWT token
    return this.signToken(user.id, user.email);
  }

  logout() {}

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    // Create a JWT token with userId and email as payload
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET'); // Get the secret from environment variables

    // Generate a signed JWT token asynchronously
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m', // Set token expiration time
      secret: secret, // Use environment variable for secret
    });

    return {
      access_token: token, // Return the signed token
    };
  }

  refreshToken() {}

  validateToken() {}
}

export default AuthService;

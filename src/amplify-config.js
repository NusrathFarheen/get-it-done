import { Amplify } from 'aws-amplify';

/**
 * GetItDone — AWS Amplify Configuration
 *
 * MANUAL STEP REQUIRED:
 * ─────────────────────
 * 1. Go to AWS Console → Cognito → Create User Pool (see aws_setup_guide.md)
 * 2. Copy your User Pool ID and App Client ID below
 * 3. Set your AWS region (default: ap-south-1 for India)
 *
 * These are PUBLIC identifiers — safe to commit to Git.
 * Never put secret keys here.
 */

export const COGNITO_CONFIG = {
  userPoolId: 'ap-south-1_ACUiQaDuX',         // ✅ User Pool ID
  userPoolClientId: 'ob5f1f60lpl0ghbu640ppit4p', // ✅ App Client ID
  region: 'ap-south-1',
};

// S3 Storage config for portfolio photos and review images
export const S3_CONFIG = {
  bucket: 'getitdone-uploads-gallery',  // ← Replace with your S3 bucket name after creation
  region: 'ap-south-1',
};

// Returns true if S3 is configured
export const isS3Configured = () => !S3_CONFIG.bucket.includes('XXXX');

// Returns true if Cognito is configured with real values
export const isCognitoConfigured = () =>
  !COGNITO_CONFIG.userPoolId.includes('XXXX') &&
  !COGNITO_CONFIG.userPoolClientId.includes('XXXX');

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: COGNITO_CONFIG.userPoolId,
        userPoolClientId: COGNITO_CONFIG.userPoolClientId,
        loginWith: {
          email: true,
        },
        userAttributes: {
          name: { required: true },
          phone_number: { required: false },
        },
        signUpVerificationMethod: 'code',
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: false,
          requireNumbers: true,
          requireSpecialCharacters: false,
        },
      },
    },
    // S3 Storage — enable when bucket is created
    ...(isS3Configured() && {
      Storage: {
        S3: {
          bucket: S3_CONFIG.bucket,
          region: S3_CONFIG.region,
        },
      },
    }),
  });
}

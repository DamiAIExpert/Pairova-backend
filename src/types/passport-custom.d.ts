declare module 'passport-custom' {
  import { Request } from 'express';
  import { Strategy as PassportStrategy } from 'passport';

  /**
   * Passport-Custom Strategy declaration
   *
   * @param verify - A function that receives the request and a callback.
   *                Call `done(null, user)` if authentication succeeds,
   *                or `done(null, false)` if it fails.
   */
  export class Strategy extends PassportStrategy {
    /**
     * @constructor
     * @param verify - Function to handle authentication.
     */
    constructor(
      verify: (
        req: Request,
        done: (error: any, user?: any, info?: any) => void
      ) => void
    );

    name: string;
  }

  export default Strategy;
}

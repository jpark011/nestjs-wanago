import { LocalAuthenticationGuard } from './local-authentication.guard';

describe('LocalAuthenticationGuard', () => {
  it('should be defined', () => {
    expect(new LocalAuthenticationGuard()).toBeDefined();
  });
});

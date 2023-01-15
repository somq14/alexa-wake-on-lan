import { AxiosInstance } from "axios";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;
};

export class LoginWithAmazonService {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async useAuthorizationCode(
    authorizationCode: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const res = await this.httpClient.post<TokenResponse>(
      "https://api.amazon.co.jp/auth/o2/token",
      {
        grant_type: "authorization_code",
        code: authorizationCode,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }
    );

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
  }

  async useRefreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const res = await this.httpClient.post<TokenResponse>(
      "https://api.amazon.co.jp/auth/o2/token",
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }
    );

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
  }
}

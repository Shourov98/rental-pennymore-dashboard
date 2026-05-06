let sessionAccessToken: string | null = null;

export const getSessionAccessToken = () => sessionAccessToken;

export const setSessionAccessToken = (token: string | null) => {
  sessionAccessToken = token;
};

export const clearSessionAccessToken = () => {
  sessionAccessToken = null;
};

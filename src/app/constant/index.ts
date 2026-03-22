const userRole: {
  user: string;
  provider: string;
  admin: string;
} = {
  user: 'user',
  provider: 'provider',
  admin: 'admin',
} as const;

export default userRole;

import { Request, Response } from 'express';

export function logout(req: Request, res: Response) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success', message: 'Sucessfully logout.' });
}

export function example() {}

/* export class AuthController {
  static login = async (req: Request, res: Response) => {
    res.json();
  };
} */

export default{

    /**
     * @description Get all Users List
     */
    getAllUsers: async ({ response }: { response: any }) => {
        const data = "test";
        response.status = 200;
        response.body = {
          success: true,
          data,
        };
    },
}
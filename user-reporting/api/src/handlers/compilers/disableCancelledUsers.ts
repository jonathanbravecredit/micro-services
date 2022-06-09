import { Handler } from 'aws-lambda';
import { deleteUser } from 'libs/db/cognito';

export const main: Handler = async (event: any) => {
  const { list } = event;
  if (!list || !list.length) {
    console.log('no list provided');
    return;
  }
  const cancellations = list as Array<string>;
  try {
    while (cancellations.length) {
      const queue = cancellations.splice(0, 10);
      await new Promise((resolve) => {
        setTimeout(async () => {
          const deleted = await Promise.all(
            queue.map(async (id) => {
              if (!id) return;
              return await deleteUser(id);
            }),
          );
          resolve(deleted);
        }, 1001);
      });
      console.log('cancellations length: ', cancellations.length);
    }
  } catch (err) {
    console.log(err);
  }
};

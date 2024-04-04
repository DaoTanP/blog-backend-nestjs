import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Post } from '@modules/post/entities/post.entity';

export const PostFactory = setSeederFactory(Post, (faker: Faker) => {
  const post = new Post();
  post.title = faker.word.words({ count: { min: 5, max: 20 } });
  post.body = faker.word.words({ count: { min: 50, max: 2000 } });

  return post;
});

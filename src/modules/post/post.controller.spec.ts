import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';

describe('PostController', () => {
  let postController: PostController;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
    }).compile();

    postController = testingModule.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });
});

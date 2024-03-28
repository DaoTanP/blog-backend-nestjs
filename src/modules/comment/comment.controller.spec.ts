import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';

describe('CommentController', () => {
  let commentController: CommentController;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
    }).compile();

    commentController = testingModule.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });
});

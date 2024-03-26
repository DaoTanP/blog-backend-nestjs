import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let commentService: CommentService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [CommentService],
    }).compile();

    commentService = testingModule.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });
});

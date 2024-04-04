import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let photoService: PhotoService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [PhotoService],
    }).compile();

    photoService = testingModule.get<PhotoService>(PhotoService);
  });

  it('should be defined', () => {
    expect(photoService).toBeDefined();
  });
});

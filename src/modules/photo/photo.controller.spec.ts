import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';

describe('PhotoController', () => {
  let photoController: PhotoController;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
    }).compile();

    photoController = testingModule.get<PhotoController>(PhotoController);
  });

  it('should be defined', () => {
    expect(photoController).toBeDefined();
  });
});

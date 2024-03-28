import { Test, TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';

describe('PostController', () => {
  let albumController: AlbumController;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
    }).compile();

    albumController = testingModule.get<AlbumController>(AlbumController);
  });

  it('should be defined', () => {
    expect(albumController).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';

describe('AlbumService', () => {
  let albumService: AlbumService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [AlbumService],
    }).compile();

    albumService = testingModule.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(albumService).toBeDefined();
  });
});

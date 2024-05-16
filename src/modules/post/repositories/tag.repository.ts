import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsRelations, ILike, Repository } from 'typeorm';
import { Tag } from '@modules/post/entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<Tag> {
  private findOptionRelations: FindOptionsRelations<Tag> = {};

  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  getAll(): Promise<Tag[]> {
    return this.find({ relations: this.findOptionRelations });
  }

  getById(id: string): Promise<Tag> {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  getByName(name: string): Promise<Tag> {
    return this.findOne({
      where: { name },
      relations: this.findOptionRelations,
    });
  }

  findTag(tagName: string): Promise<Tag[]> {
    return this.find({
      where: { name: ILike(`${tagName}%`) },
      relations: this.findOptionRelations,
    });
  }

  addTag(tagName: string): Promise<Tag> {
    const tag: Tag = this.create({ name: tagName });

    return this.save(tag);
  }
}

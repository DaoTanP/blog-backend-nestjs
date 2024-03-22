import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Company } from '@modules/user/entities/company.entity';
import { CompanyDTO } from '@modules/user/dto/company.dto';

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(private dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

  async getAll(): Promise<Company[]> {
    return this.find();
  }

  async getById(id: number): Promise<Company> {
    return this.findOne({
      where: { id },
    });
  }

  async get(companyDto: CompanyDTO): Promise<Company> {
    return this.findOne({
      where: companyDto,
    });
  }

  async add(companyDto: CompanyDTO): Promise<Company> {
    const company: Company = this.create(companyDto);
    return this.save(company);
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}

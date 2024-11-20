// src/modules/repository/dtos/repositories.update.dto.ts
import { PartialType } from '@nestjs/swagger';
import { RepositoryCreateDto } from './repositories.create.dto';

export class RepositoryUpdateDto extends PartialType(RepositoryCreateDto) {}

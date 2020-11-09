import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attach', { schema: 'nest_project' })
export class AttachEntity extends BaseEntity {
  @ApiProperty({ description: '主键' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @ApiProperty({ description: '文件名称' })
  @Column('varchar', { name: 'attachname', length: 255 })
  attachname: string;

  @ApiProperty({ description: '文件路径' })
  @Column('varchar', { name: 'filepath', length: 255 })
  filepath: string;

  @ApiProperty({ description: '附件大小' })
  @Column('int', { name: 'size', unsigned: true, default: () => "'0'" })
  size: number;

  @ApiProperty({ description: '文件拓展名' })
  @Column('varchar', { name: 'extension', length: 50 })
  extension: string;

  @ApiProperty({ description: 'mime类型' })
  @Column('varchar', { name: 'mimetype', length: 100 })
  mimetype: string;

  @ApiProperty({ description: '文件sha1' })
  @Column('varchar', { name: 'sha1', length: 50 })
  sha1: string;

  @ApiProperty({ description: '备注' })
  @Column('varchar', { name: 'note', length: 255 })
  note: string;

  @ApiProperty({ description: '创建时间' })
  @Column('int', { name: 'crtime', default: () => "'0'" })
  crtime: number;

  @ApiProperty({ description: '更新时间' })
  @Column('int', { name: 'uptime' })
  uptime: number;

  @ApiProperty({ description: '状态，0禁用，1正常  -1删除' })
  @Column('tinyint', { name: 'status', default: () => "'1'" })
  status: number;

  @ApiProperty({ description: '添加用户id' })
  @Column('int', {
    name: 'user_id',
    nullable: true,
    unsigned: true,
    default: () => "'0'",
  })
  userId: number | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//user---表名称   schma---数据库名称
@Entity('user', { schema: 'nest_project' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: '主键' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @ApiProperty({ description: '昵称' })
  @Column('varchar', { name: 'nickname', length: 64, default: () => "''" })
  nickname: string;

  @ApiProperty({ description: '真实姓名' })
  @Column('varchar', { name: 'truename', length: 64, default: () => "''" })
  truename: string;

  @ApiProperty({ description: '手机号' })
  @Column('varchar', { name: 'mobile', length: 32, default: () => "''" })
  mobile: string;

  @ApiProperty({ description: '头像' })
  @Column('longtext', { name: 'avatar' })
  avatar: string;

  @ApiProperty({ description: '密码' })
  @Column('varchar', { name: 'password', nullable: true, length: 32 })
  password: string | null;

  @ApiProperty({ description: '盐' })
  @Column('varchar', { name: 'salt', nullable: true, length: 8 })
  salt: string | null;

  @ApiProperty({ description: '性别 0未知 1男性 2女性' })
  @Column('tinyint', { name: 'gender', default: () => "'0'" })
  gender: number;

  @Column('varchar', { name: 'openid', length: 100, default: () => "''" })
  openid: string;

  @Column('varchar', { name: 'unionid', length: 100, default: () => "''" })
  unionid: string;

  @ApiProperty({ description: '创建时间' })
  @Column('int', { name: 'crtime', default: () => "'0'" })
  crtime: number;

  @ApiProperty({ description: '更新时间' })
  @Column('int', { name: 'uptime', default: () => "'0'" })
  uptime: number;

  @ApiProperty({ description: '状态：0停用 1启用 -1 删除' })
  @Column('tinyint', { name: 'status', default: () => "'1'" })
  status: number;
}

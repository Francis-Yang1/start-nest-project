import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//微信登录临时表
// @Index('mob', ['mobile'], {}) 索引
@Entity('tmplogin', { schema: 'nest_project' })
export class TmploginEntity extends BaseEntity {
  @ApiProperty({ description: '主键' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  //本系统应用编码，自定义，这里取项目名称首字母：start-nest-project
  @ApiProperty({ description: '本系统应用编码' })
  @Column('varchar', { name: 'appcode', nullable: true, length: 20 })
  appcode: string | null;

  @Column('varchar', { name: 'openid', nullable: true, length: 64 })
  openid: string | null;

  @Column('varchar', { name: 'unionid', nullable: true, length: 64 })
  unionid: string | null;

  @ApiProperty({ description: '微信登录临时code' })
  @Column('varchar', { name: 'code', nullable: true, length: 64 })
  code: string | null;

  @ApiProperty({ description: '手机号' })
  @Column('varchar', { name: 'mobile', nullable: true, length: 32 })
  mobile: string | null;

  @Column('varchar', { name: 'session_key', nullable: true, length: 64 })
  sessionKey: string | null;

  @ApiProperty({ description: '错误信息' })
  @Column('varchar', { name: 'errmsg', nullable: true, length: 64 })
  errmsg: string | null;

  @ApiProperty({ description: '昵称' })
  @Column('varchar', { name: 'nickname', nullable: true, length: 128 })
  nickname: string | null;

  @ApiProperty({ description: '公共号为headimgurl' })
  @Column('varchar', { name: 'avatarUrl', nullable: true, length: 255 })
  avatarUrl: string | null;

  @ApiProperty({ description: '县/乡' })
  @Column('varchar', { name: 'country', nullable: true, length: 32 })
  country: string | null;

  @ApiProperty({ description: '省' })
  @Column('varchar', { name: 'province', nullable: true, length: 32 })
  province: string | null;

  @ApiProperty({ description: '市' })
  @Column('varchar', { name: 'city', nullable: true, length: 32 })
  city: string | null;

  @ApiProperty({ description: '小程序gender，公众号为sex，1男2女其它未知' })
  @Column('tinyint', { name: 'gender', nullable: true })
  gender: number | null;

  @ApiProperty({ description: '语言' })
  @Column('varchar', { name: 'language', nullable: true, length: 16 })
  language: string | null;

  @ApiProperty({ description: '加密算法的初始向量' })
  @Column('varchar', { name: 'iv', nullable: true, length: 32 })
  iv: string | null;

  @ApiProperty({ description: '数字签名' })
  @Column('varchar', { name: 'signature', nullable: true, length: 64 })
  signature: string | null;

  @ApiProperty({ description: '微信加密数据' })
  @Column('varchar', { name: 'encryptedData', nullable: true, length: 500 })
  encryptedData: string | null;

  @ApiProperty({ description: '导入时间' })
  @Column('int', { name: 'crtime', nullable: true, default: () => "'0'" })
  crtime: number | null;

  @ApiProperty({ description: '更新时间' })
  @Column('int', { name: 'uptime', nullable: true })
  uptime: number | null;

  @ApiProperty({ description: '状态: 0禁用，1正常  -1删除' })
  @Column('tinyint', { name: 'status', nullable: true, default: () => "'1'" })
  status: number | null;

  @ApiProperty({ description: '是否关注公众号' })
  @Column('tinyint', { name: 'subscribe', nullable: true })
  subscribe: number | null;

  @ApiProperty({ description: '关注公众号时间' })
  @Column('int', { name: 'subscribe_time', nullable: true })
  subscribeTime: number | null;

  @ApiProperty({ description: '关注渠道来源' })
  @Column('varchar', { name: 'subscribe_scene', nullable: true, length: 64 })
  subscribeScene: string | null;

  @ApiProperty({ description: '公众号access_token' })
  @Column('varchar', { name: 'access_token', nullable: true, length: 128 })
  accessToken: string | null;

  @Column('varchar', { name: 'refresh_token', nullable: true, length: 128 })
  refreshToken: string | null;
}
